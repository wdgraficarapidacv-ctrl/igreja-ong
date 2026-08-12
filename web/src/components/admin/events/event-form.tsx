import { Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";

type Ministry = { id: string; name: string };
type EventItem = {
  name: string;
  event_date: string;
  start_time: string | null;
  location: string | null;
  description: string | null;
  responsible: string | null;
  ministry_id: string | null;
  image_url: string | null;
  status: string;
};

export function EventForm({
  action,
  ministries,
  event,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  ministries: Ministry[];
  event?: EventItem;
  title: string;
}) {
  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <Field label="Nome do evento" name="name" defaultValue={event?.name} placeholder="Ex: Encontro de Jovens" required />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Data" name="event_date" type="date" defaultValue={event?.event_date} required />
          <Field label="Horário (opcional)" name="start_time" type="time" defaultValue={event?.start_time} />
        </div>

        <Field label="Local" name="location" defaultValue={event?.location} placeholder="Ex: Salão principal" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Responsável" name="responsible" defaultValue={event?.responsible} />
          <SelectField label="Ministério" name="ministry_id" defaultValue={event?.ministry_id ?? ""}>
            <option value="">— Nenhum —</option>
            {ministries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </SelectField>
        </div>

        <Field label="Imagem (URL)" name="image_url" defaultValue={event?.image_url} placeholder="https://…" />
        <TextAreaField label="Descrição" name="description" defaultValue={event?.description} rows={3} />

        <SelectField label="Status" name="status" defaultValue={event?.status ?? "agendado"} required>
          <option value="agendado">Agendado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </SelectField>

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
