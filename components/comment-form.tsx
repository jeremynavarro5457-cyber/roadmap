// Composant client : formulaire interactif (saisie, validation, état d'envoi).
"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { commentSchema, type CommentInput } from "@/lib/schemas"
import { addComment } from "@/app/actions"

// Tant que la connexion n'est pas en place, on choisit l'auteur dans la liste.
export function CommentForm({ featureId, people }: { featureId: number; people: { id: string; name: string }[] }) {
  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "", author_id: "" },
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: CommentInput) {
    const result = await addComment(featureId, values)
    if (result.error) form.setError("root", { message: result.error })
    else form.reset({ content: "", author_id: values.author_id })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 grid gap-2 border-t pt-3">
      <label htmlFor="comment" className="sr-only">Nouveau commentaire</label>
      <Textarea id="comment" placeholder="Écrire un commentaire…" aria-invalid={!!errors.content} {...form.register("content")} />
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Controller
          control={form.control}
          name="author_id"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-48" aria-label="Auteur" aria-invalid={!!errors.author_id}><SelectValue placeholder="Commenter en tant que…" /></SelectTrigger>
              <SelectContent>{people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Envoi…" : "Commenter"}</Button>
      </div>
      {errors.author_id && <p className="text-right text-xs text-destructive">{errors.author_id.message}</p>}
      {errors.root && <p className="text-xs text-destructive">{errors.root.message}</p>}
    </form>
  )
}
