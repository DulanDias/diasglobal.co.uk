/**
 * Builds the web-ready Island Merchant image set from the master brand artwork
 * in assets-src/island-merchant/.
 *
 * Run:  npm run island-merchant-images
 *
 * Masters are committed so the derivatives can always be rebuilt. To swap in new
 * photography, replace the master PNG and re-run — every size and format below
 * is regenerated from it.
 */
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdir } from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '../assets-src/island-merchant')
const OUT = join(__dirname, '../public/island-merchant')

/**
 * Flat cream the logo artwork sits on, sampled from the master's corners.
 * Measured: luminance 245.6–251.2, mean 248.5, sd 0.70 — a very tight background,
 * so a luminance key with a narrow ramp separates ink from paper cleanly.
 */
const LOGO_BG = { r: 249, g: 248, b: 242 }
/** Above this luminance a pixel is paper. */
const KEY_CLEAR = 244
/** At or below this luminance a pixel is solid ink. Between the two, a soft edge. */
const KEY_SOLID = 232
/** Luminance of the darkest ink in the master, used to normalise the reversed variant. */
const INK_FLOOR = 40

const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const clamp255 = (v) => Math.max(0, Math.min(255, v))

/**
 * Turns the logo's flat cream background transparent.
 *
 * Edge pixels are anti-aliased blends of ink and paper, so keying them out flat
 * leaves a pale halo. We derive alpha from luminance and then un-blend the source
 * pixel (reversing the `observed = a*true + (1-a)*bg` compositing the artwork was
 * rasterised with), recovering the true ink colour so edges stay clean on any backdrop.
 *
 * `reversed` re-inks the mark for dark backgrounds: the artwork's own tonal range is
 * remapped onto brand gold → cream, so the mark reads as a foil emboss rather than
 * disappearing into a dark panel.
 */
async function keyOutBackground(inputPath, { reversed = false } = {}) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const GOLD = { r: 168, g: 127, b: 66 }
  const CREAM = { r: 245, g: 234, b: 212 }

  const out = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const l = luma(r, g, b)

    const a = Math.max(0, Math.min(1, (KEY_CLEAR - l) / (KEY_CLEAR - KEY_SOLID)))
    if (a <= 0.004) {
      out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0
      continue
    }

    if (reversed) {
      // Remap the artwork's own tonal range onto gold → cream.
      const t = Math.max(0, Math.min(1, (KEY_CLEAR - l) / (KEY_CLEAR - INK_FLOOR)))
      const e = t * t * (3 - 2 * t) // smoothstep, keeps the midtones from muddying
      out[i] = clamp255(GOLD.r + (CREAM.r - GOLD.r) * e)
      out[i + 1] = clamp255(GOLD.g + (CREAM.g - GOLD.g) * e)
      out[i + 2] = clamp255(GOLD.b + (CREAM.b - GOLD.b) * e)
    } else {
      // Un-blend: true = (observed - (1 - a) * bg) / a
      out[i] = clamp255((r - (1 - a) * LOGO_BG.r) / a)
      out[i + 1] = clamp255((g - (1 - a) * LOGO_BG.g) / a)
      out[i + 2] = clamp255((b - (1 - a) * LOGO_BG.b) / a)
    }
    out[i + 3] = Math.round(a * 255)
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
}

/** Product packaging shot → 4:3 card image, webp for the page + jpg as a durable fallback. */
async function packagingShot(master, slug) {
  const input = join(SRC, master)
  await sharp(input)
    .resize(1200, 900, { fit: 'cover' })
    .webp({ quality: 86, effort: 6 })
    .toFile(join(OUT, `${slug}.webp`))
  await sharp(input)
    .resize(1200, 900, { fit: 'cover' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(OUT, `${slug}.jpg`))
}

async function main() {
  await mkdir(OUT, { recursive: true })

  await packagingShot('cinnamon-packaging.png', 'cinnamon-quills')
  await packagingShot('jaggery-packaging.png', 'kithul-jaggery')

  // Full lockup (crest + wordmark), transparent. Two inkings: the master artwork
  // for light backgrounds, and a gold/cream reverse for dark panels.
  for (const [suffix, reversed] of [['', false], ['-reverse', true]]) {
    const keyed = await keyOutBackground(join(SRC, 'logo.png'), { reversed })
    const keyedPng = await keyed.png().toBuffer()

    const lockup = sharp(keyedPng).trim({ threshold: 2 })
    const lockupBuf = await lockup.toBuffer()

    await sharp(lockupBuf)
      .resize({ width: 760, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(join(OUT, `island-merchant-logo${suffix}.png`))

    await sharp(lockupBuf)
      .resize({ width: 760, withoutEnlargement: true })
      .webp({ quality: 92, effort: 6, alphaQuality: 100 })
      .toFile(join(OUT, `island-merchant-logo${suffix}.webp`))

    // Crest only — the compass/ship roundel above the wordmark — for compact placements.
    // sharp applies trim BEFORE extract within one pipeline, so the crop has to run
    // in its own instance or it would be measured against the already-trimmed bounds.
    const crest = await sharp(keyedPng)
      .extract({ left: 330, top: 100, width: 600, height: 578 })
      .toBuffer()

    await sharp(crest)
      .trim({ threshold: 2 })
      .resize({ width: 256, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(join(OUT, `island-merchant-mark${suffix}.png`))
  }

  console.log('Island Merchant images written to public/island-merchant/')
}

await main()
