"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { loginSchema, type LoginInput } from "@/lib/schemas"

// Connexion email + mot de passe.
// Supabase renvoie un access_token et un refresh_token, que @supabase/ssr
// range dans un cookie "sb-<projet>-auth-token".
export async function signIn(input: LoginInput) {
  const values = loginSchema.parse(input)
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(values)
  if (error) return { error: "Email ou mot de passe incorrect." }
  revalidatePath("/", "layout")
  redirect("/")
}
