// Composant client : il gère la confirmation en deux temps et affiche le résultat de l'action.
"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { movePendingToNextSprint } from "@/app/actions"

type Result = { ok: boolean; text: string; sprintId?: number }

export function MovePendingButton({ sprintId }: { sprintId: number }) {
  const [confirming, setConfirming] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [pending, startTransition] = useTransition()

  function onConfirm() {
    startTransition(async () => {
      const res = await movePendingToNextSprint(sprintId)
      setConfirming(false)
      if (res.error) return setResult({ ok: false, text: res.error })
      const n = res.moved ?? 0
      setResult({
        ok: true,
        text: n === 0 ? "Aucune feature à déplacer." : `${n} feature${n > 1 ? "s" : ""} déplacée${n > 1 ? "s" : ""} vers le sprint ${res.destinationSprintId}.`,
        sprintId: n === 0 ? undefined : res.destinationSprintId,
      })
    })
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2" role="alertdialog" aria-label="Confirmer le report des features">
        <span className="max-w-72 text-sm text-muted-foreground">
          Les features non terminées passent au sprint suivant, avec le statut « À faire ».
        </span>
        <Button variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>Annuler</Button>
        <Button onClick={onConfirm} disabled={pending}>{pending ? "Déplacement…" : "Confirmer"}</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" onClick={() => { setResult(null); setConfirming(true) }}>
        <ArrowRightLeft /> Reporter au sprint suivant
      </Button>
      {result && (
        <p role={result.ok ? "status" : "alert"} className={result.ok ? "text-xs text-status-done-fg" : "max-w-64 text-right text-xs text-destructive"}>
          {result.text}{" "}
          {result.sprintId && <Link href={`/sprints/${result.sprintId}`} className="underline">Voir le sprint</Link>}
        </p>
      )}
    </div>
  )
}
