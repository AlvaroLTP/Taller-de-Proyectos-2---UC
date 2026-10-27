/*
# Restringir RLS a usuarios autenticados

## Resumen
La aplicacion ahora requiere inicio de sesion con Supabase Auth. Las tablas operativas
tenian politicas USING (true) que permitian acceso total anonimo (cualquiera con la anon key
podia leer, crear, modificar y borrar todos los datos). Esta migracion elimina esas politicas
y las reemplaza por politicas que solo permiten acceso a usuarios autenticados.

## Cambios de seguridad
- vehicles, drivers, clients, orders, routes, parameters, notifications:
  - Se eliminan las politicas "anon_*" que usaban USING (true) / WITH CHECK (true).
  - Se crean nuevas politicas "auth_*" con TO authenticated USING (true) / WITH CHECK (true).
  - Como la app requiere inicio de sesion y los datos operativos son compartidos entre
    administradores y operadores, USING (true) es aceptable aqui: cualquier usuario
    autenticado puede leer y modificar los datos operativos. La autenticacion es la barrera.
- profiles: sin cambios (ya estaba restringida a auth.uid() = id).
- Se revocan los grants a anon en todas las tablas operativas; solo se concede a authenticated.
- Se mantiene el grant a service_role (usado por migraciones y edge functions).

## Notas importantes
1. Esta migracion NO borra datos. Solo ajusta politicas y grants.
2. Si una sesion anonima intenta acceder a las tablas, recibira permiso denegado.
3. Los usuarios autenticados (admin, operator, driver) pueden seguir operando con normalidad.
4. No se implementa segregacion por rol dentro de las tablas operativas porque todos los roles
   autenticados comparten los mismos datos logisticos. Si en el futuro se necesita que un
   conductor solo vea sus propias rutas, se puede anadir una politica adicional.
*/

-- ============================================================
-- VEHICLES
-- ============================================================
REVOKE ALL ON vehicles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON vehicles TO authenticated;

DROP POLICY IF EXISTS "anon_select_vehicles" ON vehicles;
DROP POLICY IF EXISTS "anon_insert_vehicles" ON vehicles;
DROP POLICY IF EXISTS "anon_update_vehicles" ON vehicles;
DROP POLICY IF EXISTS "anon_delete_vehicles" ON vehicles;

CREATE POLICY "auth_select_vehicles" ON vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_vehicles" ON vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_vehicles" ON vehicles FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DRIVERS
-- ============================================================
REVOKE ALL ON drivers FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON drivers TO authenticated;

DROP POLICY IF EXISTS "anon_select_drivers" ON drivers;
DROP POLICY IF EXISTS "anon_insert_drivers" ON drivers;
DROP POLICY IF EXISTS "anon_update_drivers" ON drivers;
DROP POLICY IF EXISTS "anon_delete_drivers" ON drivers;

CREATE POLICY "auth_select_drivers" ON drivers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_drivers" ON drivers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_drivers" ON drivers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_drivers" ON drivers FOR DELETE TO authenticated USING (true);

-- ============================================================
-- CLIENTS
-- ============================================================
REVOKE ALL ON clients FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO authenticated;

DROP POLICY IF EXISTS "anon_select_clients" ON clients;
DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
DROP POLICY IF EXISTS "anon_update_clients" ON clients;
DROP POLICY IF EXISTS "anon_delete_clients" ON clients;

CREATE POLICY "auth_select_clients" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_clients" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_clients" ON clients FOR DELETE TO authenticated USING (true);

-- ============================================================
-- ORDERS
-- ============================================================
REVOKE ALL ON orders FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;

CREATE POLICY "auth_select_orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE TO authenticated USING (true);

-- ============================================================
-- ROUTES
-- ============================================================
REVOKE ALL ON routes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON routes TO authenticated;

DROP POLICY IF EXISTS "anon_select_routes" ON routes;
DROP POLICY IF EXISTS "anon_insert_routes" ON routes;
DROP POLICY IF EXISTS "anon_update_routes" ON routes;
DROP POLICY IF EXISTS "anon_delete_routes" ON routes;

CREATE POLICY "auth_select_routes" ON routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_routes" ON routes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_routes" ON routes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_routes" ON routes FOR DELETE TO authenticated USING (true);

-- ============================================================
-- PARAMETERS
-- ============================================================
REVOKE ALL ON parameters FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON parameters TO authenticated;

DROP POLICY IF EXISTS "anon_select_parameters" ON parameters;
DROP POLICY IF EXISTS "anon_insert_parameters" ON parameters;
DROP POLICY IF EXISTS "anon_update_parameters" ON parameters;
DROP POLICY IF EXISTS "anon_delete_parameters" ON parameters;

CREATE POLICY "auth_select_parameters" ON parameters FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_parameters" ON parameters FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_parameters" ON parameters FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_parameters" ON parameters FOR DELETE TO authenticated USING (true);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
REVOKE ALL ON notifications FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;

DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;

CREATE POLICY "auth_select_notifications" ON notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_notifications" ON notifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_notifications" ON notifications FOR DELETE TO authenticated USING (true);

-- ============================================================
-- PROFILES: revocar grants excesivos a anon
-- ============================================================
REVOKE ALL ON profiles FROM anon;
