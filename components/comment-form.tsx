// Composant client : formulaire interactif (saisie, validation, état d'envoi).
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { commentSchema, type CommentInput } from "@/lib/schemas"
import { addComment } from "@/app/actions"

// Le commentaire est signé par l'utilisateur connecté (voir addComment).
export function CommentForm({ featureId }: { featureId: number }) {
  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: CommentInput) {
    const result = await addComment(featureId, values)
    if (result.error) form.setError("root", { message: result.error })
    else form.reset({ content: "" })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 grid gap-2 border-t pt-3">
      <label htmlFor="comment" className="sr-only">Nouveau commentaire</label>
      <Textarea id="comment" placeholder="Écrire un commentaire…" aria-invalid={!!errors.content} {...form.register("content")} />
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Envoi…" : "Commenter"}</Button>
      </div>
      {errors.root && <p className="text-xs text-destructive">{errors.root.message}</p>}
    </form>
  )
}
