import { EducationalResourceAdminForm } from "@/components/educational-resource-admin-form";
import { PageHeader } from "@/components/ui";

export default function AdminEducationalResourcesPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 text-neutral-900 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Administrar recursos educacionais"
          description="Area administrativa para alimentar o portal publico de recursos educacionais."
          breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "Admin" }, { label: "Recursos educacionais" }]}
        />
        <EducationalResourceAdminForm />
      </div>
    </main>
  );
}
