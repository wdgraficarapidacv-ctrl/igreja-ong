import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateMinistry } from "@/lib/actions/ministries";
import { MinistryForm } from "@/components/admin/ministries/ministry-form";
import { FormCard } from "@/components/admin/ui/form-fields";

export const metadata = { title: "Editar ministério" };

export default async function EditMinistryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: ministry }, { data: members }] = await Promise.all([
    supabase.from("ministries").select("*").eq("id", id).maybeSingle(),
    supabase.from("members").select("id, full_name, status").eq("ministry_id", id).order("full_name"),
  ]);

  if (!ministry) notFound();

  return (
    <MinistryForm action={updateMinistry.bind(null, id)} ministry={ministry} title={`Editar ${ministry.name}`}>
      <FormCard title={`Membros neste ministério (${members?.length ?? 0})`}>
        {!members || members.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Nenhum membro vinculado ainda. Vincule pelo cadastro do membro, no campo &quot;Ministério&quot;.
          </p>
        ) : (
          <ul className="grid gap-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5">
                <span className="text-[14px]">{m.full_name}</span>
                <Link href={`/admin/membros/${m.id}/editar`} className="text-[13px] text-accent-ink hover:underline">
                  Ver membro →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </FormCard>
    </MinistryForm>
  );
}
