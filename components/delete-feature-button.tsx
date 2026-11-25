// Composant client : il garde en mémoire l'étape (bouton / confirmation) et l'éventuelle erreur.
"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteFeature } from "@/app/actions"

// Suppression en deux temps : on demande confirmation avant de supprimer pour de bon.
export function DeleteFeatureButton({ featureId }: { featureId: number }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onDelete() {
    startTransition(async () => {
      // En cas de succès, l'action redirige vers le backlog ; sinon elle renvoie une erreur
      const result = await deleteFeature(featureId)
      if (result?.error) {
        setError(result.error)
        setConfirming(false)
      }
    })
  }

  if (!confirming) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button variant="destructive" onClick={() => setConfirming(true)}><Trash2 /> Supprimer</Button>
        {error && <p role="alert" className="max-w-64 text-right text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2" role="alertdialog" aria-label="Confirmer la suppression">
      <span className="text-sm text-muted-foreground">Supprimer définitivement ?</span>
      <Button variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>Annuler</Button>
      <Button variant="destructive" onClick={onDelete} disabled={pending}>{pending ? "Suppression…" : "Oui, supprimer"}</Button>
    </div>
  )
}
