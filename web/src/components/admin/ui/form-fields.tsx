import type { ReactNode } from "react";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  placeholder?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  children,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-accent"
      >
        {children}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-[14.5px] text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line bg-bg accent-[var(--accent)]"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-[10px] bg-accent px-5 py-2.5 text-[14.5px] font-bold text-accent-contrast transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[720px] rounded-2xl border border-line bg-bg-raised p-6 sm:p-8">
      <h2 className="mb-6 font-serif text-[20px] font-normal">{title}</h2>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const positive = ["ativo", "publicado", "agendado", "concluido"].includes(status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${
        positive ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
      }`}
    >
      {status}
    </span>
  );
}
