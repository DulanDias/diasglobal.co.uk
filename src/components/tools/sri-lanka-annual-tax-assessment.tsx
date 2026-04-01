'use client'

import { useState, useEffect } from 'react'
import { Calculator, Download, Share2, Info, TrendingUp, DollarSign, Plus, Trash2, FileText, AlertCircle, HelpCircle, Lightbulb, CheckCircle, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface IncomeSource {
  id: string
  type: 'employment' | 'business' | 'rental' | 'interest' | 'dividend' | 'foreign_service' | 'foreign_other' | 'other'
  description: string
  grossAmount: number
  taxDeducted: number
  whtDeducted: number
  isForeignCurrency: boolean
  remittedThroughBank: boolean
}

interface TaxCalculation {
  totalGrossIncome: number
  localIncome: number
  foreignIncome: number
  totalTaxDeducted: number
  totalWhtDeducted: number
  taxFreeAllowance: number
  localTaxableIncome: number
  foreignTaxableIncome: number
  localCalculatedTax: number
  foreignCalculatedTax: number
  totalCalculatedTax: number
  totalTaxPaid: number
  additionalTaxToPay: number
  refundAmount: number
  localTaxBreakdown: Array<{
    bracket: string
    taxableAmount: number
    taxAmount: number
  }>
  foreignTaxBreakdown: Array<{
    type: string
    amount: number
    taxRate: number
    taxAmount: number
  }>
  incomeBreakdown: Array<{
    source: string
    grossAmount: number
    taxPaid: number
    netAmount: number
    isForeign: boolean
  }>
}

// Sri Lanka Tax Brackets (2025) - Same as PAYE calculator
const SRI_LANKA_TAX_BRACKETS = [
  { rate: 0.06, threshold: 2800000 },   // 6% on first 1,000,000 after tax-free allowance
  { rate: 0.18, threshold: 3300000 },   // 18% on next 500,000
  { rate: 0.24, threshold: 3800000 },   // 24% on next 500,000
  { rate: 0.30, threshold: 4300000 },   // 30% on next 500,000
  { rate: 0.36, threshold: Infinity }   // 36% on remaining
]

const TAX_FREE_ALLOWANCE = 1800000 // Annual tax-free allowance

const INCOME_TYPES = [
  { 
    value: 'employment', 
    label: 'Job Salary & Wages', 
    description: 'Money you earn from your regular job, including salary, wages, bonuses, and overtime pay',
    example: 'Your monthly salary from your employer'
  },
  { 
    value: 'business', 
    label: 'Business or Freelance Income', 
    description: 'Money you earn from running your own business, freelancing, or self-employment',
    example: 'Income from your small business, freelance projects, or consulting work'
  },
  { 
    value: 'rental', 
    label: 'Rental Property Income', 
    description: 'Money you receive from renting out property you own',
    example: 'Monthly rent from your house, apartment, or commercial property'
  },
  { 
    value: 'interest', 
    label: 'Bank Interest & Investments', 
    description: 'Interest earned from bank accounts, fixed deposits, and other investments',
    example: 'Interest from your savings account or fixed deposit'
  },
  { 
    value: 'dividend', 
    label: 'Dividend Income', 
    description: 'Money you receive from owning shares in companies',
    example: 'Dividend payments from stocks you own'
  },
  { 
    value: 'foreign_service', 
    label: 'Foreign Work Income', 
    description: 'Money earned from work done outside Sri Lanka (special 15% tax rate)',
    example: 'Salary from working abroad, freelance work for foreign clients'
  },
  { 
    value: 'foreign_other', 
    label: 'Other Foreign Income', 
    description: 'Any other money earned from foreign sources (special 15% tax rate)',
    example: 'Foreign investments, foreign rental income, foreign business income'
  },
  { 
    value: 'other', 
    label: 'Other Income', 
    description: 'Any other money you earn that needs to be declared for tax',
    example: 'Prize money, royalties, or other miscellaneous income'
  }
]

// Helper component for tooltips
const HelpTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1 cursor-help"
      >
        {children}
        <HelpCircle className="w-4 h-4 text-muted hover:text-accent transition-colors" />
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-bg border border-border rounded-lg shadow-lg z-10 max-w-xs">
          <p className="text-sm text-muted">{content}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
        </div>
      )}
    </div>
  )
}

