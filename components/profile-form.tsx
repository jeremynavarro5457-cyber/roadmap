// Composant client : formulaire avec validation en direct et message de confirmation.
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/form-field"
import { profileSchema, type ProfileInput } from "@/lib/schemas"
import { updateProfile } from "@/app/actions"

// Le rôle n'apparaît PAS dans ce formulaire : il est affiché en texte simple par la page.
export function ProfileForm({ defaultValues }: { defaultValues: ProfileInput }) {
  const form = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues })
  const { errors, isSubmitting, isSubmitSuccessful } = form.formState

  async function onSubmit(values: ProfileInput) {
    const result = await updateProfile(values)
    if (result.error) form.setError("root", { message: result.error })
    else form.reset(values) // remet le formulaire à l'état « enregistré »
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="firstname" label="Prénom" error={errors.firstname?.message}>
          <Input id="firstname" autoComplete="given-name" {...form.register("firstname")} />
        </FormField>
        <FormField id="lastname" label="Nom" error={errors.lastname?.message}>
          <Input id="lastname" autoComplete="family-name" {...form.register("lastname")} />
        </FormField>
      </div>
      {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
      {isSubmitSuccessful && !errors.root && <p role="status" className="text-sm text-status-done-fg">Profil enregistré.</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  )
}
