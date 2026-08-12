import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/admin/events/event-form";

export const metadata = { title: "Editar evento" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: event }, { data: ministries }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("ministries").select("id, name").order("name"),
  ]);

  if (!event) notFound();

  return <EventForm action={updateEvent.bind(null, id)} ministries={ministries ?? []} event={event} title={`Editar ${event.name}`} />;
}
