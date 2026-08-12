import { getChurchSettings } from "@/lib/data/public";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const settings = await getChurchSettings();

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Dados usados pelo site público e pelo painel" />
      <SettingsForm settings={settings} />
    </div>
  );
}
