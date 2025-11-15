
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null,
  stripe_customer_id text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'provisioning', 'ready', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tenants_owner_user_id on tenants(owner_user_id);
create index if not exists idx_tenants_stripe_customer_id on tenants(stripe_customer_id);

create table if not exists tenant_members (
  tenant_id uuid references tenants(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('owner','admin','member')) not null default 'member',
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create index if not exists idx_tenant_members_user_id on tenant_members(user_id);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  kind text check (kind in ('CEO','Marketing','Content','Admin','Finance','Cyber','Tech','Social')) not null,
  name text not null,
  status text not null default 'offline' check (status in ('online', 'offline', 'busy', 'error')),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_agents_tenant_id on agents(tenant_id);
create index if not exists idx_agents_tenant_kind on agents(tenant_id, kind);

create table if not exists agent_tools (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  agent_id uuid references agents(id) on delete cascade not null,
  tool_key text not null,
  credentials_secret_arn text,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'disconnected' check (status in ('connected', 'disconnected', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_agent_tools_tenant_id on agent_tools(tenant_id);
create index if not exists idx_agent_tools_agent_id on agent_tools(agent_id);
create unique index if not exists idx_agent_tools_unique on agent_tools(tenant_id, agent_id, tool_key);

create table if not exists inbound_channels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  kind text check (kind in ('email','sms')) not null,
  address text unique not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inbound_channels_address on inbound_channels(address);
create index if not exists idx_inbound_channels_tenant_id on inbound_channels(tenant_id);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  agent_id uuid references agents(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_tasks_tenant_id on tasks(tenant_id);
create index if not exists idx_tasks_agent_id on tasks(agent_id);
create index if not exists idx_tasks_status on tasks(tenant_id, status);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  agent_id uuid references agents(id) on delete set null,
  channel text not null check (channel in ('chat', 'sms', 'email')),
  direction text not null check (direction in ('inbound', 'outbound')),
  from_address text,
  to_address text,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_tenant_id on messages(tenant_id);
create index if not exists idx_messages_channel on messages(tenant_id, channel);
create index if not exists idx_messages_created_at on messages(tenant_id, created_at desc);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  agent_id uuid references agents(id) on delete set null,
  user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_log_tenant_id on activity_log(tenant_id);
create index if not exists idx_activity_log_created_at on activity_log(tenant_id, created_at desc);
create index if not exists idx_activity_log_agent_id on activity_log(agent_id);


create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_tenants_updated_at before update on tenants
  for each row execute function update_updated_at_column();

create trigger update_agents_updated_at before update on agents
  for each row execute function update_updated_at_column();

create trigger update_agent_tools_updated_at before update on agent_tools
  for each row execute function update_updated_at_column();

create trigger update_tasks_updated_at before update on tasks
  for each row execute function update_updated_at_column();

create trigger update_inbound_channels_updated_at before update on inbound_channels
  for each row execute function update_updated_at_column();


alter table tenants enable row level security;
alter table tenant_members enable row level security;
alter table agents enable row level security;
alter table agent_tools enable row level security;
alter table inbound_channels enable row level security;
alter table tasks enable row level security;
alter table messages enable row level security;
alter table activity_log enable row level security;

create policy "Users can view their own tenants"
  on tenants for select
  using (
    id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can update their owned tenants"
  on tenants for update
  using (
    id in (
      select tenant_id from tenant_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create policy "Users can view members of their tenants"
  on tenant_members for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can view agents in their tenants"
  on agents for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can manage agents in their tenants"
  on agents for all
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Users can view agent tools in their tenants"
  on agent_tools for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can manage agent tools in their tenants"
  on agent_tools for all
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Users can view tasks in their tenants"
  on tasks for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can manage tasks in their tenants"
  on tasks for all
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can view messages in their tenants"
  on messages for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can create messages in their tenants"
  on messages for insert
  with check (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can view activity in their tenants"
  on activity_log for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can view inbound channels in their tenants"
  on inbound_channels for select
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can manage inbound channels in their tenants"
  on inbound_channels for all
  using (
    tenant_id in (
      select tenant_id from tenant_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
