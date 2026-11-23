import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { FeatureList } from "@/components/feature-list"
import { FilterBar } from "@/components/filter-bar"
import { getFeatures, getModules } from "@/lib/data"
import { byPriority } from "@/lib/labels"

// Les filtres sont dans l'URL (?q=…&module=…) : la page reste un Server Component.
export default async function BacklogPage({ searchParams }: PageProps<"/backlog">) {
  const sp = await searchParams
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "")
  const q = get("q").toLowerCase()

  const [all, modules] = await Promise.all([getFeatures(), getModules()])
  const features = all
    .filter((f) => !q || f.title.toLowerCase().includes(q))
    .filter((f) => !get("module") || String(f.module_id) === get("module"))
    .filter((f) => !get("status") || f.status === get("status"))
    .filter((f) => !get("priority") || f.priority === get("priority"))
    .filter((f) => get("nosprint") !== "1" || f.sprint_id === null)
    .sort(byPriority)

  return (
    <>
      <PageHeader
        title="Backlog"
        subtitle="Toutes les features, planifiées ou non."
        actions={<Button asChild><Link href="/features/new"><Plus /> Nouvelle feature</Link></Button>}
      />
      <FilterBar modules={modules} filters={["q", "module", "status", "priority", "nosprint"]} count={features.length} />
      <FeatureList features={features} showSprint />
    </>
  )
}
