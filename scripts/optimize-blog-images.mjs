import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { unlink, copyFile } from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '../public/blog')

const map = [
  ['blog-temp-ai-investment.png', 'ai-investment-trends-2024'],
  ['blog-temp-real-estate-strategy.png', 'real-estate-investment-strategy-2025'],
  ['blog-temp-proptech.png', 'real-estate-innovation-disruption'],
  ['blog-temp-ecosystem.png', 'building-entrepreneurial-ecosystem'],
]

async function processImage(inputName, slug) {
  const input = join(dir, inputName)
  const base = join(dir, slug)

  await sharp(input)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82, effort: 6 })
    .toFile(`${base}-og.webp`)

  await sharp(input)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(`${base}-og.jpg`)

  await sharp(input)
    .resize(800, 420, { fit: 'cover', position: 'attention' })
    .webp({ quality: 80, effort: 6 })
    .toFile(`${base}-card.webp`)

  await unlink(input)
}

for (const [file, slug] of map) {
  await processImage(file, slug)
}

await copyFile(
  join(dir, 'building-entrepreneurial-ecosystem-og.webp'),
  join(dir, 'blog-index-og.webp')
)
await copyFile(
  join(dir, 'building-entrepreneurial-ecosystem-og.jpg'),
  join(dir, 'blog-index-og.jpg')
)

console.log('Blog images: OG 1200x630 webp+jpeg, 800x420 card webp, blog-index copied from ecosystem.')
