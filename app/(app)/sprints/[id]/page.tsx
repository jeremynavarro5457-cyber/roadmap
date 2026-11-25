import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { FeatureList } from "@/components/feature-list"
import { FeatureBoard } from "@/components/feature-board"
import { FilterBar } from "@/components/filter-bar"
import { SprintStatusBadge, StatusBadge, ProgressBar } from "@/components/badges"
import { MovePendingButton } from "@/components/move-pending-button"
import { createClient } from "@/lib/supabase/server"
import { getFeatures, getModules } from "@/lib/data"
import { getSprintSummary, progressFromSummary } from "@/lib/rpc"
import { getCurrentProfile } from "@/lib/auth"
import { canCreateFeature, isAdmin } from "@/lib/permissions"
import { byPriority, formatDate } from "@/lib/labels"

export default async function SprintPage({ params, searchParams }: PageProps<"/sprints/[id]">) {
  const { id } = await params
  const sp = await searchParams
  const view = sp.view === "board" ? "board" : "list"
  const moduleFilter = typeof sp.module === "string" ? sp.module : ""
  const prioFilter = typeof sp.priority === "string" ? sp.priority : ""

  const supabase = await createClient()
  const { data: sprint } = await supabase.from("sprints").select("*").eq("id", Number(id)).maybeSingle()
  if (!sprint) notFound()

  // Le résumé (total, répartition par statut, non assignées) est calculé par une fonction Postgres
  const [all, modules, me, summary] = await Promise.all([
    getFeatures({ sprintId: sprint.id }),
    getModules(),
    getCurrentProfile(),
    getSprintSummary(sprint.id),
  ])
  const percent = progressFromSummary(summary)
  const features = all
    .filter((f) => !moduleFilter || String(f.module_id) === moduleFilter)
    .filter((f) => !prioFilter || f.priority === prioFilter)
    .sort(byPriority)

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/sprints", label: "Sprints" }, { label: `Sprint ${sprint.id}` }]}
        title={<>Sprint {sprint.id} <SprintStatusBadge status={sprint.status} /></>}
        subtitle={`${sprint.goal ?? ""} · ${formatDate(sprint.start_date)} → ${formatDate(sprint.end_date)}`}
        // Boutons visibles uniquement pour les admins
        actions={
          <>
            {isAdmin(me) && sprint.status !== "planned" && <MovePendingButton sprintId={sprint.id} />}
            {canCreateFeature(me) && <Button asChild><Link href={`/features/new?sprint=${sprint.id}`}><Plus /> Ajouter une feature</Link></Button>}
          </>
        }
      >
        <div className="mt-3 grid max-w-md gap-2">
          <ProgressBar value={percent} />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
            <span>{percent} % terminé · {summary.total_features} features</span>
            {summary.unassigned > 0 && <span>· {summary.unassigned} non assignée{summary.unassigned > 1 ? "s" : ""}</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(summary.by_status).map(([status, count]) => (
              <span key={status} className="flex items-center gap-1 text-xs text-muted-foreground"><StatusBadge status={status} /> {count}</span>
            ))}
          </div>
        </div>
      </PageHeader>

      <FilterBar view={view} modules={modules} showView filters={["module", "priority"]} />
      {view === "list" ? <FeatureList features={features} /> : <FeatureBoard features={features} />}
    </>
  )
}
