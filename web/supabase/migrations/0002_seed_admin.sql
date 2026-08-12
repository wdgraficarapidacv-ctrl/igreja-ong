-- =========================================================
-- Vincula o primeiro administrador
-- =========================================================
-- 1. No Supabase Dashboard: Authentication → Users → Add user
--    E-mail: wevertonjesusofc@gmail.com
--    Senha: escolha a que você vai usar no /login do site
--    Marque "Auto Confirm User"
-- 2. Rode este script no SQL Editor do Supabase.
-- =========================================================

insert into public.admins (id, full_name)
select id, 'Weverton Jesus'
from auth.users
where email = 'wevertonjesusofc@gmail.com'
on conflict (id) do nothing;

-- Confira se funcionou:
select a.id, a.full_name, u.email
from public.admins a
join auth.users u on u.id = a.id;
