"use client";

import { useTransition } from "react";

export function ConfirmDeleteButton({
  action,
  confirmMessage = "Tem certeza que deseja excluir? Essa ação não pode ser desfeita.",
  label = "Excluir",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="text-[13px] font-semibold text-danger hover:underline disabled:opacity-50"
    >
      {pending ? "Excluindo…" : label}
    </button>
  );
}
