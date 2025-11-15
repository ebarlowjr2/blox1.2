
create extension if not exists pgcrypto;


do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='agents'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='tenant_id'
  ) then
    alter table public.agents add column tenant_id uuid;
    raise notice 'Added tenant_id column to agents table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='tasks'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='tasks' and column_name='tenant_id'
  ) then
    alter table public.tasks add column tenant_id uuid;
    raise notice 'Added tenant_id column to tasks table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='messages'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='messages' and column_name='tenant_id'
  ) then
    alter table public.messages add column tenant_id uuid;
    raise notice 'Added tenant_id column to messages table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='agent_tools'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agent_tools' and column_name='tenant_id'
  ) then
    alter table public.agent_tools add column tenant_id uuid;
    raise notice 'Added tenant_id column to agent_tools table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='inbound_channels'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='inbound_channels' and column_name='tenant_id'
  ) then
    alter table public.inbound_channels add column tenant_id uuid;
    raise notice 'Added tenant_id column to inbound_channels table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='activity_log'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='activity_log' and column_name='tenant_id'
  ) then
    alter table public.activity_log add column tenant_id uuid;
    raise notice 'Added tenant_id column to activity_log table';
  end if;
end$$;


do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='agents'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='status'
  ) then
    alter table public.agents add column status text default 'offline' check (status in ('online', 'offline', 'busy', 'error'));
    raise notice 'Added status column to agents table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='agents'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='updated_at'
  ) then
    alter table public.agents add column updated_at timestamptz not null default now();
    raise notice 'Added updated_at column to agents table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='tasks'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='tasks' and column_name='updated_at'
  ) then
    alter table public.tasks add column updated_at timestamptz not null default now();
    raise notice 'Added updated_at column to tasks table';
  end if;
end$$;

select 'Pre-patch completed. You can now run the main migration (001_multitenant_schema.sql)' as status;
