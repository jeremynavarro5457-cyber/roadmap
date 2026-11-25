// Composant client : il lit le fichier choisi dans le navigateur et l'envoie directement
// dans Supabase Storage (le fichier ne transite pas par notre serveur).
"use client"

import { useState } from "react"
import { Avatar } from "@/components/badges"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { saveAvatarUrl } from "@/app/actions"

// Mêmes limites que le bucket (voir supabase/migrations/20261125000000_avatars_bucket.sql)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 2 * 1024 * 1024 // 2 Mo

type Props = {
  userId: string
  person: { firstname: string | null; lastname: string | null; avatar_url: string | null }
}

export function AvatarUpload({ userId, person }: Props) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return
    setMessage(null)

    // Vérifications côté navigateur : message clair avant même d'envoyer
    if (!ALLOWED_TYPES.includes(file.type)) {
      return setMessage({ text: "Format non accepté : choisissez une image JPEG, PNG ou WebP.", ok: false })
    }
    if (file.size > MAX_SIZE) {
      return setMessage({ text: "Image trop lourde : 2 Mo maximum.", ok: false })
    }

    setUploading(true)
    const supabase = createClient()
    // Chemin = <id utilisateur>/avatar : la policy Storage n'autorise que son propre dossier.
    // upsert : un nouvel envoi remplace l'ancienne photo au lieu d'en ajouter une autre.
    const path = `${userId}/avatar`
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" })

    if (uploadError) {
      setUploading(false)
      return setMessage({ text: "Envoi impossible : " + uploadError.message, ok: false })
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    // ?v=... change l'adresse à chaque envoi : sans ça, le navigateur garderait l'ancienne photo en cache
    const result = await saveAvatarUrl(`${data.publicUrl}?v=${Date.now()}`)

    setUploading(false)
    input.value = "" // permet de re-choisir le même fichier plus tard
    setMessage(result.error ? { text: result.error, ok: false } : { text: "Photo enregistrée.", ok: true })
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar person={person} size="lg" />
      <div className="grid gap-1.5">
        <Label htmlFor="avatar" className="text-xs font-medium text-muted-foreground">Photo de profil</Label>
        <Input
          id="avatar"
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={onFileChange}
          disabled={uploading}
          className="max-w-72 cursor-pointer"
        />
        <p className="text-xs text-subtle">JPEG, PNG ou WebP · 2 Mo maximum</p>
        {uploading && <p role="status" className="text-xs text-muted-foreground">Envoi en cours…</p>}
        {message && (
          <p role={message.ok ? "status" : "alert"} className={message.ok ? "text-xs text-status-done-fg" : "text-xs text-destructive"}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}
