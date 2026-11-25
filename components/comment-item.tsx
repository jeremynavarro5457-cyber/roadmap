// Composant client : il bascule entre l'affichage du commentaire et son édition (état local).
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/badges"
import { commentSchema, type CommentInput } from "@/lib/schemas"
import { formatDate } from "@/lib/labels"
import { updateComment } from "@/app/actions"

type Props = {
  featureId: number
  comment: { id: number; content: string; created_at: string }
  author: { firstname: string | null; lastname: string | null; avatar_url: string | null } | null
  authorName: string
  // Calculé côté serveur (canEditComment) : seul l'auteur voit le bouton « Modifier »
  canEdit: boolean
}

export function CommentItem({ featureId, comment, author, authorName, canEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: comment.content },
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: CommentInput) {
    const result = await updateComment(featureId, comment.id, values)
    if (result.error) form.setError("root", { message: result.error })
    else setEditing(false)
  }

  return (
    <li className="flex gap-2.5 border-t py-3.5 first:border-t-0">
      <Avatar person={author} />
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-medium">{authorName}</span>
          <span className="text-xs text-subtle">· {formatDate(comment.created_at)}</span>
          {canEdit && !editing && (
            <Button variant="ghost" size="xs" className="ml-auto" onClick={() => setEditing(true)} aria-label="Modifier mon commentaire">
              <Pencil /> Modifier
            </Button>
          )}
        </div>

        {editing ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-1 grid gap-2">
            <label htmlFor={`comment-${comment.id}`} className="sr-only">Modifier le commentaire</label>
            <Textarea id={`comment-${comment.id}`} aria-invalid={!!errors.content} {...form.register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            {errors.root && <p role="alert" className="text-xs text-destructive">{errors.root.message}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => { form.reset(); setEditing(false) }}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enregistrement…" : "Enregistrer"}</Button>
            </div>
          </form>
        ) : (
          <p className="mt-0.5">{comment.content}</p>
        )}
      </div>
    </li>
  )
}
