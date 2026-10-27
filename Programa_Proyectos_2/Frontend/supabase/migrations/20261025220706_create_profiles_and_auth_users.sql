/*
# Crear tabla profiles y usuarios de autenticación

## Resumen
Migra el login del sistema a autenticación real de Supabase. Se crea `profiles` que extiende
`auth.users` con rol (admin/operator/driver) y relación opcional con conductores.

## Tablas nuevas
- `profiles`: id (FK auth.users), name, role (CHECK admin/operator/driver),
  driver_id (FK drivers), avatar_initials, created_at.

## Usuarios creados
1. admin@distrirapido.pe — admin — Ana Rodríguez
2. operador@distrirapido.pe — operator — Luis Fernández
3. conductor@distrirapido.pe — driver — Carlos Mendoza
Contraseña de los tres: demo1234 (cambiar desde el panel de Supabase).

## Seguridad
- RLS habilitado en profiles.
- SELECT solo a authenticated, solo su propio perfil (auth.uid() = id).
- Sin políticas INSERT/UPDATE/DELETE: solo service_role modifica perfiles.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO drivers (id, name, dni, phone, license, license_type, status, available, shift_start, shift_end, avatar_initials)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Carlos Mendoza', '45678912', '999887766', 'LIC-CD-001', 'B-II',
  'available', true, '08:00', '16:00', 'CM'
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'driver' CHECK (role IN ('admin', 'operator', 'driver')),
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  avatar_initials text NOT NULL DEFAULT 'XX',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_sso_user,
  email_change, email_change_token_current, email_change_confirm_status, banned_until
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  u.uid, 'authenticated', 'authenticated', u.email,
  crypt('demo1234', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb, false,
  '', '', 0, null
FROM (VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin@distrirapido.pe'),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'operador@distrirapido.pe'),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'conductor@distrirapido.pe')
) AS u(uid, email)
WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.email = u.email);

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
SELECT
  gen_random_uuid(),
  u.uid, u.uid::text, 'email',
  jsonb_build_object('sub', u.uid::text, 'email', u.email, 'email_verified', true),
  now(), now(), now()
FROM (VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin@distrirapido.pe'),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'operador@distrirapido.pe'),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'conductor@distrirapido.pe')
) AS u(uid, email)
WHERE NOT EXISTS (SELECT 1 FROM auth.identities ai WHERE ai.user_id = u.uid);

INSERT INTO profiles (id, name, role, driver_id, avatar_initials)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Ana Rodríguez', 'admin', NULL, 'AR'),
  ('a0000000-0000-0000-0000-000000000002', 'Luis Fernández', 'operator', NULL, 'LF'),
  ('a0000000-0000-0000-0000-000000000003', 'Carlos Mendoza', 'driver', 'a0000000-0000-0000-0000-000000000001', 'CM')
ON CONFLICT (id) DO NOTHING;
