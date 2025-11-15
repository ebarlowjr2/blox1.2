# BLOX Multi-Tenant Migration Guide

This document provides comprehensive instructions for migrating the BLOX application to a multi-tenant architecture.

## Overview

The multi-tenant retrofit adds the following capabilities:
- **Tenant Isolation**: Each organization has its own isolated data and agents
- **Stripe Billing**: Subscription management with free and pro plans
- **Agent Provisioning**: Automatic setup of 8 AI agents per tenant
- **Onboarding Flow**: Guided setup for new organizations
- **Inbound Routing**: SMS/Email routing to correct tenant
- **AWS Secrets Manager**: Secure credential storage per tenant

## Architecture Changes

### Database Schema

New tables added:
- `tenants` - Organization/tenant records
- `tenant_members` - User-to-tenant relationships with roles
- `agents` - AI agents scoped to tenants
- `agent_tools` - Tool configurations for agents
- `inbound_channels` - Email/SMS routing mappings
- `tasks` - Task tracking per tenant
- `messages` - Chat/SMS message history
- `activity_log` - Audit trail and activity feed

### Key Components

1. **Tenant Resolution** (`src/lib/tenant.ts`)
   - `getTenantContext()` - Single source of truth for tenant resolution
   - `getUserTenants()` - List all tenants for a user
   - `setActiveTenant()` - Switch between tenants

2. **API Middleware** (`src/lib/api-middleware.ts`)
   - `withTenant()` - Enforce tenant scoping on API routes
   - `withAdmin()` - Require admin role
   - `withOwner()` - Require owner role
   - `q()` - Database query helper with automatic tenant scoping

3. **Secrets Management** (`src/lib/secrets.ts`)
   - AWS Secrets Manager integration
   - Per-tenant credential storage
   - Tool credential helpers

4. **Provisioning** (`src/app/api/provision-tenant/route.ts`)
   - Idempotent tenant setup
   - Creates 8 default AI agents
   - Sets up tool placeholders

## Migration Steps

### 1. Database Migration

**IMPORTANT**: If you have existing `agents` or `tasks` tables, you must run the pre-patch migration first.

#### Step 1a: Check for Existing Tables (Optional)

Run this diagnostic query in Supabase SQL Editor to check if you have existing tables:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public' 
AND table_name IN ('agents', 'tasks', 'messages');
```

#### Step 1b: Run Pre-Patch Migration (If You Have Existing Tables)

If the query above returns any tables, run the pre-patch migration first:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/000_pre_patch.sql
```

This pre-patch will:
- Add `tenant_id` column to existing tables
- Add other missing columns like `status` and `updated_at`
- Enable the pgcrypto extension for UUID generation

**This is safe to run multiple times (idempotent).**

#### Step 1c: Run Main Migration

Now run the main migration SQL file in your Supabase project:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/001_multitenant_schema.sql
```

This creates all necessary tables, indexes, RLS policies, and triggers.

### 2. Environment Variables

Update your `.env.local` file with the new required variables:

```bash
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://blox.onecs.net
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# New multi-tenant variables
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_PRICE_MONTHLY=price_xxx
NEXT_PUBLIC_PRICE_ANNUAL=price_yyy
API_BASE_URL=https://api.blox.onecs.net
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
SECRETS_PREFIX=blox/
SES_DOMAIN=bloxmail.com
```

### 3. Install Dependencies

```bash
npm install stripe @aws-sdk/client-secrets-manager
```

### 4. Configure Stripe

1. Create products and prices in Stripe Dashboard
2. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
3. Configure webhook to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Configure AWS Secrets Manager

1. Create IAM user with Secrets Manager permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:CreateSecret",
           "secretsmanager:GetSecretValue",
           "secretsmanager:UpdateSecret",
           "secretsmanager:DescribeSecret"
         ],
         "Resource": "arn:aws:secretsmanager:*:*:secret:blox/*"
       }
     ]
   }
   ```
2. Add credentials to environment variables

### 6. Update Supabase RLS Policies

