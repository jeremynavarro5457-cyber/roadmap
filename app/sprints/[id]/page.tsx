import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { FeatureList } from "@/components/feature-list"
import { FeatureBoard } from "@/components/feature-board"
import { FilterBar } from "@/components/filter-bar"
import { SprintStatusBadge, ProgressBar } from "@/components/badges"
import { createClient } from "@/lib/supabase/server"
import { getFeatures, getModules, progress } from "@/lib/data"
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

  const [all, modules] = await Promise.all([getFeatures({ sprintId: sprint.id }), getModules()])
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
        actions={<Button asChild><Link href={`/features/new?sprint=${sprint.id}`}><Plus /> Ajouter une feature</Link></Button>}
      >
        <div className="mt-3 w-64">
          <ProgressBar value={progress(all)} />
          <span className="text-xs text-subtle">{progress(all)} % terminé · {all.length} features</span>
        </div>
      </PageHeader>

      <FilterBar view={view} modules={modules} showView filters={["module", "priority"]} />
      {view === "list" ? <FeatureList features={features} /> : <FeatureBoard features={features} />}
    </>
  )
}
