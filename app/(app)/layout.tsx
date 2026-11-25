import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserMenu } from "@/components/user-menu"

// Layout des pages de l'app (groupe "(app)") : barre latérale + contenu.
// Le dossier entre parenthèses n'apparaît pas dans l'URL.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-2 border-b border-sidebar-border bg-sidebar p-3 md:sticky md:top-0 md:h-screen md:w-58 md:border-r md:border-b-0">
        <div className="flex items-center gap-2 px-2 pt-1 pb-3 font-semibold">
          <span className="grid size-5.5 place-items-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground shadow-glow" aria-hidden>R</span>
          <span className="font-mono tracking-tight">roadmap</span>
        </div>
        {/* Suspense : le lien actif dépend de l'URL, connue seulement au moment de la requête */}
        <Suspense>
          <SidebarNav />
        </Suspense>
        <div className="mt-auto">
          <UserMenu />
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
    </div>
  )
}
