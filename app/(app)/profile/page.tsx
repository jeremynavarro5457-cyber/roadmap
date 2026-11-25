import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ProfileForm } from "@/components/profile-form"
import { AvatarUpload } from "@/components/avatar-upload"
import { getCurrentProfile } from "@/lib/auth"
import { ROLE_LABELS, formatDate } from "@/lib/labels"

export default async function ProfilePage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect("/login")

  return (
    <>
      <PageHeader title="Mon profil" subtitle="Vos informations personnelles." />
      <Card className="max-w-xl gap-4 p-4">
        {/* Informations en lecture seule : l'email vient de la connexion, le rôle est attribué par un admin */}
        <AvatarUpload userId={profile.id} person={profile} />
        <hr />
        <dl className="grid grid-cols-[100px_1fr] items-center gap-x-2 gap-y-3 text-sm">
          <dt className="text-xs font-medium text-subtle">Email</dt>
          <dd>{profile.email}</dd>
          <dt className="text-xs font-medium text-subtle">Rôle</dt>
          <dd>{ROLE_LABELS[profile.role] ?? profile.role}</dd>
          <dt className="text-xs font-medium text-subtle">Membre depuis</dt>
          <dd className="text-muted-foreground">{formatDate(profile.created_at)}</dd>
        </dl>
        <hr />
        <ProfileForm defaultValues={{ firstname: profile.firstname ?? "", lastname: profile.lastname ?? "" }} />
      </Card>
    </>
  )
}
