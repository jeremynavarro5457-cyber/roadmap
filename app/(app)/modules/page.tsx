import Link from "next/link"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { getFeatures, getModules } from "@/lib/data"
import { STATUS_STYLES } from "@/lib/labels"
import { cn } from "@/lib/utils"

export default async function ModulesPage() {
  const [modules, features] = await Promise.all([getModules(), getFeatures()])
  return (
    <>
      <PageHeader title="Modules" subtitle="Les grandes zones fonctionnelles du produit. Cliquez pour voir leurs features." />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => {
          const fs = features.filter((f) => f.module_id === m.id)
          return (
            <li key={m.id}>
              <Link href={`/backlog?module=${m.id}`}>
                <Card className="h-full gap-0 p-4 hover:border-input">
                  <div className="mb-1.5 flex items-center gap-2">
                    {/* Couleur stockée en base : style inline autorisé */}
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: m.color }} aria-hidden />
                    <span className="text-base font-semibold">{m.name}</span>
                    <span className="ml-auto text-xs text-subtle">{fs.length} features</span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{m.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["backlog", "todo", "in_progress", "done"].map((s) => {
                      const n = fs.filter((f) => f.status === s).length
                      return n > 0 && (
                        <span key={s} className={cn("rounded-sm px-2 py-0.5 text-xs font-medium", STATUS_STYLES[s].badge)}>
                          {n} {STATUS_STYLES[s].label}
                        </span>
                      )
                    })}
                  </div>
                </Card>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
