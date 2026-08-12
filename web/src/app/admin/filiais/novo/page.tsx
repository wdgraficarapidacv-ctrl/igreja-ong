import { createBranch } from "@/lib/actions/branches";
import { BranchForm } from "@/components/admin/branches/branch-form";

export const metadata = { title: "Cadastrar filial" };

export default function NewBranchPage() {
  return <BranchForm action={createBranch} title="Cadastrar filial" />;
}
