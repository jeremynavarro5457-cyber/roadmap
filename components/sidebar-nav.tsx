// Composant client : il a besoin de usePathname() pour savoir quel lien est actif.
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarRange, ListTodo, Boxes } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/sprints", label: "Sprints", icon: CalendarRange },
  { href: "/backlog", label: "Backlog", icon: ListTodo },
  { href: "/modules", label: "Modules", icon: Boxes },
]

export function SidebarNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-row flex-wrap gap-0.5 md:flex-col" aria-label="Navigation principale">
      {LINKS.map(({ href, label, icon: Icon }) => {
        // "/" n'est actif que sur la page d'accueil ; les autres le sont aussi sur leurs sous-pages
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground hover:bg-secondary",
              active && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
