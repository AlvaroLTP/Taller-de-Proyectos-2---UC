-- Operational data is served exclusively by FastAPI with per-user authorization.
-- Run as the migration owner. The backend DATABASE_URL must use a trusted server
-- role (table owner / BYPASSRLS); never expose that role in VITE_* variables.
BEGIN;
DO $$
DECLARE
  table_name text;
  policy_row record;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'vehicles', 'drivers', 'clients', 'orders', 'routes', 'parameters', 'notifications'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', table_name);
    FOR policy_row IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = table_name
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, table_name);
    END LOOP;
  END LOOP;
END $$;

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- No browser can change a role or driver assignment.
DO $$
DECLARE policy_row record;
BEGIN
  FOR policy_row IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.profiles', policy_row.policyname);
  END LOOP;
END $$;
CREATE POLICY select_own_profile ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
COMMIT;
