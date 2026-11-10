-- Run with `supabase test db` against an isolated local Supabase instance.
-- The transaction rolls back fixtures. Requires the complete migration history.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SET search_path = public, extensions;
SELECT plan(15);

INSERT INTO auth.users(id, email) VALUES
 ('10000000-0000-0000-0000-000000000001','rls-staff@example.invalid'),
 ('10000000-0000-0000-0000-000000000002','rls-driver@example.invalid');
INSERT INTO drivers(id,name,dni,phone,license) VALUES
 ('20000000-0000-0000-0000-000000000001','Own driver','10000001','900000001','RLS-LIC-1'),
 ('20000000-0000-0000-0000-000000000002','Other driver','10000002','900000002','RLS-LIC-2');
INSERT INTO vehicles(id,code,plate,type,brand,model,capacity_kg,capacity_m3,driver_id) VALUES
 ('30000000-0000-0000-0000-000000000001','RLS-V1','RLS-001','van','Test','Test',100,10,'20000000-0000-0000-0000-000000000001'),
 ('30000000-0000-0000-0000-000000000002','RLS-V2','RLS-002','van','Test','Test',100,10,'20000000-0000-0000-0000-000000000002');
UPDATE drivers SET vehicle_id='30000000-0000-0000-0000-000000000001' WHERE id='20000000-0000-0000-0000-000000000001';
UPDATE drivers SET vehicle_id='30000000-0000-0000-0000-000000000002' WHERE id='20000000-0000-0000-0000-000000000002';
INSERT INTO profiles(id,name,role,driver_id) VALUES
 ('10000000-0000-0000-0000-000000000001','Staff','admin',NULL),
 ('10000000-0000-0000-0000-000000000002','Driver','driver','20000000-0000-0000-0000-000000000001');
INSERT INTO clients(id,name,phone,street,district) VALUES
 ('40000000-0000-0000-0000-000000000001','Own client','900000001','Lima','Lima'),
 ('40000000-0000-0000-0000-000000000002','Other client','900000002','Lima','Lima');
INSERT INTO orders(id,code,client_id,phone,street,district,delivery_date,time_window_start,time_window_end,driver_id) VALUES
 ('50000000-0000-0000-0000-000000000001','RLS-O1','40000000-0000-0000-0000-000000000001','900000001','Lima','Lima','2026-10-26','09:00','12:00','20000000-0000-0000-0000-000000000001'),
 ('50000000-0000-0000-0000-000000000002','RLS-O2','40000000-0000-0000-0000-000000000002','900000002','Lima','Lima','2026-10-26','09:00','12:00','20000000-0000-0000-0000-000000000002');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
SELECT set_config('request.jwt.claims','{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated"}',true);
SELECT is((SELECT count(*) FROM drivers WHERE id::text LIKE '20000000-%'),1::bigint,'Driver sees own driver row');
SELECT is((SELECT count(*) FROM vehicles WHERE id::text LIKE '30000000-%'),1::bigint,'Driver sees assigned vehicle');
SELECT is((SELECT count(*) FROM orders WHERE id::text LIKE '50000000-%'),1::bigint,'Driver sees assigned orders');
SELECT is((SELECT count(*) FROM clients WHERE id::text LIKE '40000000-%'),1::bigint,'Driver sees assigned clients');
SELECT is((SELECT count(*) FROM profiles WHERE id::text LIKE '10000000-%'),1::bigint,'Profile lookup remains private');
SELECT throws_ok($$UPDATE orders SET status='delivered' WHERE code='RLS-O2'$$,'42501',NULL,'Direct updates denied');
SELECT throws_ok($$DELETE FROM vehicles WHERE code='RLS-V2'$$,'42501',NULL,'Direct deletes denied');
SELECT throws_ok($$INSERT INTO clients(name,phone,street,district) VALUES ('Attack','1','X','X')$$,'42501',NULL,'Direct inserts denied');
SELECT throws_ok($$UPDATE profiles SET role='admin'$$,'42501',NULL,'Cannot escalate own role');

RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
SELECT set_config('request.jwt.claims','{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}',true);
SELECT is((SELECT count(*) FROM orders WHERE id::text LIKE '50000000-%'),2::bigint,'Staff can read both orders');
SELECT throws_ok($$UPDATE orders SET status='delivered' WHERE code='RLS-O1'$$,'42501',NULL,'Staff also writes only through API');

RESET ROLE;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claim.sub','',true);
SELECT set_config('request.jwt.claims','{}',true);
SELECT throws_ok($$SELECT * FROM orders$$,'42501',NULL,'Anonymous orders denied');
SELECT throws_ok($$SELECT * FROM profiles$$,'42501',NULL,'Anonymous profiles denied');
SELECT throws_ok($$SELECT * FROM vehicles$$,'42501',NULL,'Anonymous vehicles denied');
SELECT throws_ok($$SELECT * FROM clients$$,'42501',NULL,'Anonymous clients denied');
RESET ROLE;
SELECT * FROM finish();
ROLLBACK;
