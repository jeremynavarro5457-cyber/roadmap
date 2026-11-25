import { redirect } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { FeatureForm } from "@/components/feature-form"
import { getFeatureFormOptions } from "@/lib/feature-form-options"
import { getCurrentProfile } from "@/lib/auth"
import { canCreateFeature } from "@/lib/permissions"

export default async function NewFeaturePage({ searchParams }: PageProps<"/features/new">) {
  // Seuls les admins peuvent créer une feature : on renvoie les autres vers le backlog
  if (!canCreateFeature(await getCurrentProfile())) redirect("/backlog")

  const sp = await searchParams
  // ?sprint=2 pré-remplit le sprint quand on vient de la page d'un sprint
  const sprint = typeof sp.sprint === "string" ? sp.sprint : ""
  const backHref = sprint ? `/sprints/${sprint}` : "/backlog"

  return (
    <>
      <PageHeader crumbs={[{ href: backHref, label: "← Retour" }]} title="Nouvelle feature" />
      <FeatureForm
        id={null}
        backHref={backHref}
        options={await getFeatureFormOptions()}
        defaultValues={{
          title: "", description: "", status: sprint ? "todo" : "backlog", priority: "medium",
          effort: "", impact: "medium", module_id: "", sprint_id: sprint, assigned_to: "",
        }}
      />
    </>
  )
}
