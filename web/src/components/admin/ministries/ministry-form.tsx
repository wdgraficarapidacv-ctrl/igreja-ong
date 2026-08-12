import { Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";
import type { ReactNode } from "react";

type Ministry = {
  name: string;
  description: string | null;
  leader_name: string | null;
  image_url: string | null;
  status: string;
};

export function MinistryForm({
  action,
  ministry,
  title,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  ministry?: Ministry;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <FormCard title={title}>
        <form action={action} className="grid gap-4">
          <Field label="Nome do ministério" name="name" defaultValue={ministry?.name} placeholder="Ex: Louvor" required />
          <TextAreaField label="Descrição" name="description" defaultValue={ministry?.description} rows={3} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Líder" name="leader_name" defaultValue={ministry?.leader_name} />
            <Field label="Imagem (URL)" name="image_url" defaultValue={ministry?.image_url} placeholder="https://…" />
          </div>

          <SelectField label="Status" name="status" defaultValue={ministry?.status ?? "ativo"} required>
            <option value="ativo">Ativo (aparece no site)</option>
            <option value="inativo">Inativo (oculto do site)</option>
          </SelectField>

          <div className="mt-2 flex gap-3">
            <SubmitButton>Salvar</SubmitButton>
          </div>
        </form>
      </FormCard>
      {children}
    </div>
  );
}
