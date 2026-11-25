"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"
import {
  featureSchema, sprintSchema, commentSchema, profileSchema,
  type FeatureInput, type SprintInput, type CommentInput, type ProfileInput,
} from "@/lib/schemas"

// Server Actions : toutes les écritures en base passent par ici (jamais depuis le navigateur).
// Les droits (qui peut modifier quoi) sont vérifiés par les policies RLS de Supabase.

const DENIED = "Vous n'avez pas le droit d'effectuer cette action."

// Traduit une erreur Supabase en message lisible.
// 42501 = refus de la sécurité des lignes (RLS) ; 23503 = une autre ligne dépend de celle-ci.
function friendlyError(error: { code?: string; message: string }) {
  if (error.code === "42501") return DENIED
  if (error.code === "23503") return "Impossible : d'autres données (ex. des commentaires) dépendent de cet élément."
  return error.message
}

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
  // Un UPDATE refusé par RLS ne renvoie pas d'erreur mais aucune ligne : .single() échoue (PGRST116)
  if (error) return { error: error.code === "PGRST116" ? DENIED : friendlyError(error) }

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
  // .select() permet de savoir combien de lignes ont vraiment été modifiées
  const { data, error } = await supabase.from("features").update(update).eq("id", id).select("id")
  if (error) return { error: friendlyError(error) }
  if (data.length === 0) return { error: DENIED }
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
  if (error) return { error: friendlyError(error) }
  revalidatePath("/", "layout")
  redirect(`/sprints/${data.id}`)
}

export async function addComment(featureId: number, input: CommentInput) {
  const values = commentSchema.parse(input)
  const supabase = await createClient()
  // L'auteur est l'utilisateur connecté (lu côté serveur, impossible à falsifier depuis le navigateur)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Vous devez être connecté." }
  const { error } = await supabase.from("comments").insert({ ...values, feature_id: featureId, author_id: user.id })
  if (error) return { error: friendlyError(error) }
  revalidatePath(`/features/${featureId}`)
  return { error: null }
}

// Modifier le texte d'un commentaire (la policy RLS n'autorise que son auteur)
export async function updateComment(featureId: number, commentId: number, input: CommentInput) {
  const values = commentSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("comments")
    .update({ content: values.content })
    .eq("id", commentId)
    .select("id")
  if (error) return { error: friendlyError(error) }
  if (data.length === 0) return { error: DENIED }
  revalidatePath(`/features/${featureId}`)
  return { error: null }
}

// Supprimer une feature (admin ou responsable assigné, d'après la policy RLS)
export async function deleteFeature(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("features").delete().eq("id", id).select("id")
  if (error) return { error: friendlyError(error) }
  if (data.length === 0) return { error: DENIED }
  revalidatePath("/", "layout")
  redirect("/backlog")
}

// Mettre à jour son propre profil. On n'envoie jamais le rôle : il n'est pas modifiable ici.
export async function updateProfile(input: ProfileInput) {
  const values = profileSchema.parse(input)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Vous devez être connecté." }

  const { data, error } = await supabase
    .from("profiles")
    .update({ firstname: values.firstname || null, lastname: values.lastname || null })
    .eq("id", user.id)
    .select("id")
  if (error) return { error: friendlyError(error) }
  if (data.length === 0) return { error: DENIED }
  revalidatePath("/", "layout")
  return { error: null }
}
