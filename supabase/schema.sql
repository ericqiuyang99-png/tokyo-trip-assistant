create extension if not exists pgcrypto;

create table if not exists public.trip_documents (
  id text primary key,
  itinerary jsonb not null,
  edit_code_hash text not null,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.trip_documents enable row level security;
revoke all on public.trip_documents from anon, authenticated;

create or replace function public.get_trip_document(p_id text)
returns table (
  id text,
  itinerary jsonb,
  revision integer,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select d.id, d.itinerary, d.revision, d.updated_at
  from public.trip_documents d
  where d.id = p_id;
$$;

create or replace function public.save_trip_document(
  p_id text,
  p_itinerary jsonb,
  p_edit_code text
)
returns table (
  id text,
  itinerary jsonb,
  revision integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_hash text;
begin
  select d.edit_code_hash into existing_hash
  from public.trip_documents d
  where d.id = p_id
  for update;

  if existing_hash is null then
    insert into public.trip_documents (id, itinerary, edit_code_hash, revision, updated_at)
    values (p_id, p_itinerary, encode(digest(p_edit_code, 'sha256'), 'hex'), 1, now());
  else
    if existing_hash <> encode(digest(p_edit_code, 'sha256'), 'hex') then
      raise exception 'Invalid cloud sync edit code';
    end if;

    update public.trip_documents d
    set itinerary = p_itinerary,
        revision = d.revision + 1,
        updated_at = now()
    where d.id = p_id;
  end if;

  return query
  select d.id, d.itinerary, d.revision, d.updated_at
  from public.trip_documents d
  where d.id = p_id;
end;
$$;

grant execute on function public.get_trip_document(text) to anon, authenticated;
grant execute on function public.save_trip_document(text, jsonb, text) to anon, authenticated;
