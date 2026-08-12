import { Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";
import { toDatetimeLocal } from "@/lib/format-datetime-local";

type Announcement = {
  title: string;
  body: string;
  image_url: string | null;
  publish_at: string;
  expire_at: string | null;
  status: string;
};

export function AnnouncementForm({
  action,
  announcement,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  announcement?: Announcement;
  title: string;
}) {
  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <Field label="Título" name="title" defaultValue={announcement?.title} placeholder="Ex: Culto especial neste domingo" required />
        <TextAreaField label="Texto" name="body" defaultValue={announcement?.body} rows={4} placeholder="Ex: Teremos um culto especial neste domingo às 18h." />
        <Field label="Imagem (opcional, URL)" name="image_url" defaultValue={announcement?.image_url} placeholder="https://…" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Publicar a partir de" name="publish_at" type="datetime-local" defaultValue={toDatetimeLocal(announcement?.publish_at) || undefined} />
          <Field label="Expira em (opcional)" name="expire_at" type="datetime-local" defaultValue={toDatetimeLocal(announcement?.expire_at) || undefined} />
        </div>

        <SelectField label="Status" name="status" defaultValue={announcement?.status ?? "rascunho"} required>
          <option value="rascunho">Rascunho (não aparece no site)</option>
          <option value="publicado">Publicado (aparece no site, se dentro do período)</option>
        </SelectField>

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
