import { createTransaction } from "@/lib/actions/financial";
import { TransactionForm } from "@/components/admin/financial/transaction-form";

export const metadata = { title: "Nova movimentação" };

export default function NewTransactionPage() {
  return <TransactionForm action={createTransaction} title="Nova movimentação" />;
}
