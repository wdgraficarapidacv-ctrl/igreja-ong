# Guia de setup — MARN Church (site + painel administrativo)

Este projeto é um site Next.js com um painel administrativo protegido por
autenticação real via [Supabase](https://supabase.com) (Postgres + Auth + RLS).

Siga os passos abaixo **na ordem**. Leva uns 10 minutos.

---

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New Project**.
   - Nome: `marn-church` (ou o que preferir)
   - Senha do banco: gere uma forte e guarde em local seguro (você não vai
     precisar dela no dia a dia — é só para acesso direto ao Postgres).
   - Região: escolha a mais próxima do Brasil (ex: São Paulo).
3. Aguarde o projeto terminar de provisionar (~2 minutos).

## 2. Pegar as chaves da API

1. No painel do Supabase, vá em **Project Settings → API**.
2. Copie:
   - **Project URL**
   - **anon public key**
3. Na pasta `web/` deste projeto, copie o arquivo de exemplo:

   ```bash
   cp .env.local.example .env.local
   ```

4. Abra `.env.local` e preencha:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-public-key-aqui
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   > A `anon public key` é segura para expor no navegador — a segurança de
   > verdade vem das políticas RLS do banco (passo 3). **Nunca** copie a
   > `service_role key` para este arquivo.

## 3. Rodar a migration do banco

1. No painel do Supabase, vá em **SQL Editor → New query**.
2. Abra o arquivo [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   deste projeto, copie todo o conteúdo, cole no SQL Editor e clique em **Run**.
   - Isso cria todas as tabelas (`members`, `services`, `events`,
     `financial_transactions`, `ministries`, `announcements`,
     `church_settings`, `admins`), as políticas de segurança (RLS) e já
     cadastra os 3 cultos que hoje aparecem no site.

## 4. Criar o primeiro administrador

**Não existe cadastro público** — o primeiro admin é criado direto pelo
painel do Supabase, com segurança:

1. No Supabase, vá em **Authentication → Users → Add user**.
   - E-mail: o que você vai usar para logar no `/login`
   - Senha: defina uma senha forte
   - Marque **Auto Confirm User** (assim não precisa validar e-mail para testar)
2. Volte no **SQL Editor**, abra
   [`supabase/migrations/0002_seed_admin.sql`](supabase/migrations/0002_seed_admin.sql),
   troque `admin@marnchurch.com` pelo e-mail que você cadastrou no passo
   anterior, cole no SQL Editor e clique em **Run**.
3. O `select` no final do script deve retornar uma linha confirmando o
   vínculo — se vier vazio, confira se o e-mail está exatamente igual.

## 5. Rodar o projeto localmente

```bash
cd web
npm install   # se ainda não rodou
npm run dev
```

Acesse `http://localhost:3000`:

- Site público em `/`
- Login em `/login` (use o e-mail e senha do passo 4)
- Painel em `/admin` (só acessível depois de logar)

## 6. Deixar o "Esqueci minha senha" funcionando

1. No Supabase: **Authentication → URL Configuration**.
2. Em **Site URL**, coloque a URL do seu site (em produção, ex:
   `https://marnchurch.com.br`; em desenvolvimento, `http://localhost:3000`).
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/login/reset-password`
   - `https://SEU-DOMINIO/login/reset-password` (quando tiver o domínio final)

Sem isso, o link de redefinição de senha do e-mail não vai funcionar (o
Supabase bloqueia redirects para URLs não cadastradas, por segurança).

## 7. Publicar (Vercel)

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), **New Project** → importe o repositório.
3. Em **Root Directory**, aponte para a pasta `web/`.
4. Em **Environment Variables**, adicione as mesmas três variáveis do
   `.env.local` (com a URL de produção em `NEXT_PUBLIC_SITE_URL`).
5. Deploy. Depois, repita o passo 6 acima trocando `localhost:3000` pela URL
   real do site na Vercel.

---

## Como o painel se conecta ao site público

- **Cultos** cadastrados como "Ativo" em `/admin/cultos` aparecem
  automaticamente na seção "Cultos" do site.
- **Ministérios** ativos aparecem na seção "Ministérios".
- **Avisos** publicados (e dentro do período) aparecem como um banner no
  topo do site.
- **Configurações** (`/admin/configuracoes`) alimenta endereço, WhatsApp,
  e-mail, redes sociais e nome exibidos no site.

Tudo isso lê direto do banco a cada visita — não precisa rebuildar o site
para uma mudança no painel aparecer.

## Camadas de segurança

1. **Proxy** (`src/proxy.ts`) — bloqueia o acesso a `/admin/*` sem sessão,
   redirecionando para `/login` antes mesmo da página carregar.
2. **Layout do admin** (`src/app/admin/layout.tsx`) — confere de novo, no
   servidor, se o usuário é um admin cadastrado.
3. **RLS no Postgres** — a camada definitiva: mesmo que alguém chame a API
   do Supabase diretamente (sem passar pelo Next.js), as tabelas sensíveis
   (`members`, `financial_transactions`, etc.) só respondem para quem está
   autenticado **e** cadastrado em `public.admins`.
