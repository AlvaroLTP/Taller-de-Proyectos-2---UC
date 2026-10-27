import { supabase } from './supabase';
import type { User, UserRole } from '@/types';

interface ProfileRow {
  id: string;
  name: string;
  role: UserRole;
  driver_id: string | null;
  avatar_initials: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('No se pudo iniciar sesión');

    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!profile) throw new Error('Perfil no encontrado. Contacte al administrador.');

    const p = profile as ProfileRow;
    return {
      id: p.id,
      name: p.name,
      email: data.user.email || '',
      role: p.role,
      driverId: p.driver_id || undefined,
      avatarInitials: p.avatar_initials,
    };
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    if (error || !profile) return null;

    const p = profile as ProfileRow;
    return {
      id: p.id,
      name: p.name,
      email: session.user.email || '',
      role: p.role,
      driverId: p.driver_id || undefined,
      avatarInitials: p.avatar_initials,
    };
  },
};
