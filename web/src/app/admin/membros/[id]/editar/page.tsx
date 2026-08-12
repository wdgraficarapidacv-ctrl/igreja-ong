import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateMember } from "@/lib/actions/members";
import { MemberForm } from "@/components/admin/members/member-form";

export const metadata = { title: "Editar membro" };

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: member }, { data: ministries }] = await Promise.all([
    supabase.from("members").select("*").eq("id", id).maybeSingle(),
    supabase.from("ministries").select("id, name").order("name"),
  ]);

  if (!member) notFound();

  const action = updateMember.bind(null, id);

  return <MemberForm action={action} ministries={ministries ?? []} member={member} title={`Editar ${member.full_name}`} />;
}
