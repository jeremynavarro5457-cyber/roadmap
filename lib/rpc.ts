import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

// Appels aux fonctions Postgres (« database functions ») créées dans Supabase.
// On les appelle avec supabase.rpc("nom_de_la_fonction", { arguments }).
//
// Ces fonctions renvoient du JSON (jsonb) : TypeScript ne connaît pas sa forme.
// On la vérifie donc avec zod : si la fonction change côté base, l'erreur est claire
// et on n'affiche jamais de données inattendues.
// Les fonctions s'exécutent avec les droits de l'utilisateur connecté (RLS appliquée).

const sprintsWithCountSchema = z.object({
  sprints: z.array(
    z.object({
      id: z.number(),
      goal: z.string().nullable(),
      start_date: z.string(),
      end_date: z.string(),
      status: z.string(),
      feature_count: z.number(),
    })
  ),
  backlog_count: z.number(),
})

const sprintSummarySchema = z.object({
  total_features: z.number(),
  by_status: z.record(z.string(), z.number()), // ex. { todo: 1, in_progress: 3, done: 1 }
  unassigned: z.number(),
})

const modulesWithCountSchema = z.object({
  modules: z.array(z.object({ id: z.number(), name: z.string(), color: z.string(), feature_count: z.number() })),
  total_features: z.number(),
})

const moduleFeaturesSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    status: z.string(),
    priority: z.string(),
    effort: z.string().nullable(),
    impact: z.string(),
    sprint_id: z.number().nullable(),
    assigned_to: z.string().nullable(),
    comment_count: z.number(),
  })
)

// La fonction renvoie soit { moved, destination_sprint_id }, soit { error }
const movePendingSchema = z.union([
  z.object({ moved: z.number(), destination_sprint_id: z.number() }),
  z.object({ error: z.string() }),
])

export type SprintSummary = z.infer<typeof sprintSummarySchema>
export type ModuleFeature = z.infer<typeof moduleFeaturesSchema>[number]

// Sprints avec leur nombre de features, et nombre de features sans sprint (backlog)
export async function getSprintsWithCount() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_sprints_with_count")
  if (error) throw new Error(error.message)
  return sprintsWithCountSchema.parse(data)
}

// Résumé d'un sprint : total, nombre de features par statut, nombre de non assignées
export async function getSprintSummary(sprintId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_sprint_summary", { p_sprint_id: sprintId })
  if (error) throw new Error(error.message)
  return sprintSummarySchema.parse(data)
}

// Modules avec leur nombre de features, et total de features
export async function getModulesWithCount() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_modules_with_count")
  if (error) throw new Error(error.message)
  return modulesWithCountSchema.parse(data)
}

// Features d'un module, avec leur nombre de commentaires
export async function getModuleFeatures(moduleId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_features_with_comments_count", { p_module_id: moduleId })
  if (error) throw new Error(error.message)
  return moduleFeaturesSchema.parse(data)
}

// Déplace les features non terminées d'un sprint vers le sprint suivant (statut remis à « À faire »)
export async function movePendingToNextSprint(sprintId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("move_pending_to_next_sprint", { p_sprint_id: sprintId })
  if (error) throw new Error(error.message)
  return movePendingSchema.parse(data)
}

// Progression (en %) d'un sprint à partir de son résumé : terminées / (total sans les annulées)
export function progressFromSummary(summary: SprintSummary) {
  const cancelled = summary.by_status.cancelled ?? 0
  const counted = summary.total_features - cancelled
  if (counted <= 0) return 0
  return Math.round((100 * (summary.by_status.done ?? 0)) / counted)
}
