import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { StatusBadge, PriorityBadge, ModuleDot, Avatar, CommentCount } from "@/components/badges"
import { EFFORT_LABELS } from "@/lib/labels"
import { commentCount, type FeatureListItem } from "@/lib/data"

// Liste de features en lignes cliquables. showSprint ajoute la colonne Sprint (utile dans le backlog).
export function FeatureList({ features, showSprint = false }: { features: FeatureListItem[]; showSprint?: boolean }) {
  const cols = showSprint
    ? "md:grid-cols-[minmax(180px,1fr)_80px_100px_100px_140px_50px_110px_32px_16px]"
    : "md:grid-cols-[minmax(180px,1fr)_100px_100px_140px_50px_110px_32px_16px]"
  const row = `grid grid-cols-[1fr_auto] items-center gap-3 px-4 ${cols}`
  const hm = "hidden md:block"

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className={`${row} h-9 bg-sidebar font-mono text-xs font-medium tracking-wide text-subtle uppercase`}>
        <span>Feature</span>
        {showSprint && <span className={hm}>Sprint</span>}
        <span>Statut</span>
        <span className={hm}>Priorité</span>
        <span className={hm}>Module</span>
        <span className={hm}>Effort</span>
        <span className={hm}>Commentaires</span>
        <span className={hm} />
        <span className={hm} />
      </div>
      {features.length === 0 && <p className="p-4 text-center text-sm text-subtle">Aucune feature.</p>}
      <ul>
        {features.map((f) => (
          <li key={f.id} className="border-t">
            <Link href={`/features/${f.id}`} className={`${row} min-h-11 py-1.5 hover:bg-secondary`}>
              <span className="truncate font-medium">{f.title}</span>
              {showSprint && <span className={`${hm} font-mono text-xs text-subtle`}>{f.sprint_id ? `Sprint ${f.sprint_id}` : "—"}</span>}
              <span><StatusBadge status={f.status} /></span>
              <span className={hm}><PriorityBadge priority={f.priority} /></span>
              <span className={hm}><ModuleDot module={f.module} /></span>
              <span className={`${hm} font-mono text-xs text-subtle`}>{f.effort ? EFFORT_LABELS[f.effort] : ""}</span>
              <span className={hm}><CommentCount count={commentCount(f)} /></span>
              <span className={hm}><Avatar person={f.assignee} /></span>
              <ChevronRight className={`${hm} size-4 text-subtle`} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
