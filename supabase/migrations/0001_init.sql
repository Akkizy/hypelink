-- Extensões necessárias
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  theme text not null default 'default',
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_.]{3,30}$')
);

create index profiles_username_idx on public.profiles (username);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- links
-- ============================================================
create table public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  is_active boolean not null default true,
  click_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index links_profile_id_idx on public.links (profile_id, position);

alter table public.links enable row level security;

create policy "active links are publicly readable"
  on public.links for select
  using (is_active = true or auth.uid() = profile_id);

create policy "users manage their own links"
  on public.links for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ============================================================
-- link_clicks (analytics avançado - plano pago)
-- ============================================================
create table public.link_clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.links (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  referrer text,
  device_type text,
  country text
);

create index link_clicks_link_id_idx on public.link_clicks (link_id, created_at);
create index link_clicks_profile_id_idx on public.link_clicks (profile_id, created_at);

alter table public.link_clicks enable row level security;

create policy "users read their own click analytics"
  on public.link_clicks for select
  using (auth.uid() = profile_id);

-- inserts happen only via service role (API route), so no public insert policy.

-- ============================================================
-- subscriptions (assinatura do plano pago via Mercado Pago)
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  mp_subscription_id text unique,
  status text not null default 'inactive' check (status in ('inactive', 'pending', 'authorized', 'cancelled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "users read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = profile_id);

-- writes happen only via service role (webhook handler).

-- ============================================================
-- pix_blocks (diferencial do plano pago)
-- ============================================================
create table public.pix_blocks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('donation', 'product')),
  title text not null,
  description text,
  amount numeric(10, 2),
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pix_blocks_profile_id_idx on public.pix_blocks (profile_id, position);

alter table public.pix_blocks enable row level security;

create policy "active pix blocks are publicly readable"
  on public.pix_blocks for select
  using (is_active = true or auth.uid() = profile_id);

create policy "users manage their own pix blocks"
  on public.pix_blocks for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ============================================================
-- pix_transactions
-- ============================================================
create table public.pix_transactions (
  id uuid primary key default gen_random_uuid(),
  pix_block_id uuid not null references public.pix_blocks (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  mp_payment_id text unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  amount numeric(10, 2) not null,
  payer_name text,
  payer_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pix_transactions_profile_id_idx on public.pix_transactions (profile_id, created_at);

alter table public.pix_transactions enable row level security;

create policy "users read their own pix transactions"
  on public.pix_transactions for select
  using (auth.uid() = profile_id);

-- writes happen only via service role (webhook handler).

-- ============================================================
-- trigger: cria profile automaticamente ao cadastrar usuário
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- trigger: updated_at automático
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_links_updated_at before update on public.links
  for each row execute function public.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger set_pix_blocks_updated_at before update on public.pix_blocks
  for each row execute function public.set_updated_at();
create trigger set_pix_transactions_updated_at before update on public.pix_transactions
  for each row execute function public.set_updated_at();
