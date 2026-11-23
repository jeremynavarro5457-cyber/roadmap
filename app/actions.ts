"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"
import { featureSchema, sprintSchema, commentSchema, type FeatureInput, type SprintInput, type CommentInput } from "@/lib/schemas"

// Server Actions : toutes les écritures en base passent par ici (jamais depuis le navigateur).

export async function saveFeature(id: number | null, input: FeatureInput) {
  // On revalide côté serveur : on ne fait jamais confiance aux données reçues du navigateur.
  const values = featureSchema.parse(input)
  const supabase = await createClient()
  const row = {
    ...values,
    description: values.description || null,
    effort: values.effort || null,
    module_id: values.module_id ? Number(values.module_id) : null,
    sprint_id: values.sprint_id ? Number(values.sprint_id) : null,
    assigned_to: values.assigned_to || null,
  }

  const { data, error } = id
    ? await supabase.from("features").update(row).eq("id", id).select("id").single()
    : await supabase.from("features").insert(row).select("id").single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect(`/features/${data.id}`)
}

// Mise à jour rapide d'un seul champ depuis la page détail (statut, priorité, sprint, assigné)
type TablesUpdate = Database["public"]["Tables"]["features"]["Update"]
const EDITABLE_FIELDS = ["status", "priority", "sprint_id", "assigned_to"] as const
type EditableField = (typeof EDITABLE_FIELDS)[number]

export async function updateFeatureField(id: number, field: EditableField, value: string) {
  if (!EDITABLE_FIELDS.includes(field)) return { error: "Champ non modifiable" }
  const supabase = await createClient()
  // On construit l'objet de mise à jour champ par champ pour que TypeScript vérifie les types
  const update: TablesUpdate =
    field === "sprint_id" ? { sprint_id: value ? Number(value) : null }
    : field === "assigned_to" ? { assigned_to: value || null }
    : field === "status" ? { status: value }
    : { priority: value }
  const { error } = await supabase.from("features").update(update).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/", "layout")
  return { error: null }
}

export async function saveSprint(input: SprintInput) {
  const values = sprintSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sprints")
    .insert({ ...values, goal: values.goal || null })
    .select("id")
    .single()
  if (error) return { error: error.message }
  revalidatePath("/", "layout")
  redirect(`/sprints/${data.id}`)
}

export async function addComment(featureId: number, input: CommentInput) {
  const values = commentSchema.parse(input)
  const supabase = await createClient()
  const { error } = await supabase.from("comments").insert({ ...values, feature_id: featureId })
  if (error) return { error: error.message }
  revalidatePath(`/features/${featureId}`)
  return { error: null }
}
