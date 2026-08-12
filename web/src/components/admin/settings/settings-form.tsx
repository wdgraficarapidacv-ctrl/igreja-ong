"use client";

import { useActionState } from "react";
import { Field, FormCard, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";
import { updateSettings } from "@/lib/actions/settings";
import type { ChurchSettings } from "@/lib/data/public";

export function SettingsForm({ settings }: { settings: ChurchSettings }) {
  const [state, formAction, pending] = useActionState(updateSettings, undefined);

  return (
    <FormCard title="Informações da igreja">
      <form action={formAction} className="grid gap-4">
        <Field label="Nome da igreja" name="church_name" defaultValue={settings.church_name} required />
        <TextAreaField label="Descrição" name="description" defaultValue={settings.description} rows={2} />
        <Field label="Logo (URL)" name="logo_url" defaultValue={settings.logo_url} placeholder="https://…" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp} placeholder="5511977202948" />
          <Field label="Telefone" name="phone" defaultValue={settings.phone} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" defaultValue={settings.email} />
          <TextAreaField label="Endereço" name="address" defaultValue={settings.address} rows={2} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Instagram (URL)" name="instagram_url" defaultValue={settings.instagram_url} />
          <Field label="Facebook (URL)" name="facebook_url" defaultValue={settings.facebook_url} />
          <Field label="YouTube (URL)" name="youtube_url" defaultValue={settings.youtube_url} />
        </div>

        <TextAreaField label="Texto do rodapé (opcional)" name="footer_text" defaultValue={settings.footer_text} rows={2} />

        <p className="text-[12.5px] text-ink-soft">
          Horários de culto são gerenciados em <strong>Cultos</strong>, e avisos do site em <strong>Avisos</strong> — para
          evitar informação duplicada.
        </p>

        {state?.error && (
          <p className="rounded-lg border border-danger/40 bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger">{state.error}</p>
        )}
        {state?.success && (
          <p className="rounded-lg border border-success/40 bg-success-soft px-3.5 py-2.5 text-[13.5px] text-success">
            Configurações salvas — o site público já reflete a mudança.
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <SubmitButton>{pending ? "Salvando…" : "Salvar configurações"}</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
