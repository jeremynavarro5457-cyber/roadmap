import type { Tables } from "@/lib/supabase/database.types"

// Règles d'affichage des boutons. Elles reprennent les policies RLS de Supabase :
// ici on ne fait que CACHER les boutons inutiles, la vraie protection reste dans la base.
// (Si quelqu'un contourne l'interface, Supabase refuse quand même l'action.)

type Profile = Pick<Tables<"profiles">, "id" | "role"> | null

export function isAdmin(profile: Profile) {
  return profile?.role === "admin"
}

// Créer une feature : admin uniquement
export function canCreateFeature(profile: Profile) {
  return isAdmin(profile)
}

// Modifier / supprimer une feature : admin OU responsable assigné
export function canEditFeature(profile: Profile, feature: { assigned_to: string | null }) {
  if (!profile) return false
  return isAdmin(profile) || feature.assigned_to === profile.id
}

// Modifier un commentaire : son auteur uniquement (même un admin ne peut pas)
export function canEditComment(profile: Profile, comment: { author_id: string }) {
  if (!profile) return false
  return comment.author_id === profile.id
}
