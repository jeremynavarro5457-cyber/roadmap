// Composant client : formulaire interactif (saisie, validation, message d'erreur).
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/form-field"
import { loginSchema, type LoginInput } from "@/lib/schemas"
import { signIn } from "@/app/auth-actions"

export function LoginForm() {
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: LoginInput) {
    // En cas de succès, l'action redirige vers le tableau de bord
    const result = await signIn(values)
    if (result?.error) form.setError("root", { message: result.error })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
      </FormField>
      <FormField id="password" label="Mot de passe" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...form.register("password")} />
      </FormField>
      {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Connexion…" : "Se connecter"}</Button>
    </form>
  )
}
