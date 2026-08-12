import { Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";
import { WEEKDAYS } from "@/lib/constants/weekdays";

type CellGroup = {
  name: string;
  leader_name: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  weekday: string | null;
  meeting_time: string | null;
  whatsapp: string | null;
  people_count: number;
  status: string;
};

export function CellGroupForm({
  action,
  cellGroup,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  cellGroup?: CellGroup;
  title: string;
}) {
  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da célula" name="name" defaultValue={cellGroup?.name} placeholder="Ex: Célula Jardim Novo Horizonte" required />
          <Field label="Líder" name="leader_name" defaultValue={cellGroup?.leader_name} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cidade" name="city" defaultValue={cellGroup?.city} placeholder="Ex: Jandira" />
          <Field label="Bairro" name="neighborhood" defaultValue={cellGroup?.neighborhood} placeholder="Ex: Jardim Novo Horizonte" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Dia da semana" name="weekday" defaultValue={cellGroup?.weekday ?? ""}>
            <option value="">— Não definido —</option>
            {WEEKDAYS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </SelectField>
          <Field label="Horário" name="meeting_time" type="time" defaultValue={cellGroup?.meeting_time} />
        </div>

        <TextAreaField label="Endereço completo" name="address" defaultValue={cellGroup?.address} rows={2} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp do líder (opcional)" name="whatsapp" defaultValue={cellGroup?.whatsapp} placeholder="Usa o da igreja se vazio" />
          <Field label="Quantidade de pessoas" name="people_count" type="number" defaultValue={cellGroup?.people_count ?? 0} />
        </div>

        <SelectField label="Status" name="status" defaultValue={cellGroup?.status ?? "ativo"} required>
          <option value="ativo">Ativa</option>
          <option value="inativo">Inativa</option>
        </SelectField>

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
