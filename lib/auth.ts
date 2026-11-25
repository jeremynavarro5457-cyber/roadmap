import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/database.types"

// Profil de l'utilisateur connecté (avec son rôle), ou null si personne n'est connecté.
// cache() : plusieurs composants peuvent l'appeler pendant le même rendu,
// la base n'est interrogée qu'une seule fois.
export const getCurrentProfile = cache(async (): Promise<Tables<"profiles"> | null> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  return data
})
