alter table public.profiles
  add column avatar_size text not null default 'medium',
  add column custom_bg_color text not null default '#ffffff',
  add column custom_card_color text not null default '#f5f5f5',
  add column custom_text_color text not null default '#171717';
