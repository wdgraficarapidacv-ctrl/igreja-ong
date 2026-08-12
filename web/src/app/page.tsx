import { SiteHeader } from "@/components/site/site-header";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Schedule } from "@/components/site/schedule";
import { CultosGallery } from "@/components/site/cultos-gallery";
import { Ministries } from "@/components/site/ministries";
import { OngTeaser } from "@/components/site/ong-teaser";
import { Location } from "@/components/site/location";
import { CtaFinal } from "@/components/site/cta-final";
import { SiteFooter } from "@/components/site/site-footer";
import {
  getActiveMinistries,
  getActiveServices,
  getChurchSettings,
  getPublishedAnnouncement,
} from "@/lib/data/public";

export default async function HomePage() {
  const [settings, services, ministries, announcement] = await Promise.all([
    getChurchSettings(),
    getActiveServices(),
    getActiveMinistries(),
    getPublishedAnnouncement(),
  ]);

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader whatsapp={settings.whatsapp} />
      <AnnouncementBanner announcement={announcement} />
      <main className="flex-1">
        <Hero services={services} whatsapp={settings.whatsapp} />
        <About />
        <Schedule services={services} />
        <CultosGallery />
        <Ministries ministries={ministries} />
        <OngTeaser />
        <Location settings={settings} />
        <CtaFinal settings={settings} services={services} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
