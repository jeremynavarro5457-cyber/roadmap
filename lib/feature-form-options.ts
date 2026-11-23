import { getModules, getProfiles, getSprints } from "@/lib/data"
import {
  FEATURE_STATUSES, STATUS_STYLES, PRIORITIES, PRIORITY_STYLES, EFFORTS, EFFORT_LABELS,
  IMPACTS, IMPACT_LABELS, SPRINT_STATUS_STYLES, fullName,
} from "@/lib/labels"

// Prépare toutes les listes de choix du formulaire feature (chargées côté serveur).
export async function getFeatureFormOptions() {
  const [modules, sprints, profiles] = await Promise.all([getModules(), getSprints(), getProfiles()])
  return {
    status: FEATURE_STATUSES.map((v) => ({ value: v, label: STATUS_STYLES[v].label })),
    priority: PRIORITIES.map((v) => ({ value: v, label: PRIORITY_STYLES[v].label })),
    effort: EFFORTS.map((v) => ({ value: v, label: EFFORT_LABELS[v] })),
    impact: IMPACTS.map((v) => ({ value: v, label: IMPACT_LABELS[v] })),
    module_id: modules.map((m) => ({ value: String(m.id), label: m.name })),
    sprint_id: sprints.map((s) => ({ value: String(s.id), label: `Sprint ${s.id} · ${SPRINT_STATUS_STYLES[s.status].label}` })),
    assigned_to: profiles.filter((p) => p.firstname || p.lastname).map((p) => ({ value: p.id, label: fullName(p) })),
  }
}
