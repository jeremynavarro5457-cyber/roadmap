import { PageHeader } from "@/components/page-header"
import { SprintForm } from "@/components/sprint-form"

export default function NewSprintPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/sprints", label: "← Retour" }]} title="Nouveau sprint" />
      <SprintForm />
    </>
  )
}
