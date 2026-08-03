# linka

Página de links (estilo Linktree) com foco em performance, plano grátis e plano PRO com cobranças via Pix embutidas na página.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth)
- Mercado Pago (assinatura do plano PRO + pagamentos Pix)
- Deploy: Vercel

## 1. Configurar o Supabase

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode o conteúdo de `supabase/migrations/0001_init.sql`.
3. Em **Project Settings > API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no client)

## 2. Configurar o Mercado Pago

1. Crie uma conta em [mercadopago.com.br](https://www.mercadopago.com.br) e acesse **Suas integrações** no painel de desenvolvedores.
2. Crie uma aplicação e copie o **Access Token** (use o de teste primeiro) → `MERCADOPAGO_ACCESS_TOKEN`.
3. Copie a **Public Key** de teste → `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`.
4. Em **Webhooks**, configure a URL `https://SEU_DOMINIO/api/webhooks/mercadopago` para os eventos `payment` e `subscription_preapproval`.
5. Para testar sem sair do sandbox, use os [usuários de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/test/accounts).

## 3. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha os valores.

```bash
cp .env.local.example .env.local
```

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## 5. Deploy

1. Suba o código para um repositório no GitHub.
2. Importe o repositório na [Vercel](https://vercel.com/new) (plano free).
3. Configure as mesmas variáveis de ambiente do `.env.local` no painel da Vercel.
4. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio de produção e refaça o deploy.
5. Atualize a URL do webhook no Mercado Pago para o domínio de produção.

## Estrutura

- `/` — landing page com os planos
- `/login`, `/signup` — autenticação
- `/dashboard` — editor de links, design, analytics, Pix, assinatura
- `/[username]` — página pública de bio
- `/[username]/pix/[blockId]` — checkout Pix de um bloco (diferencial do plano PRO)
- `/api/track-click` — registra cliques
- `/api/webhooks/mercadopago` — confirma assinaturas e pagamentos Pix
