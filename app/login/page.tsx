import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-sm gap-0 p-8">
        <div className="flex items-center gap-2 pb-6 font-semibold">
          <span className="grid size-5.5 place-items-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground shadow-glow" aria-hidden>R</span>
          Roadmap
        </div>
        <h1 className="text-[1.375rem] leading-7 font-semibold">Connexion</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Accédez à la roadmap de votre équipe.</p>
        <LoginForm />
      </Card>
    </div>
  )
}
