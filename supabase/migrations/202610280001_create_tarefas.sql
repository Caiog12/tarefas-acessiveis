create table public.tarefas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
     references auth.users(id) on delete cascade,
  titulo text not null check (
     char_length(trim(titulo)) between 1 and 200
  ),
  concluida boolean not null default false,
  criada_em timestamptz not null default now()
);

alter table public.tarefas enable row level security;
revoke all on table public.tarefas from public, anon, authenticated;
grant select, insert, update, delete
  on table public.tarefas to authenticated;

create policy "ler proprias tarefas"
on public.tarefas for select to authenticated
using ((select auth.uid()) = user_id);

create policy "inserir proprias tarefas"
on public.tarefas for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "atualizar proprias tarefas"
on public.tarefas for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "remover proprias tarefas"
on public.tarefas for delete to authenticated
using ((select auth.uid()) = user_id);

create index tarefas_user_id_idx
on public.tarefas(user_id);
