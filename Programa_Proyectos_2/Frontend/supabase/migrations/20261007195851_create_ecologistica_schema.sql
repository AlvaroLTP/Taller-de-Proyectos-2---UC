/*
# EcoLogística Lima - Schema completo

## Tablas nuevas:
- vehicles: flota de vehículos
- drivers: conductores
- clients: clientes con direcciones
- orders: pedidos de entrega con preferencias
- routes: rutas planificadas con paradas
- parameters: parámetros operativos (una sola fila)
- notifications: notificaciones del sistema

## Seguridad:
- RLS habilitado en todas las tablas
- Políticas anon+authenticated para CRUD (app sin auth real todavía, usa login simulado)
*/

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  plate text NOT NULL,
  type text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  capacity_kg numeric NOT NULL DEFAULT 0,
  capacity_m3 numeric NOT NULL DEFAULT 0,
  consumption_km_per_l numeric NOT NULL DEFAULT 0,
  fuel_type text NOT NULL DEFAULT 'diesel',
  emissions_per_km numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  available boolean NOT NULL DEFAULT true,
  driver_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_vehicles" ON vehicles;
CREATE POLICY "anon_select_vehicles" ON vehicles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_vehicles" ON vehicles;
CREATE POLICY "anon_insert_vehicles" ON vehicles FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_vehicles" ON vehicles;
CREATE POLICY "anon_update_vehicles" ON vehicles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_vehicles" ON vehicles;
CREATE POLICY "anon_delete_vehicles" ON vehicles FOR DELETE TO anon, authenticated USING (true);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dni text NOT NULL,
  phone text NOT NULL,
  license text NOT NULL,
  license_type text NOT NULL DEFAULT 'B-II',
  status text NOT NULL DEFAULT 'available',
  available boolean NOT NULL DEFAULT true,
  vehicle_id uuid,
  shift_start text NOT NULL DEFAULT '08:00',
  shift_end text NOT NULL DEFAULT '16:00',
  avatar_initials text NOT NULL DEFAULT 'XX',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_drivers" ON drivers;
CREATE POLICY "anon_select_drivers" ON drivers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_drivers" ON drivers;
CREATE POLICY "anon_insert_drivers" ON drivers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_drivers" ON drivers;
CREATE POLICY "anon_update_drivers" ON drivers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_drivers" ON drivers;
CREATE POLICY "anon_delete_drivers" ON drivers FOR DELETE TO anon, authenticated USING (true);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  street text NOT NULL,
  reference text DEFAULT '',
  district text NOT NULL,
  neighborhood text DEFAULT '',
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  indications text DEFAULT '',
  access_type text NOT NULL DEFAULT 'Fácil',
  priority text NOT NULL DEFAULT 'medium',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_clients" ON clients;
CREATE POLICY "anon_select_clients" ON clients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_clients" ON clients;
CREATE POLICY "anon_update_clients" ON clients FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_clients" ON clients;
CREATE POLICY "anon_delete_clients" ON clients FOR DELETE TO anon, authenticated USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  phone text NOT NULL,
  street text NOT NULL,
  reference text DEFAULT '',
  district text NOT NULL,
  neighborhood text DEFAULT '',
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  indications text DEFAULT '',
  access_type text NOT NULL DEFAULT 'Fácil',
  delivery_date text NOT NULL,
  time_window_start text NOT NULL,
  time_window_end text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  weight_kg numeric NOT NULL DEFAULT 0,
  volume_m3 numeric NOT NULL DEFAULT 0,
  product_type text NOT NULL DEFAULT 'Abarrotes',
  observations text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  preferred_time text NOT NULL DEFAULT '09:00',
  pref_time_window_start text NOT NULL DEFAULT '09:00',
  pref_time_window_end text NOT NULL DEFAULT '12:00',
  restrictions text[] NOT NULL DEFAULT '{}',
  requires_special_attention boolean NOT NULL DEFAULT false,
  no_lunch_hours boolean NOT NULL DEFAULT false,
  requires_phone_coordination boolean NOT NULL DEFAULT false,
  pref_observations text DEFAULT '',
  route_id text,
  delivery_order integer,
  driver_id uuid,
  delivered_at timestamptz,
  incident_reason text,
  incident_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);

-- Routes
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  driver_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  date text NOT NULL,
  total_distance_km numeric NOT NULL DEFAULT 0,
  estimated_time_min integer NOT NULL DEFAULT 0,
  departure_time text NOT NULL,
  estimated_arrival_time text NOT NULL,
  emissions_kg_co2 numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  completed_deliveries integer NOT NULL DEFAULT 0,
  total_deliveries integer NOT NULL DEFAULT 0,
  stops jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_routes" ON routes;
CREATE POLICY "anon_select_routes" ON routes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_routes" ON routes;
CREATE POLICY "anon_insert_routes" ON routes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_routes" ON routes;
CREATE POLICY "anon_update_routes" ON routes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_routes" ON routes;
CREATE POLICY "anon_delete_routes" ON routes FOR DELETE TO anon, authenticated USING (true);

-- Parameters (single row)
CREATE TABLE IF NOT EXISTS parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  max_vehicle_capacity_kg numeric NOT NULL DEFAULT 4500,
  max_weight_kg numeric NOT NULL DEFAULT 4500,
  max_volume_m3 numeric NOT NULL DEFAULT 20,
  average_speed_km_h numeric NOT NULL DEFAULT 25,
  max_operation_time_h numeric NOT NULL DEFAULT 8,
  estimated_consumption_km_per_l numeric NOT NULL DEFAULT 9.5,
  emission_factor numeric NOT NULL DEFAULT 2.68,
  fuel_type text NOT NULL DEFAULT 'diesel',
  max_distance_km numeric NOT NULL DEFAULT 120,
  max_deliveries_per_route integer NOT NULL DEFAULT 15
);

ALTER TABLE parameters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_parameters" ON parameters;
CREATE POLICY "anon_select_parameters" ON parameters FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_parameters" ON parameters;
CREATE POLICY "anon_insert_parameters" ON parameters FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_parameters" ON parameters;
CREATE POLICY "anon_update_parameters" ON parameters FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_parameters" ON parameters;
CREATE POLICY "anon_delete_parameters" ON parameters FOR DELETE TO anon, authenticated USING (true);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications FOR DELETE TO anon, authenticated USING (true);
