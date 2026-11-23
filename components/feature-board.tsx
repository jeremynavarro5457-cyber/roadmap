import Link from "next/link"
import { StatusBadge, PriorityBadge, ModuleDot, Avatar, CommentCount } from "@/components/badges"
import { commentCount, type FeatureWithRelations } from "@/lib/data"

const COLUMNS = ["todo", "in_progress", "done"]

// Vue tableau (kanban en lecture) : une colonne par statut.
export function FeatureBoard({ features }: { features: FeatureWithRelations[] }) {
  return (
    <div className="grid gap-4 overflow-x-auto md:grid-cols-3">
      {COLUMNS.map((status) => {
        const items = features.filter((f) => f.status === status)
        return (
          <section key={status} aria-label={status}>
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-xs text-subtle">{items.length}</span>
            </div>
            <div className="flex min-h-30 flex-col gap-2 rounded-lg bg-secondary p-2">
              {items.map((f) => (
                <Link key={f.id} href={`/features/${f.id}`} className="rounded-lg border bg-card p-3 shadow-xs hover:border-input">
                  <p className="mb-2.5 font-medium">{f.title}</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <PriorityBadge priority={f.priority} />
                    <ModuleDot module={f.module} />
                    <span className="ml-auto flex items-center gap-2">
                      <CommentCount count={commentCount(f)} />
                      <Avatar person={f.assignee} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
