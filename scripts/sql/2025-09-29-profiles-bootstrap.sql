/*
This script is idempotent and adds a profiles table (if missing) and columns:
- id (uuid PK, references auth.users)
- email (text)
- full_name (text)
- is_admin (boolean, default false)
- last_login_at (timestamptz)
*/

-- Create table if not exists
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean default false,
  last_login_at timestamptz
);

-- Add columns if they don't exist
do $$
begin
  if not exists(select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='email') then
    alter table public.profiles add column email text;
  end if;

  if not exists(select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='full_name') then
    alter table public.profiles add column full_name text;
  end if;

  if not exists(select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='is_admin') then
    alter table public.profiles add column is_admin boolean default false;
  end if;

  if not exists(select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='last_login_at') then
    alter table public.profiles add column last_login_at timestamptz;
  end if;
end$$;