The migration includes RLS policies, but verify they're enabled:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tenants', 'agents', 'tasks', 'messages');
```

### 7. Backfill Existing Data (if applicable)

If you have existing users, create tenants for them:

```sql
-- Create tenant for each existing user
INSERT INTO tenants (name, owner_user_id, plan, status)
SELECT 
  COALESCE(email, 'User') || '''s Organization',
  id,
  'free',
  'provisioning'
FROM auth.users;

-- Create memberships
INSERT INTO tenant_members (tenant_id, user_id, role)
SELECT t.id, t.owner_user_id, 'owner'
FROM tenants t;

-- Trigger provisioning for each tenant
-- (Call /api/provision-tenant for each tenant_id)
```

### 8. Test the Migration

1. **Sign in as existing user**
   - Should be redirected to onboarding
   - Tenant should be auto-created
   - Agents should be provisioned

2. **Create new user**
   - Sign up flow should work
   - Onboarding should create tenant
   - Dashboard should show agents

3. **Test tenant isolation**
   - Create two users with separate tenants
   - Verify User A cannot access User B's data
   - Check API routes enforce tenant scoping

4. **Test Stripe integration**
   - Create checkout session
   - Complete payment in test mode
   - Verify tenant upgraded to pro plan
   - Check provisioning triggered

## API Changes

### Protected Routes

All dashboard API routes now require authentication and tenant context:

- `/api/dashboard/agents` - Returns tenant-scoped agents
- `/api/dashboard/activity` - Returns tenant-scoped activity
- `/api/dashboard/status` - Returns tenant-scoped status
- `/api/chat` - Stores messages per tenant
- `/api/sms` - Routes SMS to correct tenant

### New Routes

- `/api/auth/first-login` - Auto-create tenant on first login
- `/api/billing/checkout` - Create Stripe checkout session
- `/api/stripe/webhook` - Handle Stripe events
- `/api/provision-tenant` - Provision agents and tools

## Middleware Changes

The middleware now:
1. Checks for tenant membership
2. Redirects to onboarding if no tenant
3. Sets `active_tenant_id` cookie
4. Protects `/onboarding` route

## Onboarding Flow

New users experience:
1. Sign up / Sign in
2. Redirected to `/onboarding`
3. Tenant auto-created via `/api/auth/first-login`
4. Agents provisioned automatically
5. Redirected to dashboard

## Tenant Switching

Users in multiple tenants can switch between them:
1. Call `setActiveTenant(tenantId)` from `src/lib/tenant.ts`
2. Cookie `active_tenant_id` is updated
3. All subsequent requests use new tenant context

## Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS policies enforcing tenant isolation
2. **API Middleware**: All protected routes use `withTenant()` wrapper
3. **Secrets**: Third-party credentials stored in AWS Secrets Manager (ARN only in DB)
4. **Rate Limiting**: Basic per-tenant rate limiting implemented
5. **Activity Logging**: All actions logged with tenant_id and agent_id

## Monitoring

Activity logs include:
- `tenant_id` - Which tenant performed action
- `agent_id` - Which agent performed action
- `user_id` - Which user performed action
- `action` - What action was performed
- `metadata` - Additional context

Query recent activity:
```sql
SELECT * FROM activity_log 
WHERE tenant_id = 'xxx' 
ORDER BY created_at DESC 
LIMIT 100;
```

## Troubleshooting

### User stuck in onboarding loop
```sql
-- Check if tenant exists
SELECT * FROM tenants WHERE owner_user_id = 'user_id';

-- Check if membership exists
SELECT * FROM tenant_members WHERE user_id = 'user_id';

-- Manually create if missing
INSERT INTO tenants (name, owner_user_id) VALUES ('Company', 'user_id');
INSERT INTO tenant_members (tenant_id, user_id, role) 
VALUES ('tenant_id', 'user_id', 'owner');
```

### Agents not showing up
```sql
-- Check provisioning status
SELECT status FROM tenants WHERE id = 'tenant_id';

-- Check agents
SELECT * FROM agents WHERE tenant_id = 'tenant_id';

-- Re-trigger provisioning
-- POST to /api/provision-tenant with {"tenantId": "xxx"}
```

### SMS not routing correctly
```sql
-- Check inbound channels
SELECT * FROM inbound_channels WHERE kind = 'sms';

-- Add channel mapping
INSERT INTO inbound_channels (tenant_id, kind, address)
VALUES ('tenant_id', 'sms', '+1234567890');
```

## Rollback Plan

If issues occur, you can rollback:

1. **Revert code changes**
   ```bash
   git checkout feature/initial-implementation
   ```

2. **Keep database** (data preserved)
   - New tables won't affect old code
   - Old code will continue working without tenant scoping

3. **Full rollback** (if needed)
   ```sql
   DROP TABLE IF EXISTS activity_log CASCADE;
   DROP TABLE IF EXISTS messages CASCADE;
   DROP TABLE IF EXISTS tasks CASCADE;
   DROP TABLE IF EXISTS inbound_channels CASCADE;
   DROP TABLE IF EXISTS agent_tools CASCADE;
   DROP TABLE IF EXISTS agents CASCADE;
   DROP TABLE IF EXISTS tenant_members CASCADE;
   DROP TABLE IF EXISTS tenants CASCADE;
   ```

## Next Steps

After migration:
1. Configure Stripe products and pricing
2. Set up AWS Secrets Manager
3. Configure inbound email/SMS routing
4. Add tenant switcher UI (if needed)
5. Implement enterprise features (dedicated resources)
6. Add usage analytics per tenant
7. Implement tenant-specific rate limits
8. Add billing portal for subscription management

## Support

For issues or questions:
- Check Supabase logs for database errors
- Check Vercel logs for API errors
- Check Stripe dashboard for payment issues
- Review activity_log table for audit trail
