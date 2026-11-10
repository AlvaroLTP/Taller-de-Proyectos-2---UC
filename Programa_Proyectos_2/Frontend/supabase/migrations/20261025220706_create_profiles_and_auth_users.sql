-- Profiles are provisioned by an administrator; no shared demo passwords.
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
