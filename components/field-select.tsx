// Composant client : il enregistre immédiatement le changement (onValueChange → Server Action).
"use client"

import { useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateFeatureField } from "@/app/actions"

const NONE = "none" // valeur technique pour « aucun » (Radix refuse "")

export function FieldSelect({
  featureId,
  field,
  value,
  label,
  options,
  emptyLabel,
}: {
  featureId: number
  field: "status" | "priority" | "sprint_id" | "assigned_to"
  value: string
  label: string
  options: { value: string; label: string }[]
  emptyLabel?: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Select
      defaultValue={value || NONE}
      disabled={pending}
      onValueChange={(v) => startTransition(async () => { await updateFeatureField(featureId, field, v === NONE ? "" : v) })}
    >
      <SelectTrigger className="w-full" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>
        {emptyLabel && <SelectItem value={NONE}>{emptyLabel}</SelectItem>}
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}
