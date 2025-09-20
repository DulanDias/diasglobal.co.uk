'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, Home, PoundSterling, Search, Filter, FileText } from 'lucide-react'

interface Tool {
  id: string
  title: string
  description: string
  country: 'United Kingdom' | 'Sri Lanka'
  category: 'salary' | 'property' | 'tax'
  icon: React.ReactNode
  href: string
  features: string[]
}

const tools: Tool[] = [
  {
    id: 'uk-salary-calculator',
    title: 'UK Take Home Pay Calculator',
    description: 'Calculate your net salary after tax, National Insurance, and other deductions across England, Scotland, Wales, and Northern Ireland.',
    country: 'United Kingdom',
    category: 'salary',
    icon: <Calculator className="w-8 h-8" />,
    href: '/tools/uk-salary-calculator',
    features: ['Regional tax brackets', 'NI calculations', 'Daily/Weekly/Monthly/Yearly breakdown', 'Pension deductions']
  },
  {
    id: 'uk-rent-mortgage-calculator',
    title: 'UK Rent vs Mortgage Calculator',
    description: 'Compare renting vs buying property with comprehensive analysis including upfront costs, interest rates, and long-term equity building.',
    country: 'United Kingdom',
    category: 'property',
    icon: <Home className="w-8 h-8" />,
    href: '/tools/uk-rent-mortgage-calculator',
    features: ['Upfront cost analysis', 'Interest rate calculations', 'Equity building projections', 'PDF reports']
  },
  {
    id: 'sri-lanka-paye-calculator',
    title: 'Sri Lanka PAYE Tax Calculator',
    description: 'Calculate your take-home pay after PAYE tax deductions in Sri Lanka with accurate tax brackets and allowances.',
    country: 'Sri Lanka',
    category: 'salary',
    icon: <PoundSterling className="w-8 h-8" />,
    href: '/tools/sri-lanka-paye-calculator',
    features: ['PAYE tax calculations', 'Tax-free allowances', 'Monthly breakdown', 'Annual projections']
  },
  {
    id: 'sri-lanka-annual-tax-assessment',
    title: 'Sri Lanka Annual Tax Assessment Calculator',
    description: 'Calculate your total tax liability with multiple income sources, taxes already deducted, WHT on interest, and determine additional tax to pay.',
    country: 'Sri Lanka',
    category: 'tax',
    icon: <FileText className="w-8 h-8" />,
    href: '/tools/sri-lanka-annual-tax-assessment',
    features: ['Multiple income sources', 'Tax already deducted', 'WHT calculations', 'Additional tax due']
  }
]

export default function ToolsListing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'United Kingdom' | 'Sri Lanka'>('all')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'salary' | 'property' | 'tax'>('all')

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === 'all' || tool.country === selectedCountry
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    
    return matchesSearch && matchesCountry && matchesCategory
  })

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-bg to-bg-light">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calculator className="w-4 h-4" />
              Financial Tools & Calculators
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Smart Financial
              <span className="text-accent block">Calculators</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Make informed financial decisions with our comprehensive calculators for UK and Sri Lanka. 
              Calculate take-home pay, compare rent vs mortgage, and plan your finances with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-bg-light">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Country Filter */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value as 'all' | 'United Kingdom' | 'Sri Lanka')}
                    className="pl-12 pr-8 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer min-w-[140px]"
                  >
                    <option value="all">All Countries</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'salary' | 'property' | 'tax')}
                    className="pl-4 pr-8 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer min-w-[120px]"
                  >
                    <option value="all">All Categories</option>
                    <option value="salary">Salary & Tax</option>
                    <option value="property">Property</option>
                    <option value="tax">Tax Assessment</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Tools
            </h2>
            <p className="text-muted text-lg">
              {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group block"
              >
                <div className="bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-accent hover:-translate-y-2 hover:shadow-lg">
                  {/* Icon and Country Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent/20 transition-colors">
                      {tool.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tool.country === 'United Kingdom' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {tool.country}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-muted mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-accent mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <span className="text-accent font-semibold group-hover:underline">
                      Use Calculator →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <div className="text-muted text-lg mb-4">No tools found matching your criteria</div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCountry('all')
                  setSelectedCategory('all')
                }}
                className="text-accent hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-bg-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Use Our Financial Tools?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Accurate Calculations</h3>
                <p className="text-muted">
                  Our calculators use the latest tax rates and regulations to ensure accurate results.
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Comprehensive Analysis</h3>
                <p className="text-muted">
                  Get detailed breakdowns and comparisons to make informed financial decisions.
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4">
                  <PoundSterling className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Free to Use</h3>
                <p className="text-muted">
                  All our financial tools are completely free with no hidden costs or subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Disclaimer */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-bg border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-accent">Important Disclaimer</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted text-sm leading-relaxed mb-4">
                  <strong>All financial tools and calculators provided on this website are for informational purposes only and should not be considered as financial, tax, investment, or legal advice.</strong>
                </p>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  The calculations provided are estimates based on current tax rates, regulations, and market conditions as of September 2025. 
                  These rates and conditions can change, and individual circumstances may vary significantly.
                </p>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  This website does not account for all possible deductions, allowances, special circumstances, or future changes in legislation 
                  that may apply to your specific situation. Actual results may differ from the calculations provided.
                </p>
                <p className="text-muted text-sm leading-relaxed">
                  We strongly recommend consulting with qualified financial advisors, tax professionals, accountants, or relevant government 
                  departments before making any financial decisions based on the information provided by these tools.
                </p>
                <p className="text-muted text-sm leading-relaxed mt-4">
                  <strong>Dias Global Limited does not accept any responsibility for decisions made based on the information provided by these calculators.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
