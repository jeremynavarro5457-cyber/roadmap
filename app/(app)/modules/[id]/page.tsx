import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { FeatureList } from "@/components/feature-list"
import { createClient } from "@/lib/supabase/server"
import { getProfiles, type FeatureListItem } from "@/lib/data"
import { getModuleFeatures } from "@/lib/rpc"
import { byPriority } from "@/lib/labels"

// Page d'un module : ses features, avec leur nombre de commentaires (fonction Postgres).
export default async function ModulePage({ params }: PageProps<"/modules/[id]">) {
  const { id } = await params
  const supabase = await createClient()
  const { data: module } = await supabase.from("modules").select("*").eq("id", Number(id)).maybeSingle()
  if (!module) notFound()

  const [rows, profiles] = await Promise.all([getModuleFeatures(module.id), getProfiles()])

  // La fonction renvoie des identifiants : on retrouve l'assigné dans la liste des profils
  // et on remet les données dans la forme attendue par FeatureList.
  const features: FeatureListItem[] = rows
    .map((r) => {
      const person = profiles.find((p) => p.id === r.assigned_to)
      return {
        id: r.id,
        title: r.title,
        status: r.status,
        priority: r.priority,
        effort: r.effort,
        sprint_id: r.sprint_id,
        module: { id: module.id, name: module.name, color: module.color },
        assignee: person
          ? { id: person.id, firstname: person.firstname, lastname: person.lastname, avatar_url: person.avatar_url }
          : null,
        comments: [{ count: r.comment_count }],
      }
    })
    .sort(byPriority)

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/modules", label: "Modules" }, { label: module.name }]}
        title={
          <span className="flex items-center gap-2.5">
            {/* Couleur stockée en base : style inline autorisé */}
            <span className="size-3 rounded-full" style={{ backgroundColor: module.color }} aria-hidden />
            {module.name}
          </span>
        }
        subtitle={`${module.description ?? ""} · ${features.length} feature${features.length > 1 ? "s" : ""}`}
      />
      <FeatureList features={features} showSprint />
    </>
  )
}
