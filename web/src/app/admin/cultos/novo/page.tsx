import { createService } from "@/lib/actions/services";
import { ServiceForm } from "@/components/admin/services/service-form";

export const metadata = { title: "Cadastrar culto" };

export default function NewServicePage() {
  return <ServiceForm action={createService} title="Cadastrar culto" />;
}
