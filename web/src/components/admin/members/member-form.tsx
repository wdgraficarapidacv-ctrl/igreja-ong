import { CheckboxField, Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";

type Ministry = { id: string; name: string };
type Member = {
  full_name: string;
  photo_url: string | null;
  birth_date: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  joined_at: string | null;
  baptized: boolean;
  ministry_id: string | null;
  role_title: string | null;
  status: string;
  notes: string | null;
};

export function MemberForm({
  action,
  ministries,
  member,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  ministries: Ministry[];
  member?: Member;
  title: string;
}) {
  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <Field label="Nome completo" name="full_name" defaultValue={member?.full_name} required />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Foto (URL)" name="photo_url" defaultValue={member?.photo_url} placeholder="https://…" />
          <Field label="Data de nascimento" name="birth_date" type="date" defaultValue={member?.birth_date} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefone" name="phone" defaultValue={member?.phone} placeholder="(11) 90000-0000" />
          <Field label="WhatsApp" name="whatsapp" defaultValue={member?.whatsapp} placeholder="(11) 90000-0000" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" defaultValue={member?.email} />
          <Field label="Data de entrada na igreja" name="joined_at" type="date" defaultValue={member?.joined_at} />
        </div>

        <TextAreaField label="Endereço" name="address" defaultValue={member?.address} rows={2} />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Ministério" name="ministry_id" defaultValue={member?.ministry_id ?? ""}>
            <option value="">— Nenhum —</option>
            {ministries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </SelectField>
          <Field label="Função" name="role_title" defaultValue={member?.role_title} placeholder="Ex: Líder de célula" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Status" name="status" defaultValue={member?.status ?? "ativo"} required>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </SelectField>
          <div className="flex items-end pb-2.5">
            <CheckboxField label="Batizado" name="baptized" defaultChecked={member?.baptized} />
          </div>
        </div>

        <TextAreaField label="Observações" name="notes" defaultValue={member?.notes} rows={3} />

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
