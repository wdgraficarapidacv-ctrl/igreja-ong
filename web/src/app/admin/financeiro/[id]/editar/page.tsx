import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateTransaction } from "@/lib/actions/financial";
import { TransactionForm } from "@/components/admin/financial/transaction-form";

export const metadata = { title: "Editar movimentação" };

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: transaction } = await supabase.from("financial_transactions").select("*").eq("id", id).maybeSingle();

  if (!transaction) notFound();

  return <TransactionForm action={updateTransaction.bind(null, id)} transaction={transaction} title="Editar movimentação" />;
}
