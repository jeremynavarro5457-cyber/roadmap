import { z } from "zod"
import { FEATURE_STATUSES, PRIORITIES, EFFORTS, IMPACTS, SPRINT_STATUSES } from "@/lib/labels"

// Schémas de validation partagés entre les formulaires (navigateur) et les Server Actions (serveur).
// Les selects renvoient des chaînes : "" veut dire « aucune valeur ».

export const featureSchema = z.object({
  title: z.string().trim().min(1, "Le titre est obligatoire").max(200),
  description: z.string().trim(),
  status: z.enum(FEATURE_STATUSES),
  priority: z.enum(PRIORITIES),
  effort: z.enum(EFFORTS).or(z.literal("")),
  impact: z.enum(IMPACTS),
  module_id: z.string(),
  sprint_id: z.string(),
  assigned_to: z.string(),
})
export type FeatureInput = z.infer<typeof featureSchema>

export const sprintSchema = z
  .object({
    goal: z.string().trim(),
    start_date: z.string().min(1, "Date de début obligatoire"),
    end_date: z.string().min(1, "Date de fin obligatoire"),
    status: z.enum(SPRINT_STATUSES),
  })
  .refine((s) => s.end_date >= s.start_date, { message: "La fin doit être après le début", path: ["end_date"] })
export type SprintInput = z.infer<typeof sprintSchema>

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Écrivez un commentaire").max(2000),
})
export type CommentInput = z.infer<typeof commentSchema>

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe obligatoire"),
})
export type LoginInput = z.infer<typeof loginSchema>

// Profil : seuls le prénom et le nom sont modifiables. Le rôle n'est volontairement pas
// dans ce schéma : il ne peut pas être envoyé par le formulaire.
export const profileSchema = z.object({
  firstname: z.string().trim().max(60),
  lastname: z.string().trim().max(60),
})
export type ProfileInput = z.infer<typeof profileSchema>

export const avatarUrlSchema = z.string().url()
