create table public.link_categories (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index link_categories_profile_id_idx on public.link_categories (profile_id, position);

alter table public.link_categories enable row level security;

create policy "categories are publicly readable"
  on public.link_categories for select
  using (true);

create policy "users manage their own categories"
  on public.link_categories for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create trigger set_link_categories_updated_at before update on public.link_categories
  for each row execute function public.set_updated_at();

alter table public.links
  add column category_id uuid references public.link_categories (id) on delete set null;

create index links_category_id_idx on public.links (category_id);
