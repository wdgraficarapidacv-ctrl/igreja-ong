import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCellGroup } from "@/lib/actions/cell-groups";
import { CellGroupForm } from "@/components/admin/cell-groups/cell-group-form";

export const metadata = { title: "Editar célula" };

export default async function EditCellGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: cellGroup } = await supabase.from("cell_groups").select("*").eq("id", id).maybeSingle();

  if (!cellGroup) notFound();

  return <CellGroupForm action={updateCellGroup.bind(null, id)} cellGroup={cellGroup} title={`Editar ${cellGroup.name}`} />;
}
