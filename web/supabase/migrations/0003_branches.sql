-- =========================================================
-- Filiais (branches) — alimenta a página pública /filiais
-- Rode este arquivo no SQL Editor do Supabase depois do 0001 e 0002.
-- =========================================================

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'MARN CHURCH',
  city text not null,
  state text,
  country text not null default 'Brasil',
  address text,
  whatsapp text,
  is_headquarters boolean not null default false,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now()
);

alter table public.branches enable row level security;

create policy "público vê filiais ativas"
  on public.branches for select
  using (status = 'ativo');

create policy "admin gerencia filiais"
  on public.branches for all
  using (public.is_admin())
  with check (public.is_admin());

-- Semente: as unidades já conhecidas hoje
insert into public.branches (name, city, state, country, address, whatsapp, is_headquarters, status)
values
  ('MARN CHURCH', 'Jandira', 'SP', 'Brasil', 'Rua Juvenal Faustino de Melo, 300 — CEP 06604-090', '5511977202948', true, 'ativo'),
  ('MARN CHURCH', 'Rio Claro', 'SP', 'Brasil', null, null, false, 'ativo'),
  ('MARN CHURCH', 'Itapevi', 'SP', 'Brasil', null, null, false, 'ativo'),
  ('MARN CHURCH', 'Índia', null, 'Índia', null, null, false, 'ativo')
on conflict do nothing;
