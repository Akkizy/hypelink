alter table public.profiles
  add column banner_size text not null default 'medium',
  add column banner_fade boolean not null default true;
