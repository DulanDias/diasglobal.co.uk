'use client'

import { useState, useEffect } from 'react'
import { Home, Download, Share2, Info, TrendingUp, Calculator, MapPin, Percent } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

interface PropertyInputs {
  propertyPrice: number
  deposit: number
  mortgageRate: number
  mortgageTerm: number
  monthlyRent: number
  location: string
  propertyAppreciation: number
  rentIncrease: number
  analysisPeriod: number
  isFirstTimeBuyer: boolean
  homeInsurance: number
  mortgageBrokerFee: number
  legalFees: number
  surveyFees: number
  mortgageFees: number
  mortgageFeesInLoan: boolean
  maintenanceRate: number
  councilTax: number
}

interface UpfrontCosts {
  deposit: number
  stampDuty: number
  legalFees: number
  surveyFees: number
  mortgageFees: number
  mortgageBrokerFee: number
  total: number
}

interface MonthlyCosts {
  mortgagePayment: number
  interest: number
  principal: number
  homeInsurance: number
  maintenance: number
  councilTax: number
  total: number
}

interface AnalysisResult {
  upfrontCosts: UpfrontCosts
  monthlyCosts: MonthlyCosts
  totalRentCosts: number
  totalMortgageCosts: number
  totalInterestPaid: number
  equityBuilt: number
  propertyValue: number
  netBenefit: number
  breakEvenPoint: number
  yearlyBreakdown: Array<{
    year: number
    rentCost: number
    mortgageCost: number
    equityBuilt: number
    propertyValue: number
    netDifference: number
  }>
}

