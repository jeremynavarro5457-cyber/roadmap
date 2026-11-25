// Composant client : il utilise le client Supabase du navigateur.
// Ce client rafraîchit automatiquement l'access_token juste avant son expiration :
// c'est la requête /auth/v1/token?grant_type=refresh_token visible dans l'onglet Network.
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/badges"
import { createClient } from "@/lib/supabase/client"

// person : profil de l'utilisateur connecté, chargé côté serveur par le layout
export function UserMenu({ person }: { person: { firstname: string | null; lastname: string | null; avatar_url: string | null } }) {
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
      {/* L'email mène à la page profil */}
      <Link href="/profile" className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-1 text-xs text-muted-foreground hover:text-primary" title="Mon profil">
        <Avatar person={person} />
        <span className="truncate">{email ?? "Mon profil"}</span>
      </Link>
      <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Se déconnecter" title="Se déconnecter">
        <LogOut />
      </Button>
    </div>
  )
}
