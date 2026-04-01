'use client'

import { useState, useEffect } from 'react'
import { Calculator, Download, Share2, Info, PoundSterling, Calendar, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface TaxBrackets {
  basic: { rate: number; threshold: number }
  higher: { rate: number; threshold: number }
  additional: { rate: number; threshold: number }
}

interface NIContributions {
  primary: { rate: number; threshold: number }
  upper: { rate: number; threshold: number }
}

interface CalculationResult {
  grossAnnual: number
  personalAllowance: number
  taxableIncome: number
  incomeTax: number
  nationalInsurance: number
  netAnnual: number
  breakdown: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
  taxBreakdown: {
    basicRate: number
    higherRate: number
    additionalRate: number
  }
  niBreakdown: {
    primary: number
    upper: number
  }
}

const UK_TAX_BRACKETS: Record<string, TaxBrackets> = {
  'England': {
    basic: { rate: 0.20, threshold: 37700 }, // £12,571 to £50,270 (£37,700 above personal allowance)
    higher: { rate: 0.40, threshold: 125140 }, // £50,271 to £125,140
    additional: { rate: 0.45, threshold: Infinity } // Above £125,140
  },
  'Scotland': {
    basic: { rate: 0.20, threshold: 37700 }, // £12,571 to £50,270 (£37,700 above personal allowance)
    higher: { rate: 0.40, threshold: 125140 }, // £50,271 to £125,140
    additional: { rate: 0.45, threshold: Infinity } // Above £125,140
    // Note: Scotland has different rates, using simplified version for now
  },
  'Wales': {
    basic: { rate: 0.20, threshold: 37700 }, // £12,571 to £50,270 (£37,700 above personal allowance)
    higher: { rate: 0.40, threshold: 125140 }, // £50,271 to £125,140
    additional: { rate: 0.45, threshold: Infinity } // Above £125,140
  },
  'Northern Ireland': {
    basic: { rate: 0.20, threshold: 37700 }, // £12,571 to £50,270 (£37,700 above personal allowance)
    higher: { rate: 0.40, threshold: 125140 }, // £50,271 to £125,140
    additional: { rate: 0.45, threshold: Infinity } // Above £125,140
  }
}

const NI_CONTRIBUTIONS: NIContributions = {
  primary: { rate: 0.08, threshold: 12570 }, // 8% as of September 2025
  upper: { rate: 0.02, threshold: 50270 }
}

const PERSONAL_ALLOWANCE = 12570

export default function UKSalaryCalculator() {
  const [salary, setSalary] = useState<string>('')
  const [region, setRegion] = useState<string>('England')
  const [pensionContribution, setPensionContribution] = useState<string>('')
  const [pensionType, setPensionType] = useState<string>('auto-enrolment')
  const [studentLoan, setStudentLoan] = useState<string>('none')
  const [studentLoanAmount, setStudentLoanAmount] = useState<string>('0')
  const [taxCode, setTaxCode] = useState<string>('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showInfo, setShowInfo] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'monthly' | 'weekly' | 'yearly' | 'daily'>('monthly')

  const calculateTakeHomePay = (): CalculationResult | null => {
    const grossAnnual = parseFloat(salary) || 0
    const pensionPercentage = parseFloat(pensionContribution) || 0
    const pension = (grossAnnual * pensionPercentage) / 100

    if (grossAnnual <= 0) return null

    // Calculate student loan repayment based on plan
    let studentLoanRepayment = 0
    if (studentLoan !== 'none') {
      const studentLoanThresholds = {
        'plan1': 22015, // Plan 1 threshold
        'plan2': 27295, // Plan 2 threshold  
        'plan4': 25000, // Plan 4 threshold
        'plan5': 25000, // Plan 5 threshold
        'postgraduate': 21000 // Postgraduate threshold
      }
      const threshold = studentLoanThresholds[studentLoan as keyof typeof studentLoanThresholds] || 0
      const studentLoanRate = studentLoan === 'postgraduate' ? 0.06 : 0.09
      studentLoanRepayment = Math.max(0, (grossAnnual - threshold) * studentLoanRate)
    }

    const personalAllowance = Math.min(PERSONAL_ALLOWANCE, grossAnnual)
    const taxableIncome = Math.max(0, grossAnnual - personalAllowance)
    
    const brackets = UK_TAX_BRACKETS[region]
    let incomeTax = 0
    let taxBreakdown = { basicRate: 0, higherRate: 0, additionalRate: 0 }

    // Calculate income tax using correct thresholds
    if (taxableIncome > 0) {
      // Basic rate: 20% on income between £12,571 and £50,270
      const basicTaxable = Math.min(taxableIncome, brackets.basic.threshold - personalAllowance)
      // Higher rate: 40% on income between £50,271 and £125,140
      const higherTaxable = Math.min(Math.max(0, taxableIncome - (brackets.basic.threshold - personalAllowance)), brackets.higher.threshold - brackets.basic.threshold)
      // Additional rate: 45% on income above £125,140
      const additionalTaxable = Math.max(0, taxableIncome - (brackets.higher.threshold - personalAllowance))

      taxBreakdown.basicRate = basicTaxable * brackets.basic.rate
      taxBreakdown.higherRate = higherTaxable * brackets.higher.rate
      taxBreakdown.additionalRate = additionalTaxable * brackets.additional.rate

      incomeTax = taxBreakdown.basicRate + taxBreakdown.higherRate + taxBreakdown.additionalRate
    }

    // Calculate National Insurance
    let nationalInsurance = 0
    let niBreakdown = { primary: 0, upper: 0 }

    const niPrimaryTaxable = Math.min(grossAnnual, NI_CONTRIBUTIONS.upper.threshold) - NI_CONTRIBUTIONS.primary.threshold
    const niUpperTaxable = Math.max(0, grossAnnual - NI_CONTRIBUTIONS.upper.threshold)

    if (niPrimaryTaxable > 0) {
      niBreakdown.primary = niPrimaryTaxable * NI_CONTRIBUTIONS.primary.rate
    }
    if (niUpperTaxable > 0) {
      niBreakdown.upper = niUpperTaxable * NI_CONTRIBUTIONS.upper.rate
    }

    nationalInsurance = niBreakdown.primary + niBreakdown.upper

    // Calculate net salary
    const totalDeductions = incomeTax + nationalInsurance + pension + studentLoanRepayment
    const netAnnual = grossAnnual - totalDeductions

    return {
      grossAnnual,
      personalAllowance,
      taxableIncome,
      incomeTax,
      nationalInsurance,
      netAnnual,
      breakdown: {
        daily: netAnnual / 365,
        weekly: netAnnual / 52,
        monthly: netAnnual / 12,
        yearly: netAnnual
      },
      taxBreakdown,
      niBreakdown
    }
  }

  useEffect(() => {
    const calculation = calculateTakeHomePay()
    setResult(calculation)
  }, [salary, region, pensionContribution, studentLoanAmount, taxCode])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatCurrencyDetailed = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getPieChartData = () => {
    if (!result) return []
    
    const pension = (parseFloat(pensionContribution) || 0) * parseFloat(salary) / 100
    const studentLoanRepayment = studentLoan !== 'none' ? 
      Math.max(0, (parseFloat(salary) - (studentLoan === 'plan1' ? 22015 : studentLoan === 'plan2' ? 27295 : studentLoan === 'plan4' ? 25000 : studentLoan === 'plan5' ? 25000 : 21000)) * (studentLoan === 'postgraduate' ? 0.06 : 0.09)) : 0

    return [
      { name: 'Net Take Home Pay', value: result.netAnnual, color: '#10b981' },
      { name: 'Income Tax', value: result.incomeTax, color: '#ef4444' },
      { name: 'National Insurance', value: result.nationalInsurance, color: '#f59e0b' },
      { name: 'Pension Contribution', value: pension, color: '#3b82f6' },
      { name: 'Student Loan', value: studentLoanRepayment, color: '#8b5cf6' }
    ].filter(item => item.value > 0)
  }

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6']

  const downloadResults = () => {
    if (!result) return

    // Create PDF content using HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UK Take Home Pay Calculator Results</title>
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
        <h1>UK Take Home Pay Calculator Results</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-GB')}</p>
      </div>

      <div class="section">
        <h2>Salary Details</h2>
        <div class="breakdown">
          <div class="row"><span>Gross Annual Salary:</span><span>${formatCurrency(result.grossAnnual)}</span></div>
          <div class="row"><span>Region:</span><span>${region}</span></div>
          ${taxCode ? `<div class="row"><span>Tax Code:</span><span>${taxCode}</span></div>` : ''}
          ${pensionContribution ? `<div class="row"><span>Pension Contribution:</span><span>${pensionContribution}% (${pensionType})</span></div>` : ''}
          ${studentLoan !== 'none' ? `<div class="row"><span>Student Loan:</span><span>${studentLoan.toUpperCase()}</span></div>` : ''}
        </div>
      </div>

      <div class="section">
        <h2>Tax Breakdown</h2>
        <div class="breakdown">
          <div class="row"><span>Personal Allowance:</span><span>${formatCurrency(result.personalAllowance)}</span></div>
          <div class="row"><span>Taxable Income:</span><span>${formatCurrency(result.taxableIncome)}</span></div>
          <div class="row"><span>Basic Rate Tax (20%):</span><span>${formatCurrency(result.taxBreakdown.basicRate)}</span></div>
          <div class="row"><span>Higher Rate Tax (40%):</span><span>${formatCurrency(result.taxBreakdown.higherRate)}</span></div>
          <div class="row"><span>Additional Rate Tax (45%):</span><span>${formatCurrency(result.taxBreakdown.additionalRate)}</span></div>
          <div class="row total"><span>Total Income Tax:</span><span>${formatCurrency(result.incomeTax)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>National Insurance</h2>
        <div class="breakdown">
          <div class="row"><span>Primary Rate (8%):</span><span>${formatCurrency(result.niBreakdown.primary)}</span></div>
          <div class="row"><span>Upper Rate (2%):</span><span>${formatCurrency(result.niBreakdown.upper)}</span></div>
          <div class="row total"><span>Total National Insurance:</span><span>${formatCurrency(result.nationalInsurance)}</span></div>
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

      <div class="footer">
        <p><strong>Generated by Dias Global Limited</strong></p>
        <p>https://diasglobal.co.uk/tools/uk-salary-calculator</p>
        <hr style="margin: 20px 0; border: 1px solid #ddd;">
        <p style="font-size: 11px; line-height: 1.4; color: #666; margin: 10px 0;">
          <strong>IMPORTANT DISCLAIMER:</strong> This calculator is for informational purposes only and should not be considered as financial, tax, or legal advice. 
          The calculations provided are estimates based on current tax rates and regulations and may not reflect your actual take-home pay. 
          Tax rates, allowances, and regulations can change, and individual circumstances may vary. 
          This calculator does not account for all possible deductions, allowances, or special circumstances that may apply to your specific situation. 
          We recommend consulting with a qualified tax advisor or accountant for personalized advice regarding your specific financial situation. 
          Dias Global Limited does not accept any responsibility for decisions made based on the information provided by this calculator.
        </p>
        <p style="font-size: 10px; color: #999; margin-top: 15px;">
          Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}
        </p>
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
      title: 'UK Take Home Pay Calculator Results',
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
      // Fallback to clipboard
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
              UK Financial Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              UK Take Home Pay
              <span className="text-accent block">Calculator</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Calculate your net salary after tax, National Insurance, and deductions across England, Scotland, Wales, and Northern Ireland.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Form */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <PoundSterling className="w-6 h-6 text-accent" />
                Salary Details
              </h2>

              <div className="space-y-6">
                {/* Annual Salary */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Annual Gross Salary (£)
                  </label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="England">England</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Wales">Wales</option>
                    <option value="Northern Ireland">Northern Ireland</option>
                  </select>
                </div>

                {/* Tax Code */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tax Code
                    <span className="text-muted text-sm font-normal ml-2">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="e.g., 1257L"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Pension Contribution */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pension Contribution (%)
                    <span className="text-muted text-sm font-normal ml-2">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={pensionContribution}
                      onChange={(e) => setPensionContribution(e.target.value)}
                      placeholder="e.g., 5"
                      className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <select
                      value={pensionType}
                      onChange={(e) => setPensionType(e.target.value)}
                      className="px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="auto-enrolment">Auto-enrolment</option>
                      <option value="employer">Employer</option>
                      <option value="salary-sacrifice">Salary Sacrifice</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>

                {/* Student Loan */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Student Loan Plan
                    <span className="text-muted text-sm font-normal ml-2">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={studentLoan}
                      onChange={(e) => setStudentLoan(e.target.value)}
                      className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="none">No Student Loan</option>
                      <option value="plan1">Plan 1 (Pre-2012)</option>
                      <option value="plan2">Plan 2 (2012+)</option>
                      <option value="plan4">Plan 4 (Scotland)</option>
                      <option value="plan5">Plan 5 (2023+)</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>
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
            <div className="space-y-4 lg:space-y-6">
              {result && (
                <>
                  {/* Main Results */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-accent" />
                      Your Take Home Pay
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">Detailed Breakdown</h3>
                      <div className="flex flex-wrap gap-2">
                        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((timeframe) => (
                          <button
                            key={timeframe}
                            onClick={() => setSelectedTimeframe(timeframe)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              selectedTimeframe === timeframe
                                ? 'bg-accent text-white'
                                : 'bg-bg border border-border hover:border-accent'
                            }`}
                          >
                            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Gross {selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)} Salary</span>
                        <span className="font-semibold">{formatCurrency(result.breakdown[selectedTimeframe])}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Personal Allowance</span>
                        <span className="text-green-400">-{formatCurrency(result.personalAllowance / (selectedTimeframe === 'monthly' ? 12 : selectedTimeframe === 'weekly' ? 52 : selectedTimeframe === 'daily' ? 365 : 1))}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Taxable Income</span>
                        <span>{formatCurrency(result.taxableIncome / (selectedTimeframe === 'monthly' ? 12 : selectedTimeframe === 'weekly' ? 52 : selectedTimeframe === 'daily' ? 365 : 1))}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Income Tax</span>
                        <span className="text-red-400">-{formatCurrency(result.incomeTax / (selectedTimeframe === 'monthly' ? 12 : selectedTimeframe === 'weekly' ? 52 : selectedTimeframe === 'daily' ? 365 : 1))}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>National Insurance</span>
                        <span className="text-red-400">-{formatCurrency(result.nationalInsurance / (selectedTimeframe === 'monthly' ? 12 : selectedTimeframe === 'weekly' ? 52 : selectedTimeframe === 'daily' ? 365 : 1))}</span>
                      </div>

                      {parseFloat(pensionContribution) > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span>Pension Contribution</span>
                          <span className="text-red-400">-{formatCurrency(parseFloat(pensionContribution) / (selectedTimeframe === 'monthly' ? 12 : selectedTimeframe === 'weekly' ? 52 : selectedTimeframe === 'daily' ? 365 : 1))}</span>
                        </div>
                      )}

                      {studentLoan !== 'none' && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span>Student Loan ({studentLoan.toUpperCase()})</span>
                          <span className="text-red-400">-{formatCurrency((result.grossAnnual - result.netAnnual - result.incomeTax - result.nationalInsurance - (result.grossAnnual * parseFloat(pensionContribution) / 100)) / (selectedTimeframe === 'monthly' ? 12 : selectedTimeframe === 'weekly' ? 52 : selectedTimeframe === 'daily' ? 365 : 1))}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-3 text-lg font-bold">
                        <span>Net Take Home Pay</span>
                        <span className="text-accent">{formatCurrency(result.breakdown[selectedTimeframe])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Salary Breakdown</h3>
                    <div className="h-64 sm:h-80">
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
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Tax Breakdown</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Basic Rate Tax ({UK_TAX_BRACKETS[region].basic.rate * 100}%)</span>
                        <span>{formatCurrency(result.taxBreakdown.basicRate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Higher Rate Tax ({UK_TAX_BRACKETS[region].higher.rate * 100}%)</span>
                        <span>{formatCurrency(result.taxBreakdown.higherRate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Additional Rate Tax ({UK_TAX_BRACKETS[region].additional.rate * 100}%)</span>
                        <span>{formatCurrency(result.taxBreakdown.additionalRate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Actions</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={downloadResults}
                        className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors font-semibold"
                      >
                        Download
                      </button>
                      <button
                        onClick={shareResults}
                        className="px-6 py-3 bg-bg border border-border rounded-xl hover:border-accent transition-colors font-semibold"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!result && (
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
                  <Calculator className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Enter Your Salary Details</h3>
                  <p className="text-muted">
                    Fill in the form to see your take-home pay calculation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <div className="mt-8 bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">How This Calculator Works</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-muted hover:text-accent transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-accent">Tax Rates 2024-25</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm">Personal Allowance</span>
                      <span className="font-semibold">£12,570</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm">Basic Rate (20%)</span>
                      <span className="font-semibold">£12,571 - £50,270</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm">Higher Rate (40%)</span>
                      <span className="font-semibold">£50,271 - £125,140</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm">Additional Rate (45%)</span>
                      <span className="font-semibold">Above £125,140</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-accent">National Insurance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm">Primary Rate (8%)</span>
                      <span className="font-semibold">£12,571 - £50,270</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm">Upper Rate (2%)</span>
                      <span className="font-semibold">Above £50,270</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-bg rounded-xl">
                    <p className="text-sm text-muted">
                      <strong>Note:</strong> Rates updated as of September 2025. National Insurance primary rate reduced to 8%. Scotland has different tax rates. The calculator accounts for regional variations where applicable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Disclaimer */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl font-bold mb-4 text-accent">Important Disclaimer</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted text-sm leading-relaxed">
                <strong>This calculator is for informational purposes only and should not be considered as financial, tax, or legal advice.</strong> 
                The calculations provided are estimates based on current tax rates and regulations and may not reflect your actual take-home pay. 
                Tax rates, allowances, and regulations can change, and individual circumstances may vary. 
                We recommend consulting with a qualified tax advisor or accountant for personalized advice regarding your specific financial situation. 
                Dias Global Limited does not accept any responsibility for decisions made based on the information provided by this calculator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
