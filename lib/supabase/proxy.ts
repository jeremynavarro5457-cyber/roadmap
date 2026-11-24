import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "./database.types"

// Appelé par proxy.ts avant chaque page.
// 1. Rafraîchit la session : si l'access_token a expiré, Supabase utilise le
//    refresh_token pour en obtenir un nouveau, et on réécrit les cookies.
// 2. Redirige vers /login si personne n'est connecté.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Les nouveaux cookies doivent aller à la fois dans la requête
          // (pour les Server Components) et dans la réponse (pour le navigateur).
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // getUser() vérifie le token auprès de Supabase (et déclenche le refresh si besoin).
  // Ne rien mettre entre createServerClient et getUser.
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname.startsWith("/login")
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}
