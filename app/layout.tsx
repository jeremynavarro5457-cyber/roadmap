import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter } from "next/font/google"
import { SidebarNav } from "@/components/sidebar-nav"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Pilotage des features, sprints et modules de l'équipe produit",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col tabular-nums md:flex-row">
        {/* Barre latérale présente sur toutes les pages */}
        <aside className="flex shrink-0 flex-col gap-2 border-b bg-sidebar p-3 md:sticky md:top-0 md:h-screen md:w-58 md:border-r md:border-b-0">
          <div className="flex items-center gap-2 px-2 pt-1 pb-3 font-semibold">
            <span className="grid size-5.5 place-items-center rounded-md bg-primary text-xs text-primary-foreground" aria-hidden>R</span>
            Roadmap
          </div>
          {/* Suspense : le lien actif dépend de l'URL, connue seulement au moment de la requête */}
          <Suspense>
            <SidebarNav />
          </Suspense>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
      </body>
    </html>
  )
}
