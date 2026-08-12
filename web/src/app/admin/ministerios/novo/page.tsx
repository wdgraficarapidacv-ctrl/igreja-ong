import { createMinistry } from "@/lib/actions/ministries";
import { MinistryForm } from "@/components/admin/ministries/ministry-form";

export const metadata = { title: "Cadastrar ministério" };

export default function NewMinistryPage() {
  return <MinistryForm action={createMinistry} title="Cadastrar ministério" />;
}
