'use client'

import { useState, useEffect } from 'react'
import { Calculator, Download, Share2, Info, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface TaxBrackets {
  rate: number
  threshold: number
}

interface CalculationResult {
  grossAnnual: number
  grossMonthly: number
  taxFreeAllowance: number
  taxableIncome: number
  payeTax: number
  epfContribution: number
  etfContribution: number
  totalDeductions: number
  netAnnual: number
  breakdown: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
  taxBreakdown: Array<{
    bracket: string
    taxableAmount: number
    taxAmount: number
  }>
}

// Sri Lanka PAYE Tax Brackets (2025) - Updated April 2025 rates
const SRI_LANKA_TAX_BRACKETS: TaxBrackets[] = [
  { rate: 0.06, threshold: 2800000 },   // 6% on first 1,000,000 after tax-free allowance
  { rate: 0.18, threshold: 3300000 },   // 18% on next 500,000
  { rate: 0.24, threshold: 3800000 },   // 24% on next 500,000
  { rate: 0.30, threshold: 4300000 },   // 30% on next 500,000
  { rate: 0.36, threshold: Infinity }   // 36% on remaining
]

const TAX_FREE_ALLOWANCE = 1800000 // Annual tax-free allowance (increased from 1.2M to 1.8M)
const EPF_RATE = 0.08 // 8% of gross salary
const ETF_RATE = 0.03 // 3% of gross salary

export default function SriLankaPAYECalculator() {
  const [salary, setSalary] = useState<string>('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showInfo, setShowInfo] = useState(true)

  const calculateTakeHomePay = (): CalculationResult | null => {
    const grossAnnual = parseFloat(salary) || 0

    if (grossAnnual <= 0) return null

    const grossMonthly = grossAnnual / 12
    const taxFreeAllowance = Math.min(TAX_FREE_ALLOWANCE, grossAnnual)
    const taxableIncome = Math.max(0, grossAnnual - taxFreeAllowance)
    
    // Calculate PAYE tax using progressive tax brackets
    let payeTax = 0
    let remainingIncome = taxableIncome
    const taxBreakdown: Array<{ bracket: string; taxableAmount: number; taxAmount: number }> = []

    for (let i = 0; i < SRI_LANKA_TAX_BRACKETS.length && remainingIncome > 0; i++) {
      const bracket = SRI_LANKA_TAX_BRACKETS[i]
      const previousThreshold = i === 0 ? 0 : SRI_LANKA_TAX_BRACKETS[i - 1].threshold
      const bracketSize = bracket.threshold - previousThreshold
      const taxableInBracket = Math.min(remainingIncome, bracketSize)
      
      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate
        payeTax += taxInBracket
        
        taxBreakdown.push({
          bracket: `${(bracket.rate * 100).toFixed(0)}% (${formatCurrency(previousThreshold)} - ${bracket.threshold === Infinity ? '∞' : formatCurrency(bracket.threshold)})`,
          taxableAmount: taxableInBracket,
          taxAmount: taxInBracket
        })
        
        remainingIncome -= taxableInBracket
      }
    }

    // Calculate EPF and ETF contributions
    const epfContribution = grossAnnual * EPF_RATE
    const etfContribution = grossAnnual * ETF_RATE

    // Calculate total deductions and net salary
    const totalDeductions = payeTax + epfContribution + etfContribution
    const netAnnual = grossAnnual - totalDeductions

    return {
      grossAnnual,
      grossMonthly,
      taxFreeAllowance,
      taxableIncome,
      payeTax,
      epfContribution,
      etfContribution,
      totalDeductions,
      netAnnual,
      breakdown: {
        daily: netAnnual / 365,
        weekly: netAnnual / 52,
        monthly: netAnnual / 12,
        yearly: netAnnual
      },
      taxBreakdown
    }
  }

  useEffect(() => {
    const calculation = calculateTakeHomePay()
    setResult(calculation)
  }, [salary])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatCurrencyDetailed = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getPieChartData = () => {
    if (!result) return []
    
    return [
      { name: 'Net Take Home Pay', value: result.netAnnual, color: '#10b981' },
      { name: 'PAYE Tax', value: result.payeTax, color: '#ef4444' },
      { name: 'EPF Contribution', value: result.epfContribution, color: '#3b82f6' },
      { name: 'ETF Contribution', value: result.etfContribution, color: '#8b5cf6' }
    ].filter(item => item.value > 0)
  }

  const downloadResults = () => {
    if (!result) return

    // Create PDF content using HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sri Lanka PAYE Tax Calculator Results</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #ef4a3a; }
        .section { margin: 20px 0; }
        .section h2 { color: #ef4a3a; border-bottom: 2px solid #ef4a3a; padding-bottom: 5px; }
        .breakdown { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total { font-weight: bold; font-size: 18px; color: #ef4a3a; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Dias Global Limited</div>
        <h1>Sri Lanka PAYE Tax Calculator Results</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-GB')}</p>
      </div>

      <div class="section">
        <h2>Salary Details</h2>
        <div class="breakdown">
          <div class="row"><span>Gross Annual Salary:</span><span>${formatCurrency(result.grossAnnual)}</span></div>
          <div class="row"><span>Gross Monthly Salary:</span><span>${formatCurrency(result.grossMonthly)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Tax Breakdown</h2>
        <div class="breakdown">
          <div class="row"><span>Tax-Free Allowance:</span><span>${formatCurrency(result.taxFreeAllowance)}</span></div>
          <div class="row"><span>Taxable Income:</span><span>${formatCurrency(result.taxableIncome)}</span></div>
          ${result.taxBreakdown.map(bracket => `
            <div class="row"><span>${bracket.bracket}:</span><span>${formatCurrency(bracket.taxAmount)}</span></div>
          `).join('')}
          <div class="row total"><span>Total PAYE Tax:</span><span>${formatCurrency(result.payeTax)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Provident Fund Contributions</h2>
        <div class="breakdown">
          <div class="row"><span>EPF Contribution (8%):</span><span>${formatCurrency(result.epfContribution)}</span></div>
          <div class="row"><span>ETF Contribution (3%):</span><span>${formatCurrency(result.etfContribution)}</span></div>
          <div class="row total"><span>Total Fund Contributions:</span><span>${formatCurrency(result.epfContribution + result.etfContribution)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Take Home Pay Breakdown</h2>
        <div class="breakdown">
          <div class="row"><span>Daily:</span><span>${formatCurrency(result.breakdown.daily)}</span></div>
          <div class="row"><span>Weekly:</span><span>${formatCurrency(result.breakdown.weekly)}</span></div>
          <div class="row"><span>Monthly:</span><span>${formatCurrency(result.breakdown.monthly)}</span></div>
          <div class="row total"><span>Annual:</span><span>${formatCurrency(result.breakdown.yearly)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Summary</h2>
        <div class="breakdown">
          <div class="row"><span>Total Deductions:</span><span>${formatCurrency(result.totalDeductions)}</span></div>
          <div class="row total"><span>Net Take Home Pay:</span><span>${formatCurrency(result.netAnnual)}</span></div>
        </div>
      </div>

      <div class="footer">
        <p>Generated by Dias Global Limited</p>
        <p>https://diasglobal.co.uk/tools/sri-lanka-paye-calculator</p>
        <p>This calculator is for informational purposes only and should not be considered as financial advice.</p>
      </div>
    </body>
    </html>
    `

    // Create a new window and print as PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  const shareResults = async () => {
    if (!result) return

    const shareData = {
      title: 'Sri Lanka PAYE Tax Calculator Results',
      text: `My take-home pay: ${formatCurrency(result.breakdown.monthly)}/month (${formatCurrency(result.breakdown.yearly)}/year)`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`)
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-bg to-bg-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calculator className="w-4 h-4" />
              Sri Lanka Financial Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sri Lanka PAYE Tax
              <span className="text-accent block">Calculator</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Calculate your take-home pay after PAYE tax, EPF, and ETF deductions in Sri Lanka. Updated with 2025 tax rates including the new LKR 1.8M tax-free allowance.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-accent" />
                Salary Details
              </h2>

              <div className="space-y-6">
                {/* Annual Salary */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Annual Gross Salary (LKR)
                  </label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g., 1200000"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Info about deductions */}
                <div className="bg-bg rounded-xl p-4 border border-border">
                  <h3 className="font-semibold mb-2 text-accent">Standard Deductions</h3>
                  <ul className="text-sm text-muted space-y-1">
                    <li>• Tax-Free Allowance: LKR 1,800,000 per year</li>
                    <li>• EPF Contribution: 8% of gross salary</li>
                    <li>• ETF Contribution: 3% of gross salary</li>
                    <li>• PAYE Tax: Progressive rates from 6% to 36%</li>
                  </ul>
                </div>
              </div>

              {/* Info Button */}
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <Info className="w-4 h-4" />
                  How does this calculator work?
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <>
                  {/* Main Results */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-accent" />
                      Your Take Home Pay
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-bg rounded-xl">
                        <div className="text-2xl font-bold text-accent">
                          {formatCurrency(result.breakdown.monthly)}
                        </div>
                        <div className="text-sm text-muted">Monthly</div>
                      </div>
                      <div className="text-center p-4 bg-bg rounded-xl">
                        <div className="text-2xl font-bold text-accent">
                          {formatCurrency(result.breakdown.yearly)}
                        </div>
                        <div className="text-sm text-muted">Annual</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-bg rounded-lg">
                        <div className="text-lg font-semibold">
                          {formatCurrency(result.breakdown.weekly)}
                        </div>
                        <div className="text-xs text-muted">Weekly</div>
                      </div>
                      <div className="text-center p-3 bg-bg rounded-lg">
                        <div className="text-lg font-semibold">
                          {formatCurrency(result.breakdown.daily)}
                        </div>
                        <div className="text-xs text-muted">Daily</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Detailed Breakdown</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Gross Annual Salary</span>
                        <span className="font-semibold">{formatCurrency(result.grossAnnual)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Tax-Free Allowance</span>
                        <span className="text-green-400">-{formatCurrency(result.taxFreeAllowance)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Taxable Income</span>
                        <span>{formatCurrency(result.taxableIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>PAYE Tax</span>
                        <span className="text-red-400">-{formatCurrency(result.payeTax)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>EPF Contribution (8%)</span>
                        <span className="text-red-400">-{formatCurrency(result.epfContribution)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>ETF Contribution (3%)</span>
                        <span className="text-red-400">-{formatCurrency(result.etfContribution)}</span>
                      </div>

                      <div className="flex justify-between items-center py-3 text-lg font-bold">
                        <span>Net Take Home Pay</span>
                        <span className="text-accent">{formatCurrency(result.netAnnual)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Salary Breakdown</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">PAYE Tax Breakdown</h3>

                    <div className="space-y-3">
                      {result.taxBreakdown.map((bracket, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{bracket.bracket}</span>
                          <span>{formatCurrency(bracket.taxAmount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
                        <span>Total PAYE Tax</span>
                        <span className="text-accent">{formatCurrency(result.payeTax)}</span>
                      </div>
                    </div>
                  </div>

                  {/* EPF/ETF Info */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Provident Fund Contributions</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>EPF (Employee Provident Fund) - 8%</span>
                        <span className="text-blue-400">{formatCurrency(result.epfContribution)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>ETF (Employee Trust Fund) - 3%</span>
                        <span className="text-blue-400">{formatCurrency(result.etfContribution)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
                        <span>Total Fund Contributions</span>
                        <span className="text-accent">{formatCurrency(result.epfContribution + result.etfContribution)}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-bg rounded-xl">
                      <p className="text-sm text-muted">
                        <strong>Note:</strong> EPF and ETF contributions are mandatory deductions that go towards your retirement savings. 
                        These funds are managed by the government and can be withdrawn upon retirement or under specific circumstances.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Share & Download</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={downloadResults}
                        className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Results
                      </button>
                      <button
                        onClick={shareResults}
                        className="flex items-center gap-2 px-6 py-3 bg-bg border border-border rounded-xl hover:border-accent transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Results
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!result && (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <Calculator className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Enter Your Salary Details</h3>
                  <p className="text-muted">
                    Fill in your annual gross salary to see your take-home pay calculation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <div className="mt-8 bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">How This Calculator Works</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted mb-4">
                  This calculator uses the current Sri Lanka PAYE tax system and statutory deductions:
                </p>
                <ul className="space-y-2 text-muted">
                  <li><strong>Tax-Free Allowance:</strong> LKR 1,800,000 per year (first 1,800,000 is tax-free)</li>
                  <li><strong>PAYE Tax Rates:</strong> Progressive rates from 6% to 36% based on income brackets</li>
                  <li><strong>EPF (Employee Provident Fund):</strong> 8% of gross salary - mandatory retirement savings</li>
                  <li><strong>ETF (Employee Trust Fund):</strong> 3% of gross salary - mandatory retirement savings</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Tax Brackets (2025):</strong>
                </p>
                <ul className="space-y-1 text-muted text-sm">
                  <li>• 6% on first LKR 1,000,000 of taxable income (LKR 1,800,001 - 2,800,000)</li>
                  <li>• 18% on next LKR 500,000 (LKR 2,800,001 - 3,300,000)</li>
                  <li>• 24% on next LKR 500,000 (LKR 3,300,001 - 3,800,000)</li>
                  <li>• 30% on next LKR 500,000 (LKR 3,800,001 - 4,300,000)</li>
                  <li>• 36% on remaining income (above LKR 4,300,000)</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Note:</strong> Tax rates and allowances may change. This calculator provides estimates based on current regulations. 
                  For official tax calculations, consult with the Inland Revenue Department of Sri Lanka.
                </p>
              </div>
            </div>
          )}

          {/* Financial Disclaimer */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4 text-accent">Important Disclaimer</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted text-sm leading-relaxed">
                <strong>This calculator is for informational purposes only and should not be considered as financial, tax, or legal advice.</strong> 
                The calculations provided are estimates based on current tax rates and regulations in Sri Lanka and may not reflect your actual take-home pay. 
                Tax rates, allowances, EPF/ETF rates, and regulations can change, and individual circumstances may vary. 
                This calculator does not account for all possible deductions, allowances, or special circumstances that may apply to your specific situation. 
                We recommend consulting with a qualified tax advisor, accountant, or the Inland Revenue Department of Sri Lanka for personalized advice regarding your specific financial situation. 
                Dias Global Limited does not accept any responsibility for decisions made based on the information provided by this calculator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
