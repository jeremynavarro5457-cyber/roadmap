import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { SprintStatusBadge, ProgressBar } from "@/components/badges"
import { getFeatures, getSprints, progress } from "@/lib/data"
import { formatDate } from "@/lib/labels"
import { cn } from "@/lib/utils"

const ORDER: Record<string, number> = { active: 0, planned: 1, completed: 2 }

export default async function SprintsPage() {
  const [sprints, features] = await Promise.all([getSprints(), getFeatures()])
  // Le sprint actif en premier, puis les planifiés, puis les terminés
  const sorted = [...sprints].sort((a, b) => ORDER[a.status] - ORDER[b.status])

  return (
    <>
      <PageHeader
        title="Sprints"
        subtitle="Cliquez sur un sprint pour voir ses features."
        actions={<Button asChild><Link href="/sprints/new"><Plus /> Nouveau sprint</Link></Button>}
      />
      <ul className="grid gap-3">
        {sorted.map((s) => {
          const fs = features.filter((f) => f.sprint_id === s.id)
          return (
            <li key={s.id}>
              <Link href={`/sprints/${s.id}`}>
                <Card className={cn("grid gap-4 p-4 hover:border-input md:grid-cols-[1fr_220px] md:items-center", s.status === "active" && "border-sprint-active-bg ring-1 ring-sprint-active-bg")}>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold">Sprint {s.id}</span>
                      <SprintStatusBadge status={s.status} />
                      <span className="text-xs text-subtle">{formatDate(s.start_date)} → {formatDate(s.end_date)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.goal}</p>
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs text-subtle">
                      <span>{fs.length} features</span><span>{progress(fs)} %</span>
                    </div>
                    <ProgressBar value={progress(fs)} />
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
