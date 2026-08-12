import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateAnnouncement } from "@/lib/actions/announcements";
import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";

export const metadata = { title: "Editar aviso" };

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: announcement } = await supabase.from("announcements").select("*").eq("id", id).maybeSingle();

  if (!announcement) notFound();

  return <AnnouncementForm action={updateAnnouncement.bind(null, id)} announcement={announcement} title={`Editar aviso`} />;
}
