// Composant client : formulaire avec validation en direct (react-hook-form + zod).
"use client"

import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/components/form-field"
import { featureSchema, type FeatureInput } from "@/lib/schemas"
import { saveFeature } from "@/app/actions"

type Option = { value: string; label: string }
const NONE = "none" // valeur technique pour « aucun » (Radix refuse "")

export function FeatureForm({ id, defaultValues, backHref, options }: {
  id: number | null
  defaultValues: FeatureInput
  backHref: string
  options: Record<"status" | "priority" | "effort" | "impact" | "module_id" | "sprint_id" | "assigned_to", Option[]>
}) {
  const form = useForm<FeatureInput>({ resolver: zodResolver(featureSchema), defaultValues })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: FeatureInput) {
    // En cas de succès, l'action redirige vers la feature ; sinon elle renvoie une erreur
    const result = await saveFeature(id, values)
    if (result?.error) form.setError("root", { message: result.error })
  }

  // Fonction (et non composant) : on l'appelle directement pour éviter de recréer un composant à chaque rendu.
  // Un select relié au formulaire. emptyLabel ajoute un choix « aucun ».
  function selectField({ name, label, emptyLabel }: { name: keyof typeof options; label: string; emptyLabel?: string }) {
    return (
      <FormField id={name} label={label}>
        <Controller
          control={form.control}
          name={name}
          render={({ field }) => (
            <Select value={field.value || NONE} onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
              <SelectTrigger id={name} className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {emptyLabel && <SelectItem value={NONE}>{emptyLabel}</SelectItem>}
                {options[name].map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    )
  }

  return (
    <Card className="max-w-2xl p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField id="title" label="Titre" required error={errors.title?.message}>
          <Input id="title" placeholder="Ex. Export CSV des factures" aria-invalid={!!errors.title} {...form.register("title")} />
        </FormField>
        <FormField id="description" label="Description">
          <Textarea id="description" placeholder="Quel problème cette feature résout-elle ?" {...form.register("description")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          {selectField({ name: "module_id", label: "Module", emptyLabel: "Aucun module" })}
          {selectField({ name: "sprint_id", label: "Sprint", emptyLabel: "Aucun (backlog)" })}
          {selectField({ name: "status", label: "Statut" })}
          {selectField({ name: "priority", label: "Priorité" })}
          {selectField({ name: "effort", label: "Effort", emptyLabel: "Non estimé" })}
          {selectField({ name: "impact", label: "Impact" })}
          {selectField({ name: "assigned_to", label: "Assigné à", emptyLabel: "Non assigné" })}
        </div>
        {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild><Link href={backHref}>Annuler</Link></Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enregistrement…" : "Enregistrer"}</Button>
        </div>
      </form>
    </Card>
  )
}
