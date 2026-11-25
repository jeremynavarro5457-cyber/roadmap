import Link from "next/link"
import { notFound } from "next/navigation"
import { MessageSquare, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, PriorityBadge, ModuleDot, CommentCount } from "@/components/badges"
import { FieldSelect } from "@/components/field-select"
import { CommentForm } from "@/components/comment-form"
import { CommentItem } from "@/components/comment-item"
import { DeleteFeatureButton } from "@/components/delete-feature-button"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/lib/auth"
import { canEditFeature, canEditComment } from "@/lib/permissions"
import { getProfiles, getSprints } from "@/lib/data"
import {
  FEATURE_STATUSES, STATUS_STYLES, PRIORITIES, PRIORITY_STYLES, SPRINT_STATUS_STYLES,
  EFFORT_LABELS, IMPACT_LABELS, formatDate, fullName,
} from "@/lib/labels"

export default async function FeaturePage({ params }: PageProps<"/features/[id]">) {
  const { id } = await params
  const supabase = await createClient()
  const { data: feature } = await supabase
    .from("features")
    .select("*, module:modules(name, color), comments(id, content, created_at, author_id, author:profiles(firstname, lastname, avatar_url))")
    .eq("id", Number(id))
    .order("created_at", { referencedTable: "comments" })
    .order("id", { referencedTable: "comments" })
    .maybeSingle()
  if (!feature) notFound()

  const [sprints, profiles, me] = await Promise.all([getSprints(), getProfiles(), getCurrentProfile()])
  // Admin ou responsable assigné : peut modifier / supprimer cette feature
  const canEdit = canEditFeature(me, feature)
  const comments = feature.comments
  const people = profiles.filter((p) => p.firstname || p.lastname)

  // Le fil d'Ariane ramène au sprint si la feature en a un, sinon au backlog
  const crumbs = feature.sprint_id
    ? [{ href: "/sprints", label: "Sprints" }, { href: `/sprints/${feature.sprint_id}`, label: `Sprint ${feature.sprint_id}` }]
    : [{ href: "/backlog", label: "Backlog" }]

  return (
    <>
      <PageHeader
        crumbs={[...crumbs, { label: feature.title }]}
        title={feature.title}
        actions={
          <>
            {/* Retour test utilisateur : accès direct aux commentaires depuis le haut de la page */}
            <Button variant="outline" asChild>
              <a href="#commentaires"><MessageSquare /> {comments.length} commentaire{comments.length > 1 ? "s" : ""}</a>
            </Button>
            {canEdit && (
              <>
                <Button variant="outline" asChild><Link href={`/features/${feature.id}/edit`}><Pencil /> Modifier</Link></Button>
                <DeleteFeatureButton featureId={feature.id} />
              </>
            )}
          </>
        }
      >
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <StatusBadge status={feature.status} />
          <PriorityBadge priority={feature.priority} />
          <ModuleDot module={feature.module} />
        </div>
      </PageHeader>

      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6">
          <Card className="gap-3 p-4">
            <h2 className="text-base font-semibold">Description</h2>
            <p className="text-sm text-muted-foreground">{feature.description || "Pas de description."}</p>
          </Card>

          <Card id="commentaires" className="scroll-mt-6 gap-0 border-sprint-active-bg p-4">
            <h2 className="mb-2 flex items-center gap-2 text-base font-semibold">
              <MessageSquare className="size-4" aria-hidden /> Commentaires <CommentCount count={comments.length} />
            </h2>
            {comments.length === 0 && <p className="py-2 text-sm text-subtle">Aucun commentaire pour l&apos;instant. Lancez la discussion !</p>}
            <ul>
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  featureId={feature.id}
                  comment={c}
                  author={c.author}
                  authorName={fullName(c.author)}
                  canEdit={canEditComment(me, c)}
                />
              ))}
            </ul>
            <CommentForm featureId={feature.id} />
          </Card>
        </div>

        <Card className="gap-3 p-4">
          <h2 className="text-base font-semibold">Détails</h2>
          <dl className="grid grid-cols-[100px_1fr] items-center gap-x-2 gap-y-3 text-sm">
            {canEdit ? (
              <>
                <dt className="text-xs font-medium text-subtle">Statut</dt>
                <dd><FieldSelect featureId={feature.id} field="status" value={feature.status} label="Statut"
                  options={FEATURE_STATUSES.map((s) => ({ value: s, label: STATUS_STYLES[s].label }))} /></dd>
                <dt className="text-xs font-medium text-subtle">Priorité</dt>
                <dd><FieldSelect featureId={feature.id} field="priority" value={feature.priority} label="Priorité"
                  options={PRIORITIES.map((p) => ({ value: p, label: PRIORITY_STYLES[p].label }))} /></dd>
                <dt className="text-xs font-medium text-subtle">Sprint</dt>
                <dd><FieldSelect featureId={feature.id} field="sprint_id" value={feature.sprint_id ? String(feature.sprint_id) : ""} label="Sprint" emptyLabel="Aucun (backlog)"
                  options={sprints.map((s) => ({ value: String(s.id), label: `Sprint ${s.id} · ${SPRINT_STATUS_STYLES[s.status].label}` }))} /></dd>
                <dt className="text-xs font-medium text-subtle">Assigné à</dt>
                <dd><FieldSelect featureId={feature.id} field="assigned_to" value={feature.assigned_to ?? ""} label="Assigné à" emptyLabel="Non assigné"
                  options={people.map((p) => ({ value: p.id, label: fullName(p) }))} /></dd>
              </>
            ) : (
              // Pas de droit de modification : on affiche les valeurs en lecture seule
              <>
                <dt className="text-xs font-medium text-subtle">Statut</dt>
                <dd><StatusBadge status={feature.status} /></dd>
                <dt className="text-xs font-medium text-subtle">Priorité</dt>
                <dd><PriorityBadge priority={feature.priority} /></dd>
                <dt className="text-xs font-medium text-subtle">Sprint</dt>
                <dd>{feature.sprint_id ? `Sprint ${feature.sprint_id}` : "Aucun (backlog)"}</dd>
                <dt className="text-xs font-medium text-subtle">Assigné à</dt>
                <dd>{fullName(profiles.find((p) => p.id === feature.assigned_to) ?? null)}</dd>
              </>
            )}
            <dt className="text-xs font-medium text-subtle">Module</dt><dd><ModuleDot module={feature.module} /></dd>
            <dt className="text-xs font-medium text-subtle">Effort</dt><dd>{feature.effort ? EFFORT_LABELS[feature.effort] : "—"}</dd>
            <dt className="text-xs font-medium text-subtle">Impact</dt><dd>{IMPACT_LABELS[feature.impact]}</dd>
            <dt className="text-xs font-medium text-subtle">Créée le</dt><dd className="text-subtle">{formatDate(feature.created_at)}</dd>
            {feature.updated_at && <><dt className="text-xs font-medium text-subtle">Mise à jour</dt><dd className="text-subtle">{formatDate(feature.updated_at)}</dd></>}
          </dl>
        </Card>
      </div>
    </>
  )
}
