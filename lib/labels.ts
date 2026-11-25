// Libellés en français et classes Tailwind (tokens de globals.css)
// pour les valeurs texte stockées en base.

export const FEATURE_STATUSES = ["backlog", "todo", "in_progress", "done", "cancelled"] as const
export const PRIORITIES = ["critical", "high", "medium", "low", "nice_to_have"] as const
export const EFFORTS = ["xs", "s", "m", "l", "xl"] as const
export const IMPACTS = ["low", "medium", "high"] as const
export const SPRINT_STATUSES = ["planned", "active", "completed"] as const

export type FeatureStatus = (typeof FEATURE_STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]

// dot = pastille, badge = fond + texte du badge
export const STATUS_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  backlog: { label: "Backlog", dot: "bg-status-backlog", badge: "bg-status-backlog-bg text-status-backlog-fg" },
  todo: { label: "À faire", dot: "bg-status-todo", badge: "bg-status-todo-bg text-status-todo-fg" },
  in_progress: { label: "En cours", dot: "bg-status-progress", badge: "bg-status-progress-bg text-status-progress-fg" },
  done: { label: "Terminé", dot: "bg-status-done", badge: "bg-status-done-bg text-status-done-fg" },
  cancelled: { label: "Annulé", dot: "bg-status-cancelled", badge: "bg-status-cancelled-bg text-status-cancelled-fg line-through" },
}

export const SPRINT_STATUS_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  planned: { label: "Planifié", dot: "bg-status-todo", badge: "bg-status-todo-bg text-status-todo-fg" },
  active: { label: "Actif", dot: "bg-sprint-active", badge: "bg-sprint-active-bg text-sprint-active-fg" },
  completed: { label: "Terminé", dot: "bg-status-done", badge: "bg-status-done-bg text-status-done-fg" },
}

// bars = nombre de barres pleines dans l'icône de priorité
export const PRIORITY_STYLES: Record<string, { label: string; color: string; bars: number }> = {
  critical: { label: "Critique", color: "bg-prio-critical", bars: 3 },
  high: { label: "Haute", color: "bg-prio-high", bars: 3 },
  medium: { label: "Moyenne", color: "bg-prio-medium", bars: 2 },
  low: { label: "Basse", color: "bg-prio-low", bars: 1 },
  nice_to_have: { label: "Bonus", color: "bg-prio-bonus", bars: 0 },
}

export const EFFORT_LABELS: Record<string, string> = { xs: "XS", s: "S", m: "M", l: "L", xl: "XL" }
export const IMPACT_LABELS: Record<string, string> = { low: "Faible", medium: "Moyen", high: "Fort" }

// Trie des features de la plus prioritaire à la moins prioritaire.
export function byPriority<T extends { priority: string }>(a: T, b: T) {
  return PRIORITIES.indexOf(a.priority as Priority) - PRIORITIES.indexOf(b.priority as Priority)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

export function fullName(p: { firstname: string | null; lastname: string | null; email?: string } | null) {
  if (!p) return "Non assigné"
  const name = [p.firstname, p.lastname].filter(Boolean).join(" ")
  return name || p.email || "Utilisateur"
}

export function initials(p: { firstname: string | null; lastname: string | null } | null) {
  if (!p) return "–"
  return ((p.firstname?.[0] ?? "") + (p.lastname?.[0] ?? "")).toUpperCase() || "?"
}

export const ROLE_LABELS: Record<string, string> = { admin: "Administrateur", user: "Membre" }
