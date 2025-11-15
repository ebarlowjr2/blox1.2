
SELECT 'Existing tables:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema='public' 
AND table_name IN ('messages','tasks','agents','agent_tools','inbound_channels','activity_log','tenants','tenant_members')
ORDER BY table_name;

SELECT 'Messages table columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='messages'
ORDER BY ordinal_position;

SELECT 'Tasks table columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='tasks'
ORDER BY ordinal_position;

SELECT 'Extensions:' as info;
SELECT extname FROM pg_extension WHERE extname = 'pgcrypto';
