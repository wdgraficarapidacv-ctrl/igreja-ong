import { createClient } from "@/lib/supabase/server";
import { createMember } from "@/lib/actions/members";
import { MemberForm } from "@/components/admin/members/member-form";

export const metadata = { title: "Cadastrar membro" };

export default async function NewMemberPage() {
  const supabase = await createClient();
  const { data: ministries } = await supabase.from("ministries").select("id, name").order("name");

  return <MemberForm action={createMember} ministries={ministries ?? []} title="Cadastrar membro" />;
}
