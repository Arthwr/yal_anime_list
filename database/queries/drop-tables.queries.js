const drop = `
-- Disable all foreign key constraints temporarily
SET session_replication_role = replica;

-- Drop all tables in the public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS public."' || r.tablename || '" CASCADE';
  END LOOP;
END $$;

-- Reset session replication role
SET session_replication_role = DEFAULT;
`;
