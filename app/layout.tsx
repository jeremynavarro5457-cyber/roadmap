import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
// Police monospace façon éditeur de code : pour les repères techniques (dates, en-têtes de tableau…)
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Pilotage des features, sprints et modules de l'équipe produit",
}

// Layout racine : commun à toutes les pages, y compris /login (sans barre latérale)
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full tabular-nums">{children}</body>
    </html>
  )
}
