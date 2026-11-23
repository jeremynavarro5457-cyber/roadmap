// Composant client : formulaire avec validation en direct (react-hook-form + zod).
"use client"

import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/components/form-field"
import { sprintSchema, type SprintInput } from "@/lib/schemas"
import { SPRINT_STATUSES, SPRINT_STATUS_STYLES } from "@/lib/labels"
import { saveSprint } from "@/app/actions"

export function SprintForm() {
  const form = useForm<SprintInput>({
    resolver: zodResolver(sprintSchema),
    defaultValues: { goal: "", start_date: "", end_date: "", status: "planned" },
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: SprintInput) {
    const result = await saveSprint(values)
    if (result?.error) form.setError("root", { message: result.error })
  }

  return (
    <Card className="max-w-lg p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField id="goal" label="Objectif">
          <Input id="goal" placeholder="Ex. Lancer l'onboarding V2" {...form.register("goal")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="start_date" label="Début" required error={errors.start_date?.message}>
            <Input id="start_date" type="date" aria-invalid={!!errors.start_date} {...form.register("start_date")} />
          </FormField>
          <FormField id="end_date" label="Fin" required error={errors.end_date?.message}>
            <Input id="end_date" type="date" aria-invalid={!!errors.end_date} {...form.register("end_date")} />
          </FormField>
        </div>
        <FormField id="status" label="Statut">
          <Controller control={form.control} name="status" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPRINT_STATUSES.map((s) => <SelectItem key={s} value={s}>{SPRINT_STATUS_STYLES[s].label}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </FormField>
        {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild><Link href="/sprints">Annuler</Link></Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enregistrement…" : "Créer le sprint"}</Button>
        </div>
      </form>
    </Card>
  )
}
