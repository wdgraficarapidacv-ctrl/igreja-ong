import { createCellGroup } from "@/lib/actions/cell-groups";
import { CellGroupForm } from "@/components/admin/cell-groups/cell-group-form";

export const metadata = { title: "Cadastrar célula" };

export default function NewCellGroupPage() {
  return <CellGroupForm action={createCellGroup} title="Cadastrar célula" />;
}
