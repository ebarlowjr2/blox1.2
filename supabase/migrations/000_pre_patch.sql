
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
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='org_id'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='tenant_id'
  ) then
    update public.agents set tenant_id = org_id where tenant_id is null and org_id is not null;
    raise notice 'Backfilled tenant_id from org_id in agents table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='agents'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='kind'
  ) then
    alter table public.agents add column kind text;
    raise notice 'Added kind column to agents table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='agents'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='agents' and column_name='config'
  ) then
    alter table public.agents add column config jsonb default '{}'::jsonb;
    raise notice 'Added config column to agents table';
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
    alter table public.agents add column updated_at timestamptz default now();
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
    where table_schema='public' and table_name='tasks'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='tasks' and column_name='status'
  ) then
    alter table public.tasks add column status text default 'pending';
    raise notice 'Added status column to tasks table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='tasks'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='tasks' and column_name='priority'
  ) then
    alter table public.tasks add column priority text default 'medium';
    raise notice 'Added priority column to tasks table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='tasks'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='tasks' and column_name='metadata'
  ) then
    alter table public.tasks add column metadata jsonb default '{}'::jsonb;
    raise notice 'Added metadata column to tasks table';
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
    alter table public.tasks add column updated_at timestamptz default now();
    raise notice 'Added updated_at column to tasks table';
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
    where table_schema='public' and table_name='messages'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='messages' and column_name='channel'
  ) then
    alter table public.messages add column channel text;
    raise notice 'Added channel column to messages table';
  end if;
end$$;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='messages'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='messages' and column_name='created_at'
  ) then
    alter table public.messages add column created_at timestamptz default now();
    raise notice 'Added created_at column to messages table';
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

select 'Pre-patch completed successfully! You can now run the main migration (001_multitenant_schema.sql)' as status;
