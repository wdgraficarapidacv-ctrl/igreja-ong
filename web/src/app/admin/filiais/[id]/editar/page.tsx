import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBranch } from "@/lib/actions/branches";
import { BranchForm } from "@/components/admin/branches/branch-form";

export const metadata = { title: "Editar filial" };

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: branch } = await supabase.from("branches").select("*").eq("id", id).maybeSingle();

  if (!branch) notFound();

  return <BranchForm action={updateBranch.bind(null, id)} branch={branch} title={`Editar ${branch.city}`} />;
}
