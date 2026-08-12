import { createAnnouncement } from "@/lib/actions/announcements";
import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";

export const metadata = { title: "Criar aviso" };

export default function NewAnnouncementPage() {
  return <AnnouncementForm action={createAnnouncement} title="Criar aviso" />;
}
