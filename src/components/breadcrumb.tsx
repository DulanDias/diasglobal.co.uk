import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`bg-bg-light border-b border-border py-3 pt-24 ${className}`} aria-label="Breadcrumb">
      <div className="container">
        <ol className="flex items-center space-x-2 text-sm text-text-muted">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-accent transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
