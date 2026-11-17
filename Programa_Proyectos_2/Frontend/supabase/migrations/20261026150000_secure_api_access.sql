-- Apply after the three existing migrations. Run inside a transaction.
BEGIN;
CREATE OR REPLACE FUNCTION public.eco_is_staff() RETURNS boolean
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','operator'));
$$;
CREATE OR REPLACE FUNCTION public.eco_driver_id() RETURNS uuid
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
 SELECT driver_id FROM public.profiles WHERE id = auth.uid() AND role = 'driver';
$$;
REVOKE ALL ON FUNCTION public.eco_is_staff(), public.eco_driver_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eco_is_staff(), public.eco_driver_id() TO authenticated;
DO $$
DECLARE item record;
BEGIN
 FOR item IN SELECT tablename, policyname FROM pg_policies WHERE schemaname='public'
   AND tablename IN ('vehicles','drivers','clients','orders','routes','parameters','notifications') LOOP
   EXECUTE format('DROP POLICY %I ON public.%I', item.policyname, item.tablename);
 END LOOP;
END $$;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vehicles FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.vehicles FROM authenticated;
GRANT SELECT ON public.vehicles TO authenticated;
CREATE POLICY scoped_read_vehicles ON public.vehicles FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (id IN (SELECT vehicle_id FROM public.drivers WHERE id = public.eco_driver_id())));
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.drivers FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.drivers FROM authenticated;
GRANT SELECT ON public.drivers TO authenticated;
CREATE POLICY scoped_read_drivers ON public.drivers FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (id = public.eco_driver_id()));
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.clients FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.clients FROM authenticated;
GRANT SELECT ON public.clients TO authenticated;
CREATE POLICY scoped_read_clients ON public.clients FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (id IN (SELECT client_id FROM public.orders WHERE driver_id = public.eco_driver_id())));
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.orders FROM authenticated;
GRANT SELECT ON public.orders TO authenticated;
CREATE POLICY scoped_read_orders ON public.orders FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (driver_id = public.eco_driver_id()));
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.routes FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.routes FROM authenticated;
GRANT SELECT ON public.routes TO authenticated;
CREATE POLICY scoped_read_routes ON public.routes FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (driver_id = public.eco_driver_id()));
ALTER TABLE public.parameters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.parameters FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.parameters FROM authenticated;
GRANT SELECT ON public.parameters TO authenticated;
CREATE POLICY scoped_read_parameters ON public.parameters FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (true));
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.notifications FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.notifications FROM authenticated;
GRANT SELECT ON public.notifications TO authenticated;
CREATE POLICY scoped_read_notifications ON public.notifications FOR SELECT TO authenticated
 USING (public.eco_is_staff() OR (false));
REVOKE ALL ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
COMMIT;
