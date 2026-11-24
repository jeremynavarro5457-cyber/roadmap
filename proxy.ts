import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

// Proxy (anciennement "middleware") : s'exécute avant chaque page.
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  // Toutes les routes sauf les fichiers statiques et images
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
