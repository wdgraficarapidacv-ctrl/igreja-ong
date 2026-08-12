import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateService } from "@/lib/actions/services";
import { ServiceForm } from "@/components/admin/services/service-form";

export const metadata = { title: "Editar culto" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("*").eq("id", id).maybeSingle();

  if (!service) notFound();

  return <ServiceForm action={updateService.bind(null, id)} service={service} title={`Editar ${service.name}`} />;
}
