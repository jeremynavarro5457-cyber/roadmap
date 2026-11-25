import Image from "next/image"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  STATUS_STYLES,
  SPRINT_STATUS_STYLES,
  PRIORITY_STYLES,
  initials,
  fullName,
} from "@/lib/labels"

// Petits composants d'affichage du design system (badges, pastilles, avatar…)

function DotBadge({ label, dot, badge }: { label: string; dot: string; badge: string }) {
  return (
    <span className={cn("inline-flex h-5.5 items-center gap-1.5 rounded-sm px-2 text-xs font-medium whitespace-nowrap", badge)}>
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden />
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return <DotBadge {...(STATUS_STYLES[status] ?? STATUS_STYLES.backlog)} />
}

export function SprintStatusBadge({ status }: { status: string }) {
  return <DotBadge {...(SPRINT_STATUS_STYLES[status] ?? SPRINT_STATUS_STYLES.planned)} />
}

export function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium
  if (priority === "critical") {
    return (
      <span className="inline-flex h-5.5 items-center gap-1 rounded-sm bg-prio-critical-bg px-1.5 text-xs font-medium text-prio-critical-fg whitespace-nowrap">
        <span className="grid size-3 place-items-center rounded-xs bg-prio-critical text-[0.5rem] leading-none font-bold text-white" aria-hidden>!</span>
        {p.label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
      {/* Icône à 3 barres : les barres pleines indiquent le niveau */}
      <span className="flex h-3 items-end gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-0.75 rounded-xs", i === 1 ? "h-1" : i === 2 ? "h-2" : "h-3", i <= p.bars ? p.color : "bg-border")} />
        ))}
      </span>
      {p.label}
    </span>
  )
}

export function ModuleDot({ module }: { module: { name: string; color: string } | null }) {
  if (!module) return null
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
      {/* La couleur vient de la base : style inline autorisé car valeur dynamique */}
      <span className="size-2 rounded-full" style={{ backgroundColor: module.color }} aria-hidden />
      {module.name}
    </span>
  )
}

type Person = { firstname: string | null; lastname: string | null; avatar_url?: string | null } | null

// sm = 24 px (listes, commentaires), lg = 80 px (page profil)
const AVATAR_SIZES = {
  sm: { box: "size-6 text-[0.6875rem]", px: 24 },
  lg: { box: "size-20 text-xl", px: 80 },
}

// Affiche la photo de profil si l'utilisateur en a une, sinon ses initiales.
export function Avatar({ person, size = "sm" }: { person: Person; size?: keyof typeof AVATAR_SIZES }) {
  const { box, px } = AVATAR_SIZES[size]

  if (!person) {
    return <span title="Non assigné" className={cn("grid shrink-0 place-items-center rounded-full border border-dashed border-input text-subtle", box)}>–</span>
  }
  if (person.avatar_url) {
    // unoptimized : l'image est servie telle quelle par son hébergeur (Supabase Storage ou autre)
    return (
      <Image
        src={person.avatar_url}
        alt={fullName(person)}
        title={fullName(person)}
        width={px}
        height={px}
        unoptimized
        className={cn("shrink-0 rounded-full object-cover", box)}
      />
    )
  }
  return (
    <span title={fullName(person)} className={cn("grid shrink-0 place-items-center rounded-full bg-accent font-semibold text-accent-foreground", box)}>
      {initials(person)}
    </span>
  )
}

export function CommentCount({ count }: { count: number }) {
  const label = `${count} commentaire${count > 1 ? "s" : ""}`
  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-5.5 items-center gap-1 rounded-full px-2 text-xs font-semibold whitespace-nowrap",
        count > 0 ? "bg-accent text-accent-foreground" : "text-subtle"
      )}
    >
      <MessageSquare className="size-3" aria-hidden />
      {count}
    </span>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      {/* Largeur calculée : style inline autorisé */}
      <div className="h-full bg-status-done" style={{ width: `${value}%` }} />
    </div>
  )
}
