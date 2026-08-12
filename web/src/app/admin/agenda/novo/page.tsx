import { createClient } from "@/lib/supabase/server";
import { createEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/admin/events/event-form";

export const metadata = { title: "Cadastrar evento" };

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: ministries } = await supabase.from("ministries").select("id, name").order("name");

  return <EventForm action={createEvent} ministries={ministries ?? []} title="Cadastrar evento" />;
}
