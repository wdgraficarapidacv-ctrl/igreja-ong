import { CheckboxField, Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";

type Branch = {
  name: string;
  city: string;
  state: string | null;
  country: string;
  address: string | null;
  whatsapp: string | null;
  is_headquarters: boolean;
  status: string;
};

export function BranchForm({
  action,
  branch,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  branch?: Branch;
  title: string;
}) {
  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <Field label="Nome" name="name" defaultValue={branch?.name ?? "MARN CHURCH"} required />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Cidade" name="city" defaultValue={branch?.city} required />
          <Field label="Estado (UF)" name="state" defaultValue={branch?.state} placeholder="SP" />
          <Field label="País" name="country" defaultValue={branch?.country ?? "Brasil"} />
        </div>

        <TextAreaField label="Endereço" name="address" defaultValue={branch?.address} rows={2} />
        <Field label="WhatsApp" name="whatsapp" defaultValue={branch?.whatsapp} placeholder="5511977202948" />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Status" name="status" defaultValue={branch?.status ?? "ativo"} required>
            <option value="ativo">Ativo (aparece no site)</option>
            <option value="inativo">Inativo (oculto do site)</option>
          </SelectField>
          <div className="flex items-end pb-2.5">
            <CheckboxField label="É a sede principal" name="is_headquarters" defaultChecked={branch?.is_headquarters} />
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
