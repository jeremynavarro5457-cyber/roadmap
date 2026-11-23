import { Label } from "@/components/ui/label"

// Libellé + champ + message d'erreur, mis en forme comme dans le design system.
export function FormField({ id, label, required, error, children }: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}{required && " *"}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
