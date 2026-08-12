import { Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";
import { WEEKDAYS } from "@/lib/constants/weekdays";

type Service = {
  name: string;
  weekday: string;
  start_time: string;
  end_time: string | null;
  description: string | null;
  status: string;
  notes: string | null;
};

export function ServiceForm({
  action,
  service,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  service?: Service;
  title: string;
}) {
  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <Field label="Nome do culto" name="name" defaultValue={service?.name} placeholder="Ex: Culto de Celebração" required />

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Dia da semana" name="weekday" defaultValue={service?.weekday} required>
            <option value="" disabled>
              Selecione…
            </option>
            {WEEKDAYS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </SelectField>
          <Field label="Horário inicial" name="start_time" type="time" defaultValue={service?.start_time} required />
          <Field label="Horário final (opcional)" name="end_time" type="time" defaultValue={service?.end_time} />
        </div>

        <TextAreaField label="Descrição" name="description" defaultValue={service?.description} rows={2} placeholder="Aparece no site público" />

        <SelectField label="Status" name="status" defaultValue={service?.status ?? "ativo"} required>
          <option value="ativo">Ativo (aparece no site)</option>
          <option value="inativo">Inativo (oculto do site)</option>
        </SelectField>

        <TextAreaField label="Observações internas" name="notes" defaultValue={service?.notes} rows={2} />

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
