-- =========================================================
-- MARN Church — schema inicial + RLS
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Supabase Dashboard → SQL Editor → New query → colar → Run)
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. ADMINS
-- Um admin = uma linha aqui, ligada 1:1 a um usuário do
-- Supabase Auth (auth.users). NÃO existe cadastro público:
-- o usuário é criado pelo dashboard do Supabase (Authentication
-- → Users → Add user) e depois vinculado aqui via SQL.
-- ---------------------------------------------------------
create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Função auxiliar: true se o usuário autenticado atual é admin.
-- security definer evita recursão de RLS ao checar a própria tabela.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where id = auth.uid()
  );
$$;

create policy "admin vê o próprio registro"
  on public.admins for select
  using (auth.uid() = id);

-- ---------------------------------------------------------
-- 2. MINISTÉRIOS
-- ---------------------------------------------------------
create table public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  leader_name text,
  image_url text,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now()
);

alter table public.ministries enable row level security;

create policy "público vê ministérios ativos"
  on public.ministries for select
  using (status = 'ativo');

create policy "admin gerencia ministérios"
  on public.ministries for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 3. MEMBROS
-- ---------------------------------------------------------
create table public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_url text,
  birth_date date,
  phone text,
  whatsapp text,
  email text,
  address text,
  joined_at date,
  baptized boolean not null default false,
  ministry_id uuid references public.ministries (id) on delete set null,
  role_title text,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.members enable row level security;

-- Sem policy pública: membros são dados privados, só admin acessa.
create policy "admin gerencia membros"
  on public.members for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 4. RELAÇÃO MINISTÉRIO ↔ MEMBRO (many-to-many opcional,
--    além do ministry_id principal em members)
-- ---------------------------------------------------------
create table public.ministry_members (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (ministry_id, member_id)
);

alter table public.ministry_members enable row level security;

create policy "admin gerencia relação ministério-membro"
  on public.ministry_members for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 5. CULTOS (services) — alimenta a seção pública "Cultos"
-- ---------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  weekday text not null check (
    weekday in ('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado')
  ),
  start_time time not null,
  end_time time,
  description text,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "público vê cultos ativos"
  on public.services for select
  using (status = 'ativo');

create policy "admin gerencia cultos"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 6. EVENTOS (agenda)
-- ---------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date not null,
  start_time time,
  location text,
  description text,
  responsible text,
  ministry_id uuid references public.ministries (id) on delete set null,
  image_url text,
  status text not null default 'agendado' check (status in ('agendado', 'cancelado', 'concluido')),
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "público vê eventos não cancelados"
  on public.events for select
  using (status <> 'cancelado');

create policy "admin gerencia eventos"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 7. FINANCEIRO — 100% privado, nunca exposto ao público
-- ---------------------------------------------------------
create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('entrada', 'despesa')),
  category text not null,
  description text,
  amount numeric(12, 2) not null check (amount >= 0),
  transaction_date date not null,
  notes text,
  created_by uuid references public.admins (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.financial_transactions enable row level security;

create policy "admin gerencia financeiro"
  on public.financial_transactions for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 8. AVISOS (announcements) — alimenta banner/seção pública
-- ---------------------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  publish_at timestamptz not null default now(),
  expire_at timestamptz,
  status text not null default 'rascunho' check (status in ('rascunho', 'publicado')),
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "público vê avisos publicados e vigentes"
  on public.announcements for select
  using (
    status = 'publicado'
    and publish_at <= now()
    and (expire_at is null or expire_at >= now())
  );

create policy "admin gerencia avisos"
  on public.announcements for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 9. CONFIGURAÇÕES DA IGREJA — linha única (id = 1)
-- ---------------------------------------------------------
create table public.church_settings (
  id int primary key default 1 check (id = 1),
  church_name text not null default 'MARN — Ministério Apostólico e Refrigério para as Nações',
  logo_url text,
  description text default 'Uma igreja para a sua família.',
  whatsapp text,
  phone text,
  email text,
  address text,
  instagram_url text default 'https://www.instagram.com/marnchurch/',
  facebook_url text,
  youtube_url text,
  footer_text text,
  updated_at timestamptz not null default now()
);

alter table public.church_settings enable row level security;

create policy "público vê configurações"
  on public.church_settings for select
  using (true);

create policy "admin edita configurações"
  on public.church_settings for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin insere configurações"
  on public.church_settings for insert
  with check (public.is_admin());

-- Semente: garante que sempre existe a linha única de configurações
insert into public.church_settings (id, church_name, whatsapp, address)
values (
  1,
  'MARN — Ministério Apostólico e Refrigério para as Nações',
  '5511977202948',
  'Rua Juvenal Faustino de Melo, 300 — Jandira, SP — CEP 06604-090'
)
on conflict (id) do nothing;

-- Semente: cultos que já existem no site público hoje
insert into public.services (name, weekday, start_time, end_time, description, status)
values
  ('Culto de Celebração', 'sabado', '19:00', null, 'Louvor, Palavra e comunhão para toda a família.', 'ativo'),
  ('Culto de Celebração', 'domingo', '18:00', null, 'Encerrando a semana em adoração e ensino da Palavra.', 'ativo'),
  ('Noite de Evangelismo', 'terca', '20:00', '22:00', 'Saímos como igreja para levar o evangelho às ruas do bairro.', 'ativo')
on conflict do nothing;

-- =========================================================
-- FIM DA MIGRATION
-- Próximo passo: crie o usuário admin em
-- Authentication → Users → Add user (no dashboard do Supabase)
-- e depois rode o script em supabase/migrations/0002_seed_admin.sql
-- (trocando o e-mail) para vinculá-lo como administrador.
-- =========================================================
