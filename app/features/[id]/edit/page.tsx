import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { FeatureForm } from "@/components/feature-form"
import { getFeatureFormOptions } from "@/lib/feature-form-options"
import { createClient } from "@/lib/supabase/server"
import { featureSchema } from "@/lib/schemas"

export default async function EditFeaturePage({ params }: PageProps<"/features/[id]/edit">) {
  const { id } = await params
  const supabase = await createClient()
  const { data: f } = await supabase.from("features").select("*").eq("id", Number(id)).maybeSingle()
  if (!f) notFound()

  // Les selects travaillent avec des chaînes : on convertit les valeurs de la base
  const defaultValues = featureSchema.parse({
    title: f.title, description: f.description ?? "", status: f.status, priority: f.priority,
    effort: f.effort ?? "", impact: f.impact, module_id: f.module_id ? String(f.module_id) : "",
    sprint_id: f.sprint_id ? String(f.sprint_id) : "", assigned_to: f.assigned_to ?? "",
  })

  return (
    <>
      <PageHeader crumbs={[{ href: `/features/${f.id}`, label: "← Retour" }]} title="Modifier la feature" />
      <FeatureForm id={f.id} backHref={`/features/${f.id}`} defaultValues={defaultValues} options={await getFeatureFormOptions()} />
    </>
  )
}
