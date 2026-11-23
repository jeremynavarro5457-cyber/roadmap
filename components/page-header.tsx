import Link from "next/link"
import { ChevronRight } from "lucide-react"

// En-tête de page : fil d'Ariane optionnel, titre, sous-titre et actions à droite.
export function PageHeader({
  title,
  subtitle,
  crumbs,
  actions,
  children,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  crumbs?: { href?: string; label: string }[]
  actions?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6">
      {crumbs && (
        <nav aria-label="Fil d'Ariane" className="mb-2 flex flex-wrap items-center gap-1 text-xs font-medium text-subtle">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3" aria-hidden />}
              {c.href ? <Link href={c.href} className="text-muted-foreground hover:text-primary">{c.label}</Link> : c.label}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-[1.375rem] leading-7 font-semibold">{title}</h1></div>
          {subtitle && <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>}
          {children}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
