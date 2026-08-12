-- =========================================================
-- Células (Refrigério no Lar) — módulo interno do painel,
-- organizado por cidade e bairro. Sem seção pública: só o
-- admin vê e gerencia (como Membros e Financeiro).
-- Rode este arquivo no SQL Editor do Supabase depois do 0001-0003.
-- =========================================================

create table public.cell_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_name text not null,
  city text,
  neighborhood text,
  address text,
  weekday text check (
    weekday in ('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado')
  ),
  meeting_time time,
  whatsapp text,
  people_count int not null default 0 check (people_count >= 0),
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cell_groups enable row level security;

-- Sem policy pública: células são geridas só pelo admin, igual a Membros.
create policy "admin gerencia células"
  on public.cell_groups for all
  using (public.is_admin())
  with check (public.is_admin());

-- Semente de exemplo (edite ou apague pelo painel depois)
insert into public.cell_groups (name, leader_name, city, neighborhood, weekday, meeting_time, people_count, status)
values
  ('Célula Jardim Novo Horizonte', 'A definir', 'Jandira', 'Jardim Novo Horizonte', 'quarta', '20:00', 0, 'ativo')
on conflict do nothing;