export default function SriLankaAnnualTaxAssessment() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', type: 'employment', description: 'My Job Salary', grossAmount: 0, taxDeducted: 0, whtDeducted: 0, isForeignCurrency: false, remittedThroughBank: false }
  ])
  const [result, setResult] = useState<TaxCalculation | null>(null)
  const [showInfo, setShowInfo] = useState(true)
  const [residencyStatus, setResidencyStatus] = useState<'resident' | 'non_resident'>('resident')
  const [showFaq, setShowFaq] = useState(false)

  const addIncomeSource = () => {
    const newId = (incomeSources.length + 1).toString()
    setIncomeSources([...incomeSources, {
      id: newId,
      type: 'employment',
      description: '',
      grossAmount: 0,
      taxDeducted: 0,
      whtDeducted: 0,
      isForeignCurrency: false,
      remittedThroughBank: false
    }])
  }

  const removeIncomeSource = (id: string) => {
    if (incomeSources.length > 1) {
      setIncomeSources(incomeSources.filter(source => source.id !== id))
    }
  }

  const updateIncomeSource = (id: string, field: keyof IncomeSource, value: string | number) => {
    setIncomeSources(incomeSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ))
  }

  const calculateTaxAssessment = (): TaxCalculation | null => {
    const totalGrossIncome = incomeSources.reduce((sum, source) => sum + source.grossAmount, 0)
    const totalTaxDeducted = incomeSources.reduce((sum, source) => sum + source.taxDeducted, 0)
    const totalWhtDeducted = incomeSources.reduce((sum, source) => sum + source.whtDeducted, 0)

    if (totalGrossIncome <= 0) return null

    // Separate local and foreign income
    const localIncome = incomeSources
      .filter(source => !['foreign_service', 'foreign_other'].includes(source.type))
      .reduce((sum, source) => sum + source.grossAmount, 0)
    
    const foreignIncome = incomeSources
      .filter(source => ['foreign_service', 'foreign_other'].includes(source.type))
      .reduce((sum, source) => sum + source.grossAmount, 0)

    // For non-residents, only tax Sri Lankan sourced income
    const taxableLocalIncome = residencyStatus === 'non_resident' ? 0 : localIncome
    const taxableForeignIncome = residencyStatus === 'non_resident' ? 0 : foreignIncome

    // Apply tax-free allowance to local income first
    const taxFreeAllowance = Math.min(TAX_FREE_ALLOWANCE, taxableLocalIncome)
    const localTaxableIncome = Math.max(0, taxableLocalIncome - taxFreeAllowance)
    
    // Foreign income is taxed separately at 15% (no tax-free allowance)
    const foreignTaxableIncome = taxableForeignIncome

    // Calculate local tax using progressive tax brackets
    let localCalculatedTax = 0
    let remainingIncome = localTaxableIncome
    const localTaxBreakdown: Array<{ bracket: string; taxableAmount: number; taxAmount: number }> = []

    for (let i = 0; i < SRI_LANKA_TAX_BRACKETS.length && remainingIncome > 0; i++) {
      const bracket = SRI_LANKA_TAX_BRACKETS[i]
      const previousThreshold = i === 0 ? 0 : SRI_LANKA_TAX_BRACKETS[i - 1].threshold
      const bracketSize = bracket.threshold - previousThreshold
      const taxableInBracket = Math.min(remainingIncome, bracketSize)
      
      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate
        localCalculatedTax += taxInBracket
        
        localTaxBreakdown.push({
          bracket: `${(bracket.rate * 100).toFixed(0)}% (${formatCurrency(previousThreshold)} - ${bracket.threshold === Infinity ? '∞' : formatCurrency(bracket.threshold)})`,
          taxableAmount: taxableInBracket,
          taxAmount: taxInBracket
        })
        
        remainingIncome -= taxableInBracket
      }
    }

    // Calculate foreign tax at 15% concessional rate
    const foreignCalculatedTax = foreignTaxableIncome * 0.15
    const foreignTaxBreakdown: Array<{ type: string; amount: number; taxRate: number; taxAmount: number }> = []

    if (foreignTaxableIncome > 0) {
      foreignTaxBreakdown.push({
        type: 'Foreign Income (15% Concessional Rate)',
        amount: foreignTaxableIncome,
        taxRate: 15,
        taxAmount: foreignCalculatedTax
      })
    }

    const totalCalculatedTax = localCalculatedTax + foreignCalculatedTax
    const totalTaxPaid = totalTaxDeducted + totalWhtDeducted
    const additionalTaxToPay = Math.max(0, totalCalculatedTax - totalTaxPaid)
    const refundAmount = Math.max(0, totalTaxPaid - totalCalculatedTax)

    const incomeBreakdown = incomeSources.map(source => ({
      source: source.description || INCOME_TYPES.find(t => t.value === source.type)?.label || 'Unknown',
      grossAmount: source.grossAmount,
      taxPaid: source.taxDeducted + source.whtDeducted,
      netAmount: source.grossAmount - (source.taxDeducted + source.whtDeducted),
      isForeign: ['foreign_service', 'foreign_other'].includes(source.type)
    }))

    return {
      totalGrossIncome,
      localIncome,
      foreignIncome,
      totalTaxDeducted,
      totalWhtDeducted,
      taxFreeAllowance,
      localTaxableIncome,
      foreignTaxableIncome,
      localCalculatedTax,
      foreignCalculatedTax,
      totalCalculatedTax,
      totalTaxPaid,
      additionalTaxToPay,
      refundAmount,
      localTaxBreakdown,
      foreignTaxBreakdown,
      incomeBreakdown
    }
  }

  useEffect(() => {
    const calculation = calculateTaxAssessment()
    setResult(calculation)
  }, [incomeSources, residencyStatus])

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
      { name: 'Net Income After Tax', value: result.totalGrossIncome - result.totalCalculatedTax, color: '#10b981' },
      { name: 'Local Tax Liability', value: result.localCalculatedTax, color: '#ef4444' },
      { name: 'Foreign Tax Liability', value: result.foreignCalculatedTax, color: '#dc2626' },
      { name: 'Tax Already Paid', value: result.totalTaxPaid, color: '#3b82f6' },
      { name: 'Additional Tax Due', value: result.additionalTaxToPay, color: '#f59e0b' }
    ].filter(item => item.value > 0)
  }

  const getIncomeBreakdownData = () => {
    if (!result) return []
    return result.incomeBreakdown.map(item => ({
      source: item.source.length > 15 ? item.source.substring(0, 15) + '...' : item.source,
      gross: item.grossAmount,
      taxPaid: item.taxPaid,
      net: item.netAmount
    }))
  }

  const downloadResults = () => {
    if (!result) return

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sri Lanka Annual Tax Assessment Results</title>
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
        .income-source { margin: 10px 0; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Dias Global Limited</div>
        <h1>Sri Lanka Annual Tax Assessment Results</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-GB')}</p>
      </div>

      <div class="section">
        <h2>Income Sources</h2>
        ${incomeSources.map(source => `
          <div class="income-source">
            <div class="row"><span>${source.description || INCOME_TYPES.find(t => t.value === source.type)?.label}:</span><span>${formatCurrency(source.grossAmount)}</span></div>
            <div class="row"><span>Tax Deducted:</span><span>${formatCurrency(source.taxDeducted)}</span></div>
            <div class="row"><span>WHT Deducted:</span><span>${formatCurrency(source.whtDeducted)}</span></div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>Tax Calculation Summary</h2>
        <div class="breakdown">
          <div class="row"><span>Total Gross Income:</span><span>${formatCurrency(result.totalGrossIncome)}</span></div>
          <div class="row"><span>Local Income:</span><span>${formatCurrency(result.localIncome)}</span></div>
          <div class="row"><span>Foreign Income:</span><span>${formatCurrency(result.foreignIncome)}</span></div>
          <div class="row"><span>Tax-Free Allowance (Local):</span><span>${formatCurrency(result.taxFreeAllowance)}</span></div>
          <div class="row"><span>Local Taxable Income:</span><span>${formatCurrency(result.localTaxableIncome)}</span></div>
          <div class="row"><span>Foreign Taxable Income:</span><span>${formatCurrency(result.foreignTaxableIncome)}</span></div>
          <div class="row"><span>Local Tax Liability:</span><span>${formatCurrency(result.localCalculatedTax)}</span></div>
          <div class="row"><span>Foreign Tax Liability (15%):</span><span>${formatCurrency(result.foreignCalculatedTax)}</span></div>
          <div class="row"><span>Total Calculated Tax:</span><span>${formatCurrency(result.totalCalculatedTax)}</span></div>
          <div class="row"><span>Total Tax Already Paid:</span><span>${formatCurrency(result.totalTaxPaid)}</span></div>
          ${result.additionalTaxToPay > 0 ? `
            <div class="row total"><span>Additional Tax to Pay:</span><span>${formatCurrency(result.additionalTaxToPay)}</span></div>
          ` : `
            <div class="row total"><span>Tax Refund Due:</span><span>${formatCurrency(result.refundAmount)}</span></div>
          `}
        </div>
      </div>

      ${result.localTaxBreakdown.length > 0 ? `
        <div class="section">
          <h2>Local Tax Breakdown by Bracket</h2>
          <div class="breakdown">
            ${result.localTaxBreakdown.map(bracket => `
              <div class="row"><span>${bracket.bracket}:</span><span>${formatCurrency(bracket.taxAmount)}</span></div>
            `).join('')}
            <div class="row total"><span>Total Local Tax Liability:</span><span>${formatCurrency(result.localCalculatedTax)}</span></div>
          </div>
        </div>
      ` : ''}

      ${result.foreignTaxBreakdown.length > 0 ? `
        <div class="section">
          <h2>Foreign Tax Breakdown</h2>
          <div class="breakdown">
            ${result.foreignTaxBreakdown.map(breakdown => `
              <div class="row"><span>${breakdown.type}:</span><span>${formatCurrency(breakdown.taxAmount)}</span></div>
            `).join('')}
            <div class="row total"><span>Total Foreign Tax Liability:</span><span>${formatCurrency(result.foreignCalculatedTax)}</span></div>
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>Generated by Dias Global Limited</strong></p>
        <p>https://diasglobal.co.uk/tools/sri-lanka-annual-tax-assessment</p>
        <hr style="margin: 20px 0; border: 1px solid #ddd;">
        <p style="font-size: 11px; line-height: 1.4; color: #666; margin: 10px 0;">
          <strong>IMPORTANT DISCLAIMER:</strong> This calculator is for informational purposes only and should not be considered as financial, tax, or legal advice. 
          The calculations provided are estimates based on current tax rates and regulations in Sri Lanka and may not reflect your actual tax liability. 
          Tax rates, allowances, and regulations can change, and individual circumstances may vary significantly. 
          This calculator does not account for all possible deductions, allowances, or special circumstances that may apply to your specific situation. 
          We strongly recommend consulting with qualified tax advisors, accountants, or the Inland Revenue Department of Sri Lanka for personalized advice regarding your specific tax situation. 
          Dias Global Limited does not accept any responsibility for decisions made based on the information provided by this calculator.
        </p>
        <p style="font-size: 10px; color: #999; margin-top: 15px;">
          Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}
        </p>
      </div>
    </body>
    </html>
    `

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
      title: 'Sri Lanka Annual Tax Assessment Results',
      text: `My tax assessment: ${result.additionalTaxToPay > 0 ? `Additional tax to pay: ${formatCurrency(result.additionalTaxToPay)}` : `Tax refund due: ${formatCurrency(result.refundAmount)}`}`,
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
              Sri Lanka Annual Tax
              <span className="text-accent block">Calculator</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              <strong>Wondering how much tax you need to pay this year?</strong> Our easy-to-use calculator helps you figure out your tax bill by looking at all your income sources and taxes you've already paid. Perfect for regular people who want to understand their taxes better!
            </p>
            
            {/* Quick Start Guide */}
            <div className="bg-card border border-border rounded-2xl p-6 max-w-4xl mx-auto">
              <h2 className="text-lg font-bold mb-4 text-accent flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                How to Use This Calculator (3 Simple Steps)
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <div>
                    <strong>Add Your Income:</strong> Tell us about all the money you earned this year - your job, business, rental income, etc.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <div>
                    <strong>Enter Taxes Paid:</strong> Add any taxes that were already taken from your income (like PAYE from your salary).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <div>
                    <strong>Get Your Result:</strong> See exactly how much more tax you need to pay (or if you're getting a refund!).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Form */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-accent" />
                Income Sources & Tax Details
              </h2>

              <div className="space-y-6">
                {/* Residency Status */}
                <div className="bg-bg border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-accent mb-4 flex items-center gap-2">
                    <HelpTooltip content="Your residency status determines which income gets taxed. Most people living in Sri Lanka are residents.">
                      Where Do You Live?
                    </HelpTooltip>
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold mb-2">Are you a Sri Lankan resident?</label>
                    <select
                      value={residencyStatus}
                      onChange={(e) => setResidencyStatus(e.target.value as 'resident' | 'non_resident')}
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="resident">Yes, I live in Sri Lanka (Resident)</option>
                      <option value="non_resident">No, I live outside Sri Lanka (Non-Resident)</option>
                    </select>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-sm text-blue-400">
                        {residencyStatus === 'resident' 
                          ? '✓ You pay tax on ALL your income (both from Sri Lanka and abroad)'
                          : '✓ You only pay tax on income earned IN Sri Lanka'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {incomeSources.map((source, index) => (
                  <div key={source.id} className="bg-bg border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-accent">Income Source {index + 1}</h3>
                      {incomeSources.length > 1 && (
                        <button
                          onClick={() => removeIncomeSource(source.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Income Type */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <HelpTooltip content="Choose the type of income that best matches your situation. This helps us calculate the right tax rate.">
                            What type of income is this?
                          </HelpTooltip>
                        </label>
                        <select
                          value={source.type}
                          onChange={(e) => updateIncomeSource(source.id, 'type', e.target.value)}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors"
                        >
                          {INCOME_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {INCOME_TYPES.find(t => t.value === source.type) && (
                          <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-400">
                              <strong>Example:</strong> {INCOME_TYPES.find(t => t.value === source.type)?.example}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <HelpTooltip content="Give this income source a name so you can easily identify it later.">
                            What should we call this income?
                          </HelpTooltip>
                        </label>
                        <input
                          type="text"
                          value={source.description}
                          onChange={(e) => updateIncomeSource(source.id, 'description', e.target.value)}
                          placeholder="e.g., My Main Job, House Rental, Freelance Work, etc."
                          className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      {/* Gross Amount */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <HelpTooltip content="Enter the total amount you earned from this source this year, before any taxes were taken out.">
                            How much did you earn from this source this year?
                          </HelpTooltip>
                        </label>
                        <input
                          type="number"
                          value={source.grossAmount || ''}
                          onChange={(e) => updateIncomeSource(source.id, 'grossAmount', parseFloat(e.target.value) || 0)}
                          placeholder="Enter amount in LKR (e.g., 1200000)"
                          className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-muted mt-1">💡 This is your total income before any taxes were deducted</p>
                      </div>

                      {/* Tax Already Deducted */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <HelpTooltip content="Enter any tax that was already taken from this income (like PAYE tax from your salary).">
                            How much tax was already taken from this income?
                          </HelpTooltip>
                        </label>
                        <input
                          type="number"
                          value={source.taxDeducted || ''}
                          onChange={(e) => updateIncomeSource(source.id, 'taxDeducted', parseFloat(e.target.value) || 0)}
                          placeholder="Enter amount in LKR (e.g., 50000)"
                          className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-muted mt-1">💡 This is tax already paid (like PAYE from your salary)</p>
                      </div>

                      {/* WHT Deducted */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <HelpTooltip content="Withholding Tax (WHT) is tax taken at the source, usually from interest, dividends, or other investment income.">
                            Any withholding tax (WHT) deducted?
                          </HelpTooltip>
                        </label>
                        <input
                          type="number"
                          value={source.whtDeducted || ''}
                          onChange={(e) => updateIncomeSource(source.id, 'whtDeducted', parseFloat(e.target.value) || 0)}
                          placeholder="Enter amount in LKR (e.g., 5000)"
                          className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-muted mt-1">💡 Usually applies to bank interest, dividends, or investment income</p>
                      </div>

                      {/* Foreign Currency Options - Only show for foreign income types */}
                      {['foreign_service', 'foreign_other'].includes(source.type) && (
                        <>
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                              <HelpTooltip content="Foreign income gets a special lower tax rate (15%) if it meets certain requirements.">
                                Foreign Income Special Rules
                              </HelpTooltip>
                            </h4>
                            
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={source.isForeignCurrency}
                                  onChange={(e) => updateIncomeSource(source.id, 'isForeignCurrency', e.target.checked)}
                                  className="rounded border-border text-accent focus:ring-accent"
                                />
                                <div>
                                  <span className="text-sm font-semibold">Was this income received in foreign currency?</span>
                                  <p className="text-xs text-muted">(USD, EUR, GBP, etc. instead of LKR)</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={source.remittedThroughBank}
                                  onChange={(e) => updateIncomeSource(source.id, 'remittedThroughBank', e.target.checked)}
                                  className="rounded border-border text-accent focus:ring-accent"
                                />
                                <div>
                                  <span className="text-sm font-semibold">Was the money sent to Sri Lanka through a bank?</span>
                                  <p className="text-xs text-muted">(Not brought in cash or other methods)</p>
                                </div>
                              </div>
                            </div>
                            
                            {source.isForeignCurrency && source.remittedThroughBank && (
                              <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                <p className="text-sm text-green-400 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  <strong>Great!</strong> This qualifies for the special 15% tax rate (much lower than regular rates!)
                                </p>
                              </div>
                            )}
                            
                            {(!source.isForeignCurrency || !source.remittedThroughBank) && source.grossAmount > 0 && (
                              <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                <p className="text-sm text-yellow-400 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  <strong>Note:</strong> This might not qualify for the special 15% rate. You may need to pay regular tax rates instead.
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Income Source Button */}
                <button
                  onClick={addIncomeSource}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent/10 text-accent border border-accent/20 rounded-xl hover:bg-accent/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Income Source
                </button>

                {/* Helpful Tips */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    💡 Helpful Tips
                  </h3>
                  <ul className="text-sm text-green-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Tax-Free Allowance:</strong> The first LKR 1,800,000 you earn each year is completely tax-free!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Include Everything:</strong> Add all your income sources for the most accurate calculation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Foreign Income:</strong> If you work abroad, you might get a special lower tax rate of 15%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Already Paid Tax:</strong> Don't forget to include taxes already taken from your salary (PAYE)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Info Buttons */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <Info className="w-4 h-4" />
                  How does this calculator work?
                </button>
                <button
                  onClick={() => setShowFaq(!showFaq)}
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <HelpCircle className="w-4 h-4" />
                  Frequently Asked Questions
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
                      Tax Assessment Result
                    </h2>

                    {result.additionalTaxToPay > 0 ? (
                      <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-red-400 mb-2">
                          You Need to Pay More Tax
                        </div>
                        <div className="text-3xl font-bold text-red-400 mb-2">
                          {formatCurrency(result.additionalTaxToPay)}
                        </div>
                        <p className="text-sm text-red-300">
                          Don't worry! This is normal. You need to pay this amount to the tax office.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
                        <AlertCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-green-400 mb-2">
                          Great News! You're Getting Money Back
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          {formatCurrency(result.refundAmount)}
                        </div>
                        <p className="text-sm text-green-300">
                          You've paid too much tax! The government owes you this amount.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-bg rounded-xl">
                        <div className="text-lg font-bold text-accent">
                          {formatCurrency(result.totalCalculatedTax)}
                        </div>
                        <div className="text-sm text-muted">Total Tax Liability</div>
                      </div>
                      <div className="text-center p-4 bg-bg rounded-xl">
                        <div className="text-lg font-bold text-accent">
                          {formatCurrency(result.totalTaxPaid)}
                        </div>
                        <div className="text-sm text-muted">Tax Already Paid</div>
                      </div>
                    </div>

                    {/* Local vs Foreign Tax Breakdown */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-bg rounded-lg">
                        <div className="text-sm font-semibold text-blue-400">
                          {formatCurrency(result.localCalculatedTax)}
                        </div>
                        <div className="text-xs text-muted">Local Tax (Progressive)</div>
                      </div>
                      <div className="text-center p-3 bg-bg rounded-lg">
                        <div className="text-sm font-semibold text-purple-400">
                          {formatCurrency(result.foreignCalculatedTax)}
                        </div>
                        <div className="text-xs text-muted">Foreign Tax (15%)</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Detailed Breakdown</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>💰 Total Money You Earned This Year</span>
                        <span className="font-semibold">{formatCurrency(result.totalGrossIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>🏠 Income from Sri Lanka</span>
                        <span>{formatCurrency(result.localIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>🌍 Income from Abroad</span>
                        <span>{formatCurrency(result.foreignIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>🎁 Tax-Free Amount (You don't pay tax on this!)</span>
                        <span className="text-green-400">-{formatCurrency(result.taxFreeAllowance)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>📊 Sri Lankan Income That Gets Taxed</span>
                        <span>{formatCurrency(result.localTaxableIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>📊 Foreign Income That Gets Taxed</span>
                        <span>{formatCurrency(result.foreignTaxableIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>🏠 Tax on Sri Lankan Income</span>
                        <span className="text-blue-400">{formatCurrency(result.localCalculatedTax)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>🌍 Tax on Foreign Income (Special 15% Rate)</span>
                        <span className="text-purple-400">{formatCurrency(result.foreignCalculatedTax)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>💸 Total Tax You Should Pay</span>
                        <span className="text-red-400">{formatCurrency(result.totalCalculatedTax)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>✅ Tax You Already Paid (like PAYE from salary)</span>
                        <span className="text-blue-400">-{formatCurrency(result.totalTaxDeducted)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>✅ Withholding Tax You Already Paid</span>
                        <span className="text-blue-400">-{formatCurrency(result.totalWhtDeducted)}</span>
                      </div>

                      <div className="flex justify-between items-center py-3 text-lg font-bold">
                        <span>{result.additionalTaxToPay > 0 ? '💸 Final Amount You Need to Pay' : '🎉 Money You Get Back'}</span>
                        <span className={result.additionalTaxToPay > 0 ? 'text-red-400' : 'text-green-400'}>
                          {result.additionalTaxToPay > 0 ? formatCurrency(result.additionalTaxToPay) : formatCurrency(result.refundAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Tax Assessment Overview</h3>
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

                  {/* Income Breakdown Chart */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Income Sources Breakdown</h3>
                    <div className="h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getIncomeBreakdownData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="source" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Bar dataKey="gross" fill="#3b82f6" name="Gross Income" />
                          <Bar dataKey="taxPaid" fill="#ef4444" name="Tax Paid" />
                          <Bar dataKey="net" fill="#10b981" name="Net Income" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Local Tax Breakdown */}
                  {result.localTaxBreakdown.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                      <h3 className="text-xl font-bold mb-6">Local Tax Breakdown by Bracket</h3>

                      <div className="space-y-3">
                        {result.localTaxBreakdown.map((bracket, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{bracket.bracket}</span>
                            <span>{formatCurrency(bracket.taxAmount)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
                          <span>Total Local Tax Liability</span>
                          <span className="text-blue-400">{formatCurrency(result.localCalculatedTax)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Foreign Tax Breakdown */}
                  {result.foreignTaxBreakdown.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                      <h3 className="text-xl font-bold mb-6">Foreign Tax Breakdown</h3>

                      <div className="space-y-3">
                        {result.foreignTaxBreakdown.map((breakdown, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{breakdown.type}</span>
                            <span>{formatCurrency(breakdown.taxAmount)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
                          <span>Total Foreign Tax Liability</span>
                          <span className="text-purple-400">{formatCurrency(result.foreignCalculatedTax)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-6">Share & Download</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
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
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
                  <Calculator className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Enter Your Income Details</h3>
                  <p className="text-muted">
                    Add your income sources and tax details to see your annual tax assessment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <div className="mt-8 bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-4">How This Tax Assessment Calculator Works</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted mb-4">
                  This calculator helps you assess your annual tax liability in Sri Lanka by considering all your income sources and taxes already paid:
                </p>
                <ul className="space-y-2 text-muted">
                  <li><strong>Multiple Income Sources:</strong> Add employment, business, rental, interest, dividend, and other income</li>
                  <li><strong>Foreign Income Support:</strong> Separate calculation for foreign service and other foreign income at 15% concessional rate</li>
                  <li><strong>Residency Status:</strong> Residents taxed on worldwide income, non-residents only on Sri Lankan income</li>
                  <li><strong>Tax Already Deducted:</strong> Include PAYE tax, business tax, and other taxes already paid</li>
                  <li><strong>WHT on Interest:</strong> Include withholding tax deducted on bank interest and other investments</li>
                  <li><strong>Tax-Free Allowance:</strong> LKR 1,800,000 per year applied to local income only</li>
                  <li><strong>Progressive Tax Rates:</strong> 6% to 36% for local income, 15% flat rate for qualifying foreign income</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Local Income Tax Brackets (2025):</strong>
                </p>
                <ul className="space-y-1 text-muted text-sm">
                  <li>• 6% on first LKR 1,000,000 of taxable income (LKR 1,800,001 - 2,800,000)</li>
                  <li>• 18% on next LKR 500,000 (LKR 2,800,001 - 3,300,000)</li>
                  <li>• 24% on next LKR 500,000 (LKR 3,300,001 - 3,800,000)</li>
                  <li>• 30% on next LKR 500,000 (LKR 3,800,001 - 4,300,000)</li>
                  <li>• 36% on remaining income (above LKR 4,300,000)</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Foreign Income Tax Rates (2025):</strong>
                </p>
                <ul className="space-y-1 text-muted text-sm">
                  <li>• 15% flat rate on foreign service income (services rendered outside Sri Lanka)</li>
                  <li>• 15% flat rate on other foreign-sourced income</li>
                  <li>• Must be received in foreign currency and remitted through bank to Sri Lanka</li>
                  <li>• No tax-free allowance applies to foreign income</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Result Interpretation:</strong>
                </p>
                <ul className="space-y-1 text-muted text-sm">
                  <li>• <strong>Additional Tax to Pay:</strong> You need to pay more tax to the Inland Revenue Department</li>
                  <li>• <strong>Tax Refund Due:</strong> You have overpaid tax and are eligible for a refund</li>
                  <li>• <strong>Break-even:</strong> Your tax payments match your liability exactly</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Note:</strong> This calculator provides estimates based on current tax rates and regulations. 
                  For official tax assessments and filing, consult with the Inland Revenue Department of Sri Lanka or a qualified tax advisor.
                </p>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {showFaq && (
            <div className="mt-8 bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-accent" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">🤔 What is a tax assessment?</h4>
                  <p className="text-muted text-sm">
                    A tax assessment is a calculation of how much tax you should pay for the year. It compares what you should pay versus what you've already paid to see if you owe more money or get a refund.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">💰 What is the tax-free allowance?</h4>
                  <p className="text-muted text-sm">
                    The tax-free allowance is LKR 1,800,000 per year. This means the first LKR 1,800,000 you earn is completely free from income tax! Only money you earn above this amount gets taxed.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">🏠 What's the difference between local and foreign income?</h4>
                  <p className="text-muted text-sm">
                    <strong>Local income:</strong> Money you earn from work or business in Sri Lanka (gets the tax-free allowance and progressive tax rates).<br/>
                    <strong>Foreign income:</strong> Money you earn from work or business outside Sri Lanka (gets a special 15% tax rate, no tax-free allowance).
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">📊 What are progressive tax rates?</h4>
                  <p className="text-muted text-sm">
                    Progressive tax rates mean the more you earn, the higher percentage of tax you pay. It's like stairs - the first LKR 1,000,000 above the tax-free allowance is taxed at 6%, the next LKR 500,000 at 18%, and so on.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">✅ What is PAYE tax?</h4>
                  <p className="text-muted text-sm">
                    PAYE (Pay As You Earn) is tax that your employer automatically takes from your salary each month. It's like paying your taxes in small installments throughout the year instead of one big payment at the end.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">🏦 What is withholding tax (WHT)?</h4>
                  <p className="text-muted text-sm">
                    Withholding tax is tax taken directly from certain types of income (like bank interest or dividends) before you receive the money. The bank or company pays this tax to the government on your behalf.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">🌍 How does foreign income taxation work?</h4>
                  <p className="text-muted text-sm">
                    If you earn money from work outside Sri Lanka and it's received in foreign currency and sent to Sri Lanka through a bank, you get a special low tax rate of 15%. This is much lower than regular tax rates!
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">📝 What if I get a refund?</h4>
                  <p className="text-muted text-sm">
                    If you get a refund, it means you've paid more tax than you should have! You can claim this money back from the tax office. It's like getting money back from the government.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-accent mb-2">⚠️ What if I need to pay more tax?</h4>
                  <p className="text-muted text-sm">
                    Don't worry! This is normal. It means you need to pay the remaining tax to the tax office. You can usually pay this in installments or as a lump sum.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-2">❓ Is this calculator accurate?</h4>
                  <p className="text-muted text-sm">
                    This calculator uses the latest 2025 tax rates and rules, but it's for guidance only. For official tax calculations, always consult with the Inland Revenue Department or a qualified tax advisor.
                  </p>
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
                The calculations provided are estimates based on current tax rates and regulations in Sri Lanka and may not reflect your actual tax liability. 
                Tax rates, allowances, and regulations can change, and individual circumstances may vary significantly. 
                This calculator does not account for all possible deductions, allowances, or special circumstances that may apply to your specific situation. 
                We strongly recommend consulting with qualified tax advisors, accountants, or the Inland Revenue Department of Sri Lanka for personalized advice regarding your specific tax situation. 
                Dias Global Limited does not accept any responsibility for decisions made based on the information provided by this calculator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
