// Composant client : il réagit aux choix de l'utilisateur et met à jour l'URL (router.replace).
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { List, LayoutGrid, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PRIORITIES, PRIORITY_STYLES, FEATURE_STATUSES, STATUS_STYLES } from "@/lib/labels"

type Filter = "q" | "module" | "status" | "priority" | "nosprint"
const ALL = "all" // Radix Select n'accepte pas "" comme valeur : on utilise "all"

export function FilterBar({
  modules,
  filters,
  view,
  showView = false,
  count,
}: {
  modules: { id: number; name: string }[]
  filters: Filter[]
  view?: "list" | "board"
  showView?: boolean
  count?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  // Change un paramètre de l'URL ; le Server Component se recharge avec les nouveaux filtres
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value && value !== ALL) next.set(key, value)
    else next.delete(key)
    router.replace(`${pathname}?${next.toString()}`)
  }

  function filterSelect({ name, placeholder, options }: { name: string; placeholder: string; options: { value: string; label: string }[] }) {
    return (
      <Select value={params.get(name) ?? ALL} onValueChange={(v) => setParam(name, v)}>
        <SelectTrigger className="w-44 bg-card" aria-label={placeholder}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {showView && (
        <div className="inline-flex overflow-hidden rounded-md border border-input" role="group" aria-label="Affichage">
          <Button variant="ghost" className="rounded-none aria-pressed:bg-accent aria-pressed:text-accent-foreground" aria-pressed={view === "list"} onClick={() => setParam("view", "")}><List /> Liste</Button>
          <Button variant="ghost" className="rounded-none aria-pressed:bg-accent aria-pressed:text-accent-foreground" aria-pressed={view === "board"} onClick={() => setParam("view", "board")}><LayoutGrid /> Tableau</Button>
        </div>
      )}
      {filters.includes("q") && (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <Input
            className="w-60 bg-card pl-8"
            placeholder="Rechercher une feature…"
            aria-label="Rechercher une feature"
            defaultValue={params.get("q") ?? ""}
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>
      )}
      {filters.includes("module") && (
        filterSelect({ name: "module", placeholder: "Tous les modules", options: modules.map((m) => ({ value: String(m.id), label: m.name })) })
      )}
      {filters.includes("status") && (
        filterSelect({ name: "status", placeholder: "Tous les statuts", options: FEATURE_STATUSES.map((s) => ({ value: s, label: STATUS_STYLES[s].label })) })
      )}
      {filters.includes("priority") && (
        filterSelect({ name: "priority", placeholder: "Toutes priorités", options: PRIORITIES.map((p) => ({ value: p, label: PRIORITY_STYLES[p].label })) })
      )}
      {filters.includes("nosprint") && (
        <Button
          variant={params.get("nosprint") === "1" ? "default" : "outline"}
          aria-pressed={params.get("nosprint") === "1"}
          onClick={() => setParam("nosprint", params.get("nosprint") === "1" ? "" : "1")}
        >
          Sans sprint
        </Button>
      )}
      {count !== undefined && <span className="text-xs text-subtle">{count} résultat{count > 1 ? "s" : ""}</span>}
    </div>
  )
}