export default function UKRentMortgageCalculator() {
  const [inputs, setInputs] = useState<PropertyInputs>({
    propertyPrice: 300000,
    deposit: 20, // 20% deposit
    mortgageRate: 5.5,
    mortgageTerm: 35, // Changed to 35 years
    monthlyRent: 1200,
    location: 'London',
    propertyAppreciation: 3,
    rentIncrease: 2.5,
    analysisPeriod: 5,
    isFirstTimeBuyer: true,
    homeInsurance: 50,
    mortgageBrokerFee: 0,
    legalFees: 1500, // More realistic legal fees
    surveyFees: 500,
    mortgageFees: 1000,
    mortgageFeesInLoan: false, // Default to paying upfront
    maintenanceRate: 0.5, // 0.5% of property value annually (more realistic)
    councilTax: 150
  })

  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showInfo, setShowInfo] = useState(true)
  const [depositInputType, setDepositInputType] = useState<'value' | 'percentage'>('percentage')

  const calculateStampDuty = (price: number, isFirstTimeBuyer: boolean): number => {
    if (isFirstTimeBuyer) {
      // First-time buyer rates (2025)
      if (price <= 300000) return 0
      if (price <= 500000) return (price - 300000) * 0.05
      // For properties over £500,000, standard rates apply
      return 10000 + calculateStandardStampDuty(price)
    } else {
      return calculateStandardStampDuty(price)
    }
  }

  const calculateStandardStampDuty = (price: number): number => {
    // Standard rates (2025)
    if (price <= 125000) return 0
    if (price <= 250000) return (price - 125000) * 0.02
    if (price <= 925000) return 2500 + (price - 250000) * 0.05
    if (price <= 1500000) return 36250 + (price - 925000) * 0.10
    return 93750 + (price - 1500000) * 0.12
  }

  const calculateMortgagePayment = (principal: number, rate: number, term: number): number => {
    const monthlyRate = rate / 100 / 12
    const numPayments = term * 12
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  }

  const calculateAnalysis = (): AnalysisResult | null => {
    const {
      propertyPrice,
      deposit,
      mortgageRate,
      mortgageTerm,
      monthlyRent,
      propertyAppreciation,
      rentIncrease,
      analysisPeriod,
      isFirstTimeBuyer,
      homeInsurance,
      mortgageBrokerFee,
      legalFees,
      surveyFees,
      mortgageFees,
      mortgageFeesInLoan,
      maintenanceRate,
      councilTax
    } = inputs

    if (propertyPrice <= 0 || monthlyRent <= 0) return null

    // Calculate actual deposit amount based on input type
    const actualDeposit = depositInputType === 'percentage' 
      ? (propertyPrice * deposit / 100) 
      : deposit

    // Calculate upfront costs
    const stampDuty = calculateStampDuty(propertyPrice, isFirstTimeBuyer)

    const upfrontCosts: UpfrontCosts = {
      deposit: actualDeposit,
      stampDuty,
      legalFees,
      surveyFees,
      mortgageFees: mortgageFeesInLoan ? 0 : mortgageFees, // Only include if not added to loan
      mortgageBrokerFee,
      total: actualDeposit + stampDuty + legalFees + surveyFees + (mortgageFeesInLoan ? 0 : mortgageFees) + mortgageBrokerFee
    }

    // Calculate mortgage details
    const mortgageAmount = propertyPrice - actualDeposit + (mortgageFeesInLoan ? mortgageFees : 0)
    const monthlyMortgagePayment = calculateMortgagePayment(mortgageAmount, mortgageRate, mortgageTerm)
    
    // Calculate monthly costs
    const maintenance = propertyPrice * maintenanceRate / 100 / 12 // User-configurable maintenance rate

    const monthlyCosts: MonthlyCosts = {
      mortgagePayment: monthlyMortgagePayment,
      interest: 0, // Will be calculated in yearly breakdown
      principal: 0, // Will be calculated in yearly breakdown
      homeInsurance: homeInsurance, // User-provided mandatory home insurance
      maintenance,
      councilTax,
      total: monthlyMortgagePayment + homeInsurance + maintenance + councilTax
    }

    // Calculate yearly breakdown
    const yearlyBreakdown = []
    let totalRentCosts = 0
    let totalMortgageCosts = upfrontCosts.total
    let totalInterestPaid = 0
    let currentRent = monthlyRent * 12
    let remainingMortgage = mortgageAmount
    let equityBuilt = 0
    let propertyValue = propertyPrice

    for (let year = 1; year <= analysisPeriod; year++) {
      // Rent costs
      totalRentCosts += currentRent
      currentRent *= (1 + rentIncrease / 100)

      // Mortgage costs
      const yearlyMortgagePayment = monthlyMortgagePayment * 12
      totalMortgageCosts += yearlyMortgagePayment + homeInsurance * 12 + maintenance * 12 + councilTax * 12

      // Calculate interest and principal for this year
      let yearlyInterest = 0
      let yearlyPrincipal = 0
      let tempRemaining = remainingMortgage

      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = tempRemaining * (mortgageRate / 100 / 12)
        const monthlyPrincipal = monthlyMortgagePayment - monthlyInterest
        yearlyInterest += monthlyInterest
        yearlyPrincipal += monthlyPrincipal
        tempRemaining -= monthlyPrincipal
      }

      remainingMortgage -= yearlyPrincipal
      equityBuilt += yearlyPrincipal
      totalInterestPaid += yearlyInterest

      // Property appreciation
      propertyValue *= (1 + propertyAppreciation / 100)

      const netDifference = (propertyValue - propertyPrice + equityBuilt) - (totalMortgageCosts - totalRentCosts)

      yearlyBreakdown.push({
        year,
        rentCost: currentRent,
        mortgageCost: yearlyMortgagePayment + homeInsurance * 12 + maintenance * 12 + councilTax * 12,
        equityBuilt: equityBuilt,
        propertyValue,
        netDifference
      })
    }

    // Calculate break-even point
    let breakEvenPoint = analysisPeriod
    for (let year = 1; year <= analysisPeriod; year++) {
      const yearData = yearlyBreakdown[year - 1]
      if (yearData.netDifference > 0) {
        breakEvenPoint = year
        break
      }
    }

    // Calculate total equity built (principal payments + property appreciation)
    const totalEquityBuilt = equityBuilt + (propertyValue - propertyPrice)

    return {
      upfrontCosts,
      monthlyCosts: {
        ...monthlyCosts,
        interest: yearlyBreakdown[0]?.mortgageCost * 0.7 || 0, // Rough estimate
        principal: yearlyBreakdown[0]?.mortgageCost * 0.3 || 0
      },
      totalRentCosts,
      totalMortgageCosts,
      totalInterestPaid,
      equityBuilt: totalEquityBuilt,
      propertyValue,
      netBenefit: (propertyValue - totalInterestPaid - upfrontCosts.total) - (-totalRentCosts),
      breakEvenPoint,
      yearlyBreakdown
    }
  }

  useEffect(() => {
    const analysis = calculateAnalysis()
    setResult(analysis)
  }, [inputs])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPieChartData = () => {
    if (!result) return []
    
    return [
      { name: 'Equity Built', value: result.equityBuilt, color: '#10b981' },
      { name: 'Interest Paid', value: result.totalMortgageCosts - result.equityBuilt, color: '#ef4444' },
      { name: 'Upfront Costs', value: result.upfrontCosts.total, color: '#f59e0b' },
      { name: 'Maintenance & Insurance', value: (result.monthlyCosts.homeInsurance + result.monthlyCosts.maintenance) * 12 * inputs.analysisPeriod, color: '#3b82f6' }
    ].filter(item => item.value > 0)
  }

  const getGrowthChartData = () => {
    if (!result) return []
    
    // If analysis period is 2 years or less, show monthly breakdown
    if (inputs.analysisPeriod <= 2) {
      return getMonthlyGrowthChartData()
    }
    
    return result.yearlyBreakdown.map((year, index) => {
      const cumulativeRentCosts = result.yearlyBreakdown.slice(0, index + 1).reduce((sum, y) => sum + y.rentCost, 0)
      const cumulativeMortgageCosts = result.yearlyBreakdown.slice(0, index + 1).reduce((sum, y) => sum + y.mortgageCost, 0)
      const netWorth = year.propertyValue - cumulativeMortgageCosts
      const netWorthRenting = -cumulativeRentCosts // Negative because it's money spent
      
      return {
        year: `Year ${year.year}`,
        rentCost: -cumulativeRentCosts, // Negative to show as cost
        mortgageCost: -cumulativeMortgageCosts, // Negative to show as cost
        netWorthBuying: netWorth,
        netWorthRenting: netWorthRenting,
        propertyValue: year.propertyValue,
        equityBuilt: year.equityBuilt
      }
    })
  }

  const getMonthlyGrowthChartData = () => {
    if (!result) return []
    
    const monthlyData = []
    const totalMonths = inputs.analysisPeriod * 12
    
    // Calculate monthly values
    const monthlyRent = inputs.monthlyRent
    const monthlyMortgage = result.monthlyCosts.total
    const monthlyPropertyAppreciation = Math.pow(1 + inputs.propertyAppreciation / 100, 1/12) - 1
    const monthlyRentIncrease = Math.pow(1 + inputs.rentIncrease / 100, 1/12) - 1
    
    let currentRent = monthlyRent
    let currentPropertyValue = inputs.propertyPrice
    let cumulativeRentCosts = inputs.monthlyRent * 2 // Upfront costs for renting
    let cumulativeMortgageCosts = result.upfrontCosts.total // Upfront costs for buying
    let cumulativeEquity = 0
    
    for (let month = 1; month <= totalMonths; month++) {
      // Calculate monthly costs
      cumulativeRentCosts += currentRent
      cumulativeMortgageCosts += monthlyMortgage
      
      // Calculate property appreciation
      currentPropertyValue *= (1 + monthlyPropertyAppreciation)
      
      // Calculate equity built (simplified - assumes linear equity building)
      const monthlyEquity = (monthlyMortgage * 0.3) // Rough estimate: 30% of payment goes to equity
      cumulativeEquity += monthlyEquity
      
      // Calculate net worth
      const netWorthBuying = currentPropertyValue - cumulativeMortgageCosts
      const netWorthRenting = -cumulativeRentCosts
      
      monthlyData.push({
        month: `Month ${month}`,
        rentCost: -cumulativeRentCosts,
        mortgageCost: -cumulativeMortgageCosts,
        netWorthBuying: netWorthBuying,
        netWorthRenting: netWorthRenting,
        propertyValue: currentPropertyValue,
        equityBuilt: cumulativeEquity
      })
      
      // Increase rent for next month
      currentRent *= (1 + monthlyRentIncrease)
    }
    
    return monthlyData
  }

  const downloadReport = () => {
    if (!result) return

    // Create PDF content using HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UK Rent vs Mortgage Calculator Report</title>
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
        .comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .comparison-item { background: #f8f9fa; padding: 15px; border-radius: 5px; }
        .yearly-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .yearly-table th, .yearly-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
        .yearly-table th { background: #f8f9fa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Dias Global Limited</div>
        <h1>UK Rent vs Mortgage Calculator Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-GB')}</p>
      </div>

      <div class="section">
        <h2>Property Details</h2>
        <div class="breakdown">
          <div class="row"><span>Property Price:</span><span>${formatCurrency(inputs.propertyPrice)}</span></div>
          <div class="row"><span>Location:</span><span>${inputs.location}</span></div>
          <div class="row"><span>Deposit:</span><span>${formatCurrency(depositInputType === 'percentage' ? (inputs.deposit * inputs.propertyPrice / 100) : inputs.deposit)} (${depositInputType === 'percentage' ? inputs.deposit + '%' : ((inputs.deposit / inputs.propertyPrice) * 100).toFixed(1) + '%'})</span></div>
          <div class="row"><span>Mortgage Rate:</span><span>${inputs.mortgageRate}%</span></div>
          <div class="row"><span>Mortgage Term:</span><span>${inputs.mortgageTerm} years</span></div>
          <div class="row"><span>Monthly Rent:</span><span>${formatCurrency(inputs.monthlyRent)}</span></div>
          <div class="row"><span>Property Appreciation:</span><span>${inputs.propertyAppreciation}% per year</span></div>
          <div class="row"><span>Rent Increase:</span><span>${inputs.rentIncrease}% per year</span></div>
          <div class="row"><span>First Time Buyer:</span><span>${inputs.isFirstTimeBuyer ? 'Yes' : 'No'}</span></div>
          <div class="row"><span>Home Insurance:</span><span>${formatCurrency(inputs.homeInsurance)}/month</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Upfront Costs (Buying)</h2>
        <div class="breakdown">
          <div class="row"><span>Deposit:</span><span>${formatCurrency(result.upfrontCosts.deposit)}</span></div>
          <div class="row"><span>Stamp Duty:</span><span>${formatCurrency(result.upfrontCosts.stampDuty)}</span></div>
          <div class="row"><span>Legal Fees:</span><span>${formatCurrency(result.upfrontCosts.legalFees)}</span></div>
          <div class="row"><span>Survey Fees:</span><span>${formatCurrency(result.upfrontCosts.surveyFees)}</span></div>
          ${result.upfrontCosts.mortgageFees > 0 ? `<div class="row"><span>Mortgage Fees:</span><span>${formatCurrency(result.upfrontCosts.mortgageFees)} (${inputs.mortgageFeesInLoan ? 'Added to loan' : 'Paid upfront'})</span></div>` : ''}
          ${result.upfrontCosts.mortgageBrokerFee > 0 ? `<div class="row"><span>Mortgage Broker Fee:</span><span>${formatCurrency(result.upfrontCosts.mortgageBrokerFee)}</span></div>` : ''}
          <div class="row total"><span>Total Upfront:</span><span>${formatCurrency(result.upfrontCosts.total)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Monthly Costs Comparison</h2>
        <div class="comparison">
          <div class="comparison-item">
            <h3 style="color: #dc3545; margin-top: 0;">Renting</h3>
            <div class="row"><span>Monthly Rent:</span><span>${formatCurrency(inputs.monthlyRent)}</span></div>
            <div class="row total"><span>Total over ${inputs.analysisPeriod} years:</span><span>${formatCurrency(result.totalRentCosts)}</span></div>
          </div>
          <div class="comparison-item">
            <h3 style="color: #28a745; margin-top: 0;">Buying</h3>
            <div class="row"><span>Mortgage Payment:</span><span>${formatCurrency(result.monthlyCosts.mortgagePayment)}</span></div>
            <div class="row"><span>Home Insurance:</span><span>${formatCurrency(result.monthlyCosts.homeInsurance)}</span></div>
            <div class="row"><span>Maintenance:</span><span>${formatCurrency(result.monthlyCosts.maintenance)}</span></div>
            <div class="row"><span>Council Tax:</span><span>${formatCurrency(result.monthlyCosts.councilTax)}</span></div>
            <div class="row total"><span>Total Monthly:</span><span>${formatCurrency(result.monthlyCosts.total)}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>${inputs.analysisPeriod}-Year Analysis</h2>
        <div class="breakdown">
          <div class="row"><span>Total Rent Costs:</span><span>${formatCurrency(result.totalRentCosts)}</span></div>
          <div class="row"><span>Total Mortgage Costs:</span><span>${formatCurrency(result.totalMortgageCosts)}</span></div>
          <div class="row"><span>Equity Built:</span><span>${formatCurrency(result.equityBuilt)}</span></div>
          <div class="row"><span>Property Value:</span><span>${formatCurrency(result.propertyValue)}</span></div>
          <div class="row"><span>Break-even Point:</span><span>Year ${result.breakEvenPoint}</span></div>
          <div class="row total"><span>Net Benefit:</span><span>${formatCurrency(result.netBenefit)}</span></div>
        </div>
        
        <div class="breakdown" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Net Benefit Calculation</h3>
          <div class="row"><span>Property value at end of ${inputs.analysisPeriod} years:</span><span>${formatCurrency(result.propertyValue)}</span></div>
          <div class="row"><span>Total costs paid (interest + upfront):</span><span>${formatCurrency(result.totalInterestPaid + result.upfrontCosts.total)}</span></div>
          <div class="row"><span>Net worth from buying:</span><span>${formatCurrency(result.propertyValue - result.totalInterestPaid - result.upfrontCosts.total)}</span></div>
          <div class="row"><span>Total rent paid over ${inputs.analysisPeriod} years:</span><span>${formatCurrency(result.totalRentCosts)}</span></div>
          <div class="row"><span>Net worth from renting:</span><span>${formatCurrency(-result.totalRentCosts)}</span></div>
          <div class="row total"><span>Net benefit (Buying vs Renting):</span><span>${formatCurrency(result.propertyValue - result.totalInterestPaid - result.upfrontCosts.total)} - ${formatCurrency(-result.totalRentCosts)} = ${formatCurrency(result.netBenefit)}</span></div>
        </div>
      </div>

      <div class="section">
        <h2>Yearly Breakdown</h2>
        <table class="yearly-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Rent Cost</th>
              <th>Mortgage Cost</th>
              <th>Equity Built</th>
              <th>Property Value</th>
              <th>Net Difference</th>
            </tr>
          </thead>
          <tbody>
            ${result.yearlyBreakdown.map(year => `
              <tr>
                <td>${year.year}</td>
                <td>${formatCurrency(year.rentCost)}</td>
                <td>${formatCurrency(year.mortgageCost)}</td>
                <td>${formatCurrency(year.equityBuilt)}</td>
                <td>${formatCurrency(year.propertyValue)}</td>
                <td style="color: ${year.netDifference > 0 ? '#28a745' : '#dc3545'};">${formatCurrency(year.netDifference)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Generated by Dias Global Limited</p>
        <p>https://diasglobal.co.uk/tools/uk-rent-mortgage-calculator</p>
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
      title: 'UK Rent vs Mortgage Calculator Results',
      text: `Rent vs Buy Analysis: ${formatCurrency(result.netBenefit)} net benefit over ${inputs.analysisPeriod} years`,
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
              <Home className="w-4 h-4" />
              UK Property Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              UK Rent vs Mortgage
              <span className="text-accent block">Calculator</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Compare renting vs buying property in the UK. Analyze upfront costs, monthly payments, and long-term equity building to make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* User Guide Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Quick Start Guide */}
            <div className="bg-bg border border-border rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-accent text-center">🚀 How to Use This Calculator</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                  <h3 className="text-xl font-bold mb-3">Enter Property Details</h3>
                  <p className="text-muted">Add the property price, your deposit amount, and mortgage details. Don't worry if you're not sure - we'll help you with realistic estimates!</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                  <h3 className="text-xl font-bold mb-3">Add Monthly Costs</h3>
                  <p className="text-muted">Include rent, insurance, maintenance, and other expenses. We've included helpful examples and typical UK costs to guide you.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                  <h3 className="text-xl font-bold mb-3">Get Your Analysis</h3>
                  <p className="text-muted">See a clear recommendation with detailed charts, year-by-year breakdown, and downloadable report to help you decide.</p>
                </div>
              </div>
            </div>

            {/* What This Calculator Does */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-bg border border-border rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
                  <span className="text-2xl">✅</span> What's Included
                </h3>
                <ul className="space-y-3 text-muted">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong>All Upfront Costs:</strong> Deposit, stamp duty, legal fees, survey fees, and mortgage arrangement fees
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong>Monthly Payments:</strong> Mortgage payments vs rent, including interest and principal breakdown
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong>Ongoing Costs:</strong> Home insurance, maintenance, council tax, and property appreciation
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong>Equity Building:</strong> How much of your mortgage payments build equity vs pay interest
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong>5-Year Projection:</strong> Complete financial analysis showing your net worth over time
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-bg border border-border rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                  <span className="text-2xl">📊</span> What You'll Get
                </h3>
                <ul className="space-y-3 text-muted">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <div>
                      <strong>Clear Recommendation:</strong> "Buying is Better" or "Renting is Better" with explanation
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <div>
                      <strong>Visual Charts:</strong> Pie charts showing cost breakdown and line charts showing growth over time
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <div>
                      <strong>Year-by-Year Breakdown:</strong> See exactly how your money flows each year
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <div>
                      <strong>Downloadable Report:</strong> Professional PDF report you can save or share
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <div>
                      <strong>Net Worth Comparison:</strong> See how your wealth grows with each option
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-accent" />
                  Property Details
                </h2>

                <div className="space-y-6">
                  {/* Property Price */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Property Price (£)
                      <span className="text-xs text-muted ml-2">💡 The total price of the property you're considering</span>
                    </label>
                    <input
                      type="number"
                      value={inputs.propertyPrice}
                      onChange={(e) => setInputs({...inputs, propertyPrice: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 300000"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>💡 Tip:</strong> Check Rightmove, Zoopla, or your local estate agents for current market prices. 
                        UK average house price is around £290,000, but varies significantly by location.
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={inputs.location}
                      onChange={(e) => setInputs({...inputs, location: e.target.value})}
                      placeholder="e.g., London"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Deposit */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Deposit
                      <span className="text-xs text-muted ml-2">💰 The money you pay upfront when buying</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setDepositInputType('percentage')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          depositInputType === 'percentage'
                            ? 'bg-accent text-white'
                            : 'bg-bg border border-border text-text hover:bg-bg-light'
                        }`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositInputType('value')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          depositInputType === 'value'
                            ? 'bg-accent text-white'
                            : 'bg-bg border border-border text-text hover:bg-bg-light'
                        }`}
                      >
                        £
                      </button>
                    </div>
                    <input
                      type="number"
                      value={inputs.deposit}
                      onChange={(e) => setInputs({...inputs, deposit: parseFloat(e.target.value) || 0})}
                      placeholder={depositInputType === 'percentage' ? 'e.g., 20' : 'e.g., 60000'}
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      {depositInputType === 'percentage' 
                        ? `£${formatCurrency((inputs.deposit * inputs.propertyPrice / 100) || 0)} (${inputs.deposit}% of property value)`
                        : `${((inputs.deposit / inputs.propertyPrice) * 100 || 0).toFixed(1)}% of property value`
                      }
                    </p>
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        <strong>💡 Tip:</strong> Most lenders require 5-20% deposit. Higher deposits (15%+) get better mortgage rates. 
                        First-time buyers often use 5-10% deposits with government schemes.
                      </p>
                    </div>
                  </div>

                  {/* Mortgage Rate */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mortgage Rate (%)
                      <span className="text-xs text-muted ml-2">📈 Annual interest rate on your mortgage</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.mortgageRate}
                      onChange={(e) => setInputs({...inputs, mortgageRate: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 5.5"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>💡 Tip:</strong> Current UK mortgage rates are around 4-6%. Check MoneySuperMarket, 
                        Compare the Market, or speak to a mortgage broker for the latest rates.
                      </p>
                    </div>
                  </div>

                  {/* Mortgage Term */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mortgage Term (years)
                    </label>
                    <input
                      type="number"
                      value={inputs.mortgageTerm}
                      onChange={(e) => setInputs({...inputs, mortgageTerm: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 25"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Monthly Rent */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Monthly Rent (£)
                      <span className="text-xs text-muted ml-2">🏠 What you currently pay in rent</span>
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyRent}
                      onChange={(e) => setInputs({...inputs, monthlyRent: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 1200"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        <strong>💡 Tip:</strong> Include your current rent or the rent for a similar property. 
                        UK average rent varies by location: London £1,800+, Manchester £800+, Birmingham £700+.
                      </p>
                    </div>
                  </div>

                  {/* Property Appreciation */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Property Appreciation (% per year)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.propertyAppreciation}
                      onChange={(e) => setInputs({...inputs, propertyAppreciation: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 3"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Rent Increase */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Rent Increase (% per year)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.rentIncrease}
                      onChange={(e) => setInputs({...inputs, rentIncrease: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 2.5"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Analysis Period */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Analysis Period (years)
                    </label>
                    <input
                      type="number"
                      value={inputs.analysisPeriod}
                      onChange={(e) => setInputs({...inputs, analysisPeriod: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* First Time Buyer */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      First Time Buyer
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="firstTimeBuyer"
                          checked={inputs.isFirstTimeBuyer}
                          onChange={() => setInputs({...inputs, isFirstTimeBuyer: true})}
                          className="mr-2 text-accent"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="firstTimeBuyer"
                          checked={!inputs.isFirstTimeBuyer}
                          onChange={() => setInputs({...inputs, isFirstTimeBuyer: false})}
                          className="mr-2 text-accent"
                        />
                        No
                      </label>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      First-time buyers get reduced stamp duty rates
                    </p>
                  </div>

                  {/* Home Insurance */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Monthly Home Insurance (£)
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      value={inputs.homeInsurance}
                      onChange={(e) => setInputs({...inputs, homeInsurance: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 50"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      Required for mortgage approval
                    </p>
                  </div>

                  {/* Mortgage Broker Fee */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mortgage Broker Fee (£)
                    </label>
                    <input
                      type="number"
                      value={inputs.mortgageBrokerFee}
                      onChange={(e) => setInputs({...inputs, mortgageBrokerFee: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 500"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      Optional fee charged by some mortgage brokers
                    </p>
                  </div>

                  {/* Legal Fees */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Legal Fees (£)
                    </label>
                    <input
                      type="number"
                      value={inputs.legalFees}
                      onChange={(e) => setInputs({...inputs, legalFees: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 1500"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      Conveyancing and legal fees
                    </p>
                  </div>

                  {/* Survey Fees */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Survey Fees (£)
                    </label>
                    <input
                      type="number"
                      value={inputs.surveyFees}
                      onChange={(e) => setInputs({...inputs, surveyFees: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 500"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      Property survey and valuation fees
                    </p>
                  </div>

                  {/* Mortgage Fees */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mortgage Fees (£)
                      <span className="text-xs text-muted ml-2">💳 Arrangement and booking fees</span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={inputs.mortgageFees}
                        onChange={(e) => setInputs({...inputs, mortgageFees: parseFloat(e.target.value) || 0})}
                        placeholder="e.g., 1000"
                        className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setInputs({...inputs, mortgageFeesInLoan: false})}
                          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors border border-border rounded-lg ${
                            !inputs.mortgageFeesInLoan
                              ? 'bg-accent text-white border-accent'
                              : 'bg-bg text-text hover:bg-bg-light'
                          }`}
                          title="Pay upfront as part of initial costs"
                        >
                          Pay Upfront
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputs({...inputs, mortgageFeesInLoan: true})}
                          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors border border-border rounded-lg ${
                            inputs.mortgageFeesInLoan
                              ? 'bg-accent text-white border-accent'
                              : 'bg-bg text-text hover:bg-bg-light'
                          }`}
                          title="Add to mortgage amount and pay over loan term"
                        >
                          Add to Loan
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {inputs.mortgageFeesInLoan 
                        ? "Fees will be added to your mortgage amount and paid over the loan term"
                        : "Fees will be paid upfront as part of your initial costs"
                      }
                    </p>
                  </div>

                  {/* Maintenance Rate */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Annual Maintenance Rate (%)
                      <span className="text-xs text-muted ml-2">🔧 Annual cost to maintain the property</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.maintenanceRate}
                      onChange={(e) => setInputs({...inputs, maintenanceRate: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 0.5"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      Annual maintenance as % of property value (typically 0.5-1%)
                    </p>
                    <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        <strong>💡 Tip:</strong> This covers repairs, maintenance, and improvements. 
                        Newer properties: 0.3-0.5%, Older properties: 0.7-1.2%. 
                        For a £300k property, 0.5% = £1,500/year or £125/month.
                      </p>
                    </div>
                  </div>

                  {/* Council Tax */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Monthly Council Tax (£)
                    </label>
                    <input
                      type="number"
                      value={inputs.councilTax}
                      onChange={(e) => setInputs({...inputs, councilTax: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 150"
                      className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">
                      Monthly council tax for the property
                    </p>
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
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              {result && (
                <>
                  {/* Understanding Your Results */}
                  <div className="bg-bg border border-border rounded-2xl p-6 mb-6">
                    <h3 className="text-2xl font-bold mb-4 text-accent">📊 Understanding Your Results</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-400">✅ What the Numbers Mean:</h4>
                        <ul className="text-sm text-muted space-y-2">
                          <li><strong>Net Benefit:</strong> How much better off you'd be financially by choosing one option over the other</li>
                          <li><strong>Equity Built:</strong> The portion of your mortgage payments that builds ownership in the property</li>
                          <li><strong>Property Value:</strong> What your property would be worth after appreciation</li>
                          <li><strong>Total Costs:</strong> All money spent over the analysis period</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-400">💡 Key Considerations:</h4>
                        <ul className="text-sm text-muted space-y-2">
                          <li><strong>Market Conditions:</strong> Property prices and rent can change</li>
                          <li><strong>Interest Rates:</strong> Mortgage rates may fluctuate over time</li>
                          <li><strong>Personal Factors:</strong> Job stability, family plans, lifestyle preferences</li>
                          <li><strong>Opportunity Cost:</strong> What else you could do with your deposit money</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>⚠️ Remember:</strong> This calculator provides estimates based on current conditions. 
                        Your actual experience may vary due to market changes, personal circumstances, and unforeseen events.
                      </p>
                    </div>
                  </div>
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="font-semibold">Net Benefit</h3>
                      </div>
                      <div className="text-2xl font-bold text-accent">
                        {formatCurrency(result.netBenefit)}
                      </div>
                      <div className="text-sm text-muted">
                        Over {inputs.analysisPeriod} years
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className={`bg-card border-2 rounded-2xl p-6 ${
                      result.netBenefit > 0 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-red-500/30 bg-red-500/5'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${
                          result.netBenefit > 0 
                            ? 'bg-green-500/20' 
                            : 'bg-red-500/20'
                        }`}>
                          <Home className={`w-5 h-5 ${
                            result.netBenefit > 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`} />
                        </div>
                        <h3 className={`font-semibold ${
                          result.netBenefit > 0 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {result.netBenefit > 0 ? 'Buying is Better' : 'Renting is Better'}
                        </h3>
                      </div>
                      <div className="text-sm text-muted">
                        {result.netBenefit > 0 ? (
                          <div className="space-y-3">
                            <div className="text-center">
                              <strong className="text-green-400 text-lg">Buying is Better</strong>
                              <p className="text-sm text-muted mt-1">Net advantage: {formatCurrency(result.netBenefit)} over {inputs.analysisPeriod} years</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-xs text-muted">Net Worth After {inputs.analysisPeriod} Years</div>
                                <div className="font-semibold text-green-600">Buy: {formatCurrency(result.propertyValue - result.totalInterestPaid - result.upfrontCosts.total)}</div>
                                <div className="text-sm">Rent: {formatCurrency(-result.totalRentCosts)}</div>
                              </div>
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-xs text-muted">Equity Built</div>
                                <div className="font-semibold text-blue-600">{formatCurrency(result.equityBuilt)}</div>
                                <div className="text-xs text-muted">
                                  Principal: {formatCurrency(result.equityBuilt - (result.propertyValue - inputs.propertyPrice))}<br/>
                                  Appreciation: {formatCurrency(result.propertyValue - inputs.propertyPrice)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-center">
                              <strong className="text-red-400 text-lg">Renting is Better</strong>
                              <p className="text-sm text-muted mt-1">Net advantage: {formatCurrency(Math.abs(result.netBenefit))} over {inputs.analysisPeriod} years</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="text-xs text-muted">Net Worth After {inputs.analysisPeriod} Years</div>
                                <div className="font-semibold text-red-600">Buy: {formatCurrency(result.propertyValue - result.totalInterestPaid - result.upfrontCosts.total)}</div>
                                <div className="text-sm">Rent: {formatCurrency(-result.totalRentCosts)}</div>
                              </div>
                              <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                                <div className="text-xs text-muted">Equity Built</div>
                                <div className="font-semibold text-gray-600">{formatCurrency(result.equityBuilt)}</div>
                                <div className="text-xs text-muted">
                                  Principal: {formatCurrency(result.equityBuilt - (result.propertyValue - inputs.propertyPrice))}<br/>
                                  Appreciation: {formatCurrency(result.propertyValue - inputs.propertyPrice)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Home className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-semibold">Equity Built</h3>
                      </div>
                      <div className="text-2xl font-bold text-accent">
                        {formatCurrency(result.equityBuilt)}
                      </div>
                      <div className="text-sm text-muted">
                        Principal payments
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="font-semibold">Property Value</h3>
                      </div>
                      <div className="text-2xl font-bold text-accent">
                        {formatCurrency(result.propertyValue)}
                      </div>
                      <div className="text-sm text-muted">
                        After {inputs.analysisPeriod} years
                      </div>
                    </div>
                  </div>

                  {/* Upfront Costs */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Upfront Costs (Buying)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Deposit</span>
                        <span>{formatCurrency(result.upfrontCosts.deposit)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Stamp Duty</span>
                        <span>{formatCurrency(result.upfrontCosts.stampDuty)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Legal Fees</span>
                        <span>{formatCurrency(result.upfrontCosts.legalFees)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Survey Fees</span>
                        <span>{formatCurrency(result.upfrontCosts.surveyFees)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Mortgage Fees</span>
                        <span>{formatCurrency(result.upfrontCosts.mortgageFees)}</span>
                      </div>
                      {result.upfrontCosts.mortgageBrokerFee > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Mortgage Broker Fee</span>
                          <span>{formatCurrency(result.upfrontCosts.mortgageBrokerFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-border font-bold text-lg">
                        <span>Total Upfront</span>
                        <span className="text-accent">{formatCurrency(result.upfrontCosts.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Property Investment Breakdown</h3>
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

                  {/* Growth Chart */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">
                      Net Worth Growth Over Time
                      {inputs.analysisPeriod <= 2 && (
                        <span className="text-sm font-normal text-muted ml-2">(Monthly Breakdown)</span>
                      )}
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getGrowthChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey={inputs.analysisPeriod <= 2 ? "month" : "year"} 
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip 
                            formatter={(value, name) => [
                              formatCurrency(Number(value)), 
                              name === 'netWorthBuying' ? 'Net Worth (Buying)' : 
                              name === 'netWorthRenting' ? 'Net Worth (Renting)' :
                              name === 'propertyValue' ? 'Property Value' :
                              name === 'equityBuilt' ? 'Equity Built' : name
                            ]}
                            labelStyle={{ color: '#1F2937' }}
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="netWorthBuying" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            name="Net Worth (Buying)"
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="netWorthRenting" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            name="Net Worth (Renting)"
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="propertyValue" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Property Value"
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-bg rounded-xl">
                      <p className="text-sm text-muted">
                        <strong>Chart Explanation:</strong> {inputs.analysisPeriod <= 2 ? (
                          <>
                            This chart shows your net worth changes on a <strong>monthly basis</strong> over {inputs.analysisPeriod} year{inputs.analysisPeriod > 1 ? 's' : ''}. 
                            Each point represents your cumulative financial position at the end of that month.
                          </>
                        ) : (
                          <>
                            This chart shows your net worth over time. 
                            Each point represents your cumulative financial position at the end of that year.
                          </>
                        )}
                        <br />
                        The green line shows your net worth if you buy (property value minus total costs), 
                        while the red line shows your net worth if you rent (negative because it's money spent). 
                        The blue dashed line shows the property value appreciation.
                      </p>
                    </div>
                  </div>

                  {/* Monthly Costs */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Monthly Costs (Buying)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Mortgage Payment</span>
                        <span>{formatCurrency(result.monthlyCosts.mortgagePayment)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Home Insurance</span>
                        <span>{formatCurrency(result.monthlyCosts.homeInsurance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Maintenance</span>
                        <span>{formatCurrency(result.monthlyCosts.maintenance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Council Tax</span>
                        <span>{formatCurrency(result.monthlyCosts.councilTax)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border font-bold text-lg">
                        <span>Total Monthly</span>
                        <span className="text-accent">{formatCurrency(result.monthlyCosts.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comparison */}
                  {/* Upfront Costs Comparison */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">💰 Upfront Costs Comparison</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-400 flex items-center gap-2">
                          <span>🏠</span> Renting
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Security Deposit</span>
                            <span>{formatCurrency(inputs.monthlyRent * 1.5)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Agency Fees</span>
                            <span>{formatCurrency(inputs.monthlyRent * 0.5)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border font-semibold">
                            <span>Total Upfront</span>
                            <span className="text-red-400">{formatCurrency(inputs.monthlyRent * 2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-400 flex items-center gap-2">
                          <span>🏡</span> Buying
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Deposit</span>
                            <span>{formatCurrency(result.upfrontCosts.deposit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stamp Duty</span>
                            <span>{formatCurrency(result.upfrontCosts.stampDuty)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Legal & Survey Fees</span>
                            <span>{formatCurrency(result.upfrontCosts.legalFees + result.upfrontCosts.surveyFees)}</span>
                          </div>
                          {result.upfrontCosts.mortgageFees > 0 && (
                            <div className="flex justify-between">
                              <span>Mortgage Fees</span>
                              <span>{formatCurrency(result.upfrontCosts.mortgageFees)}</span>
                            </div>
                          )}
                          {result.upfrontCosts.mortgageBrokerFee > 0 && (
                            <div className="flex justify-between">
                              <span>Broker Fee</span>
                              <span>{formatCurrency(result.upfrontCosts.mortgageBrokerFee)}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-border font-semibold">
                            <span>Total Upfront</span>
                            <span className="text-green-400">{formatCurrency(result.upfrontCosts.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Costs Comparison */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">📅 Monthly Costs Comparison</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-400 flex items-center gap-2">
                          <span>🏠</span> Renting
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Monthly Rent</span>
                            <span>{formatCurrency(inputs.monthlyRent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Council Tax</span>
                            <span>{formatCurrency(inputs.councilTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contents Insurance</span>
                            <span>{formatCurrency(15)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border font-semibold">
                            <span>Total Monthly</span>
                            <span className="text-red-400">{formatCurrency(inputs.monthlyRent + inputs.councilTax + 15)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total over {inputs.analysisPeriod} years</span>
                            <span className="font-semibold">{formatCurrency(result.totalRentCosts)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-400 flex items-center gap-2">
                          <span>🏡</span> Buying
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Mortgage Payment</span>
                            <span>{formatCurrency(result.monthlyCosts.mortgagePayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Home Insurance</span>
                            <span>{formatCurrency(result.monthlyCosts.homeInsurance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maintenance</span>
                            <span>{formatCurrency(result.monthlyCosts.maintenance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Council Tax</span>
                            <span>{formatCurrency(result.monthlyCosts.councilTax)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border font-semibold">
                            <span>Total Monthly</span>
                            <span className="text-green-400">{formatCurrency(result.monthlyCosts.total)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total over {inputs.analysisPeriod} years</span>
                            <span className="font-semibold">{formatCurrency(result.totalMortgageCosts)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Yearly Breakdown */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Yearly Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3">Year</th>
                            <th className="text-right py-3">Rent Cost</th>
                            <th className="text-right py-3">Mortgage Cost</th>
                            <th className="text-right py-3">Equity Built</th>
                            <th className="text-right py-3">Property Value</th>
                            <th className="text-right py-3">Net Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.yearlyBreakdown.map((year) => (
                            <tr key={year.year} className="border-b border-border/50">
                              <td className="py-3">{year.year}</td>
                              <td className="text-right py-3">{formatCurrency(year.rentCost)}</td>
                              <td className="text-right py-3">{formatCurrency(year.mortgageCost)}</td>
                              <td className="text-right py-3 text-green-400">{formatCurrency(year.equityBuilt)}</td>
                              <td className="text-right py-3">{formatCurrency(year.propertyValue)}</td>
                              <td className={`text-right py-3 font-semibold ${
                                year.netDifference > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {formatCurrency(year.netDifference)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Actions</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={downloadReport}
                        className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={shareResults}
                        className="flex items-center gap-2 px-6 py-3 bg-bg border border-border rounded-xl hover:border-accent transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!result && (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <Home className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Enter Property Details</h3>
                  <p className="text-muted">
                    Fill in the form to see your rent vs mortgage analysis
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
                  This calculator compares the total costs of renting vs buying a property over a specified period:
                </p>
                <ul className="space-y-2 text-muted">
                  <li><strong>Upfront Costs:</strong> Includes deposit, stamp duty, legal fees, survey fees, mortgage fees, and moving costs</li>
                  <li><strong>Monthly Costs:</strong> Mortgage payments, insurance, maintenance (1% of property value annually), and council tax</li>
                  <li><strong>Equity Building:</strong> Tracks principal payments that build equity in the property</li>
                  <li><strong>Property Appreciation:</strong> Accounts for potential property value increases over time</li>
                  <li><strong>Rent Increases:</strong> Considers annual rent increases</li>
                </ul>
                <p className="text-muted mt-4">
                  <strong>Note:</strong> This calculator provides estimates based on current market conditions and typical costs. Actual costs may vary based on location, property condition, and market conditions.
                </p>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-accent">❓ Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-400">Q: What's the difference between equity and interest in mortgage payments?</h4>
                <p className="text-sm text-muted">
                  <strong>A:</strong> Your monthly mortgage payment has two parts: <strong>Interest</strong> (money paid to the bank) and <strong>Principal</strong> (money that builds your ownership/equity). 
                  Early in your mortgage, most of your payment goes to interest. Over time, more goes to building equity.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">Q: Why might renting be better than buying?</h4>
                <p className="text-sm text-muted">
                  <strong>A:</strong> Renting can be better if: property prices are falling, you need flexibility to move, 
                  you can invest your deposit money elsewhere for higher returns, or if maintenance costs are very high.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-purple-400">Q: What if I'm a first-time buyer?</h4>
                <p className="text-sm text-muted">
                  <strong>A:</strong> First-time buyers get stamp duty relief on properties up to £500,000, and can use government schemes 
                  like Help to Buy or Shared Ownership. This can significantly reduce upfront costs.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">Q: How accurate are these calculations?</h4>
                <p className="text-sm text-muted">
                  <strong>A:</strong> These are estimates based on current conditions. Real results depend on market changes, 
                  your specific mortgage terms, property condition, and personal circumstances. Use this as a starting point for your research.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-red-400">Q: What costs am I missing?</h4>
                <p className="text-sm text-muted">
                  <strong>A:</strong> This calculator covers major costs, but you might also consider: moving costs, 
                  furniture, decorating, emergency repairs, service charges (for flats), and potential rental income if you move out.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Disclaimer */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4 text-accent">Important Disclaimer</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted text-sm leading-relaxed">
                <strong>This calculator is for informational purposes only and should not be considered as financial, investment, or legal advice.</strong> 
                The calculations provided are estimates based on current market conditions and assumptions that may not reflect actual costs or returns. 
                Property values, interest rates, rental costs, and other factors can change significantly over time. 
                This analysis does not account for all potential costs, risks, or benefits associated with property ownership or rental. 
                We recommend consulting with qualified financial advisors, mortgage brokers, and real estate professionals before making any property-related decisions. 
                Dias Global Limited does not accept any responsibility for decisions made based on the information provided by this calculator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
