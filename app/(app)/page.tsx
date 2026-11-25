import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { FeatureList } from "@/components/feature-list"
import { StatusBadge, SprintStatusBadge, Avatar, ProgressBar } from "@/components/badges"
import { createClient } from "@/lib/supabase/server"
import { getFeatures, getSprints } from "@/lib/data"
import { getSprintSummary, progressFromSummary } from "@/lib/rpc"
import { getCurrentProfile } from "@/lib/auth"
import { canCreateFeature } from "@/lib/permissions"
import { byPriority, formatDate, fullName } from "@/lib/labels"

// Tableau de bord : sprint actif, ce qui est en cours, derniers commentaires.
export default async function HomePage() {
  const supabase = await createClient()
  const [sprints, features, me, { data: comments }] = await Promise.all([
    getSprints(),
    getFeatures(),
    getCurrentProfile(),
    supabase
      .from("comments")
      .select("id, content, created_at, feature:features(id, title), author:profiles(firstname, lastname, avatar_url)")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(5),
  ])

  const active = sprints.find((s) => s.status === "active")
  // Résumé du sprint actif calculé par une fonction Postgres
  const summary = active ? await getSprintSummary(active.id) : null
  const inProgress = features.filter((f) => f.status === "in_progress").sort(byPriority)

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Où en est l'équipe aujourd'hui."
        actions={canCreateFeature(me) && <Button asChild><Link href="/features/new"><Plus /> Nouvelle feature</Link></Button>}
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="grid content-start gap-6">
          {active && summary ? (
            <Link href={`/sprints/${active.id}`} className="block">
              <Card className="gap-0 p-4 hover:border-input">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-subtle uppercase">Sprint actif</span>
                  <SprintStatusBadge status={active.status} />
                </div>
                <h2 className="text-base font-semibold">Sprint {active.id} · {active.goal}</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {formatDate(active.start_date)} → {formatDate(active.end_date)} · {summary.total_features} features
                </p>
                <div className="mb-4 flex gap-8">
                  {["todo", "in_progress", "done"].map((s) => (
                    <div key={s}>
                      <div className="text-[1.375rem] leading-7 font-semibold">{summary.by_status[s] ?? 0}</div>
                      <StatusBadge status={s} />
                    </div>
                  ))}
                </div>
                <ProgressBar value={progressFromSummary(summary)} />
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-subtle">{progressFromSummary(summary)} % terminé</span>
                  <span className="flex items-center gap-1 font-medium text-primary">Voir les features du sprint <ArrowRight className="size-3" /></span>
                </div>
              </Card>
            </Link>
          ) : (
            <Card className="p-4 text-sm text-muted-foreground">Aucun sprint actif.</Card>
          )}
          <section>
            <h2 className="mb-3 text-base font-semibold">Features en cours</h2>
            <FeatureList features={inProgress} />
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-base font-semibold">Derniers commentaires</h2>
          <Card className="gap-0 px-4 py-1">
            {(comments ?? []).map((c) => (
              <Link key={c.id} href={`/features/${c.feature?.id}`} className="flex gap-2.5 border-t py-3 first:border-t-0">
                <Avatar person={c.author} />
                <div className="text-sm">
                  <span className="font-medium">{fullName(c.author)}</span> <span className="text-subtle">sur</span>{" "}
                  <span className="font-medium text-primary">{c.feature?.title}</span>
                  <p className="mt-0.5 line-clamp-2 text-muted-foreground">{c.content}</p>
                </div>
              </Link>
            ))}
          </Card>
        </section>
      </div>
    </>
  )
}
