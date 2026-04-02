'use client'

import { useMemo, useState } from 'react'

type TaxBracket = 'basic' | 'higher' | 'additional'

const PSA_GBP: Record<TaxBracket, number> = {
  basic: 1000,
  higher: 500,
  additional: 0,
}

/** Marginal rate on savings interest above the Personal Savings Allowance */
const SAVINGS_TAX_RATE: Record<TaxBracket, number> = {
  basic: 0.2,
  higher: 0.4,
  additional: 0.45,
}

const BRACKET_LABEL: Record<TaxBracket, string> = {
  basic: 'Basic rate (20% on interest above PSA)',
  higher: 'Higher rate (40% on interest above PSA)',
  additional: 'Additional rate (45% on interest above PSA)',
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export default function IsaSavingsCalculator() {
  const [principal, setPrincipal] = useState(20000)
  const [rate, setRate] = useState(4.5)
  const [bracket, setBracket] = useState<TaxBracket>('basic')

  const result = useMemo(() => {
    const p = clamp(principal, 0, 1_000_000)
    const r = clamp(rate, 0, 25)
    const gross = p * (r / 100)
    const psa = PSA_GBP[bracket]
    const taxable = Math.max(0, gross - psa)
    const tax = taxable * SAVINGS_TAX_RATE[bracket]
    const netOrdinary = gross - tax
    const netIsa = gross
    return {
      gross,
      psa,
      taxable,
      tax,
      netOrdinary,
      netIsa,
      diff: netIsa - netOrdinary,
      p,
      r,
    }
  }, [principal, rate, bracket])

  return (
    <div
      className="not-prose my-10 rounded-xl border border-border bg-card p-6 shadow-sm"
      aria-labelledby="isa-calc-heading"
    >
      <h3 id="isa-calc-heading" className="text-xl font-bold text-text mb-2">
        Try your own numbers (illustration only)
      </h3>
      <p className="text-text-muted text-sm mb-6 leading-relaxed">
        Same gross interest rate inside a Cash ISA and in a taxable savings account. Tax uses the Personal
        Savings Allowance rules for England, Wales, and Northern Ireland (Scotland uses different income tax
        bands; this is a simplified model).
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="isa-principal" className="mb-1 block text-sm font-medium text-text">
              Amount saved (£)
            </label>
            <input
              id="isa-principal"
              type="number"
              min={0}
              max={1000000}
              step={100}
              value={Number.isNaN(principal) ? '' : principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="isa-rate" className="mb-1 block text-sm font-medium text-text">
              Gross interest rate (% AER, one year)
            </label>
            <input
              id="isa-rate"
              type="number"
              min={0}
              max={25}
              step={0.01}
              value={Number.isNaN(rate) ? '' : rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="isa-bracket" className="mb-1 block text-sm font-medium text-text">
              Income tax bracket for savings (simplified)
            </label>
            <select
              id="isa-bracket"
              value={bracket}
              onChange={(e) => setBracket(e.target.value as TaxBracket)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="basic">{BRACKET_LABEL.basic}</option>
              <option value="higher">{BRACKET_LABEL.higher}</option>
              <option value="additional">{BRACKET_LABEL.additional}</option>
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg-light/80 p-4 text-sm">
          <p className="font-semibold text-text mb-3">Results (one year, interest only)</p>
          <dl className="space-y-2 text-text-muted">
            <div className="flex justify-between gap-4">
              <dt>Gross interest</dt>
              <dd className="font-mono text-text tabular-nums">
                £{result.gross.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Interest covered by PSA</dt>
              <dd className="font-mono text-text tabular-nums">
                £{Math.min(result.gross, result.psa).toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Taxable interest (after PSA)</dt>
              <dd className="font-mono text-text tabular-nums">
                £{result.taxable.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Tax on ordinary savings</dt>
              <dd className="font-mono text-text tabular-nums">
                £{result.tax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2">
              <dt className="text-text">Net in ordinary account</dt>
              <dd className="font-mono font-semibold text-text tabular-nums">
                £{result.netOrdinary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text">Net in Cash ISA (no tax on interest)</dt>
              <dd className="font-mono font-semibold text-accent tabular-nums">
                £{result.netIsa.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2">
              <dt className="text-text">Extra you keep in the ISA vs taxed savings</dt>
              <dd className="font-mono font-bold text-text tabular-nums">
                £{result.diff.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="mt-4 text-xs text-text-muted leading-relaxed">
        Assumes all interest is non-ISA savings income and falls in your marginal band. Real life can
        include other income, split allowances, and different product rules. Not tax advice.
      </p>
    </div>
  )
}
