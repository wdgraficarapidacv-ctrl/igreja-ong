import { createClient } from "@/lib/supabase/server";

/**
 * Dados públicos do site, com fallback estático caso o Supabase ainda
 * não esteja configurado (.env.local vazio) ou uma tabela esteja vazia —
 * assim o site nunca quebra, só deixa de refletir o que está no /admin.
 */

export type ChurchSettings = {
  church_name: string;
  logo_url: string | null;
  description: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  footer_text: string | null;
};

export const DEFAULT_SETTINGS: ChurchSettings = {
  church_name: "MARN — Ministério Apostólico e Refrigério para as Nações",
  logo_url: null,
  description: "Uma igreja para a sua família.",
  whatsapp: "5511977202948",
  phone: null,
  email: null,
  address: "Rua Juvenal Faustino de Melo, 300 — Jandira, SP — CEP 06604-090",
  instagram_url: "https://www.instagram.com/marnchurch/",
  facebook_url: null,
  youtube_url: null,
  footer_text: null,
};

export type ServiceItem = {
  id: string;
  name: string;
  weekday: string;
  start_time: string;
  end_time: string | null;
  description: string | null;
};

const WEEKDAY_ORDER = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "default-sabado",
    name: "Culto de Celebração",
    weekday: "sabado",
    start_time: "19:00",
    end_time: null,
    description: "Louvor, Palavra e comunhão para toda a família.",
  },
  {
    id: "default-domingo",
    name: "Culto de Celebração",
    weekday: "domingo",
    start_time: "18:00",
    end_time: null,
    description: "Encerrando a semana em adoração e ensino da Palavra.",
  },
  {
    id: "default-terca",
    name: "Noite de Evangelismo",
    weekday: "terca",
    start_time: "20:00",
    end_time: "22:00",
    description: "Saímos como igreja para levar o evangelho às ruas do bairro.",
  },
];

export type MinistryItem = {
  id: string;
  name: string;
  description: string | null;
  leader_name: string | null;
  image_url: string | null;
};

export const DEFAULT_MINISTRIES: MinistryItem[] = [
  {
    id: "default-teatro",
    name: "Teatro MARN",
    description: "Contando as histórias da fé em cena, com peças ao longo do ano.",
    leader_name: null,
    image_url: null,
  },
  {
    id: "default-louvor",
    name: "Louvor & Levitas",
    description: "Equipe de adoração que conduz cada culto e ensaia durante a semana.",
    leader_name: null,
    image_url: null,
  },
  {
    id: "default-perolas",
    name: "Gerando Pérolas",
    description: "Encontros que fortalecem e cuidam das mulheres da nossa igreja.",
    leader_name: null,
    image_url: null,
  },
  {
    id: "default-evangelismo",
    name: "Evangelismo",
    description: "Toda terça, uma equipe leva a mensagem de esperança para as ruas.",
    leader_name: null,
    image_url: null,
  },
];

export type AnnouncementItem = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
};

export function weekdayLabel(weekday: string) {
  const labels: Record<string, string> = {
    domingo: "Domingo",
    segunda: "Segunda-feira",
    terca: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira",
    sabado: "Sábado",
  };
  return labels[weekday] ?? weekday;
}

export function sortByWeekday(services: ServiceItem[]) {
  return [...services].sort(
    (a, b) => WEEKDAY_ORDER.indexOf(a.weekday) - WEEKDAY_ORDER.indexOf(b.weekday)
  );
}

export async function getChurchSettings(): Promise<ChurchSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("church_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getActiveServices(): Promise<ServiceItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, name, weekday, start_time, end_time, description")
      .eq("status", "ativo");
    if (error || !data || data.length === 0) return DEFAULT_SERVICES;
    return sortByWeekday(data as ServiceItem[]);
  } catch {
    return DEFAULT_SERVICES;
  }
}

export async function getActiveMinistries(): Promise<MinistryItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries")
      .select("id, name, description, leader_name, image_url")
      .eq("status", "ativo")
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_MINISTRIES;
    return data as MinistryItem[];
  } catch {
    return DEFAULT_MINISTRIES;
  }
}

export async function getPublishedAnnouncement(): Promise<AnnouncementItem | null> {
  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, body, image_url")
      .eq("status", "publicado")
      .lte("publish_at", nowIso)
      .or(`expire_at.is.null,expire_at.gte.${nowIso}`)
      .order("publish_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as AnnouncementItem;
  } catch {
    return null;
  }
}

export type BranchItem = {
  id: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  address: string | null;
  whatsapp: string | null;
  is_headquarters: boolean;
};

export const DEFAULT_BRANCHES: BranchItem[] = [
  {
    id: "default-jandira",
    name: "MARN CHURCH",
    city: "Jandira",
    state: "SP",
    country: "Brasil",
    address: "Rua Juvenal Faustino de Melo, 300 — CEP 06604-090",
    whatsapp: "5511977202948",
    is_headquarters: true,
  },
  {
    id: "default-rio-claro",
    name: "MARN CHURCH",
    city: "Rio Claro",
    state: "SP",
    country: "Brasil",
    address: null,
    whatsapp: null,
    is_headquarters: false,
  },
  {
    id: "default-itapevi",
    name: "MARN CHURCH",
    city: "Itapevi",
    state: "SP",
    country: "Brasil",
    address: null,
    whatsapp: null,
    is_headquarters: false,
  },
  {
    id: "default-india",
    name: "MARN CHURCH",
    city: "Índia",
    state: null,
    country: "Índia",
    address: null,
    whatsapp: null,
    is_headquarters: false,
  },
];

export async function getActiveBranches(): Promise<BranchItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("branches")
      .select("id, name, city, state, country, address, whatsapp, is_headquarters")
      .eq("status", "ativo")
      .order("is_headquarters", { ascending: false })
      .order("city", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_BRANCHES;
    return data as BranchItem[];
  } catch {
    return DEFAULT_BRANCHES;
  }
}

// Células (Refrigério no Lar) — módulo interno, ver lib/actions/cell-groups.ts
// e app/admin/celulas. Não tem seção pública: gestão fica só no painel.

// As fotos da página /ong (Índia, famílias que ajudamos, discipulado,
// parcerias) são hardcoded ali mesmo por enquanto — ver
// src/app/ong/page.tsx e src/components/site/photo-carousel.tsx.
