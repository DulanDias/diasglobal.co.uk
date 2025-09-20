import Script from 'next/script'

interface CalculatorSchemaProps {
  name: string
  description: string
  url: string
  country: string
  category: string
}

export function CalculatorSchema({ name, description, url, country, category }: CalculatorSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": "https://diasglobal.co.uk"
    },
    "featureList": [
      "Tax calculations",
      "Salary breakdown",
      "Financial planning",
      "Downloadable reports"
    ],
    "screenshot": "https://diasglobal.co.uk/logo.png",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-GB",
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": country
      }
    },
    "about": {
      "@type": "Thing",
      "name": category
    }
  }

  return (
    <Script
      id="calculator-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

interface ToolSchemaProps {
  name: string
  description: string
  url: string
  country: string
  category: string
  features: string[]
}

export function ToolSchema({ name, description, url, country, category, features }: ToolSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": "https://diasglobal.co.uk"
    },
    "featureList": features,
    "screenshot": "https://diasglobal.co.uk/logo.png",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-GB",
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": country
      }
    },
    "about": {
      "@type": "Thing",
      "name": category
    }
  }

  return (
    <Script
      id="tool-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

interface ToolsPageSchemaProps {
  tools: Array<{
    name: string
    description: string
    url: string
    country: string
    category: string
  }>
}

export function ToolsPageSchema({ tools }: ToolsPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Financial Tools & Calculators",
    "description": "Free financial tools and calculators for UK and Sri Lanka. Calculate take-home pay, rent vs mortgage, and more.",
    "url": "https://diasglobal.co.uk/tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "url": tool.url,
          "applicationCategory": "FinanceApplication",
          "audience": {
            "@type": "Audience",
            "geographicArea": {
              "@type": "Country",
              "name": tool.country
            }
          }
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": "https://diasglobal.co.uk"
    }
  }

  return (
    <Script
      id="tools-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}
