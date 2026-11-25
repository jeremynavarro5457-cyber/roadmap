import { createClient } from "@/lib/supabase/server"

// Requêtes de lecture partagées entre plusieurs pages.
// Les jointures (module, assigné, commentaires) utilisent les clés étrangères existantes.

export const FEATURE_SELECT =
  "*, module:modules(id, name, color), assignee:profiles!features_assigned_to_fkey(id, firstname, lastname, avatar_url), comments(count)"

export async function getFeatures(filters: { sprintId?: number } = {}) {
  const supabase = await createClient()
  let query = supabase.from("features").select(FEATURE_SELECT).order("id")
  if (filters.sprintId) query = query.eq("sprint_id", filters.sprintId)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export type FeatureWithRelations = Awaited<ReturnType<typeof getFeatures>>[number]

export async function getSprints() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("sprints").select("*").order("start_date")
  if (error) throw new Error(error.message)
  return data
}

export async function getModules() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("modules").select("*").order("name")
  if (error) throw new Error(error.message)
  return data
}

export async function getProfiles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").order("firstname")
  if (error) throw new Error(error.message)
  return data
}

// Nombre de commentaires renvoyé par Supabase sous la forme [{ count: n }]
export function commentCount(f: { comments: { count: number }[] }) {
  return f.comments[0]?.count ?? 0
}

// Progression d'un sprint = features terminées / features non annulées
export function progress(features: { status: string }[]) {
  const counted = features.filter((f) => f.status !== "cancelled")
  if (counted.length === 0) return 0
  return Math.round((100 * counted.filter((f) => f.status === "done").length) / counted.length)
}
