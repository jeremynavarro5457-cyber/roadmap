// Composant client : il utilise le client Supabase du navigateur.
// Ce client rafraîchit automatiquement l'access_token juste avant son expiration :
// c'est la requête /auth/v1/token?grant_type=refresh_token visible dans l'onglet Network.
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function UserMenu() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Lit la session depuis le cookie et écoute ses changements (refresh, déconnexion)
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 border-t px-2 pt-3">
      <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={email ?? ""}>{email}</span>
      <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Se déconnecter" title="Se déconnecter">
        <LogOut />
      </Button>
    </div>
  )
}
