import { supabase } from './supabase';
import type { User, UserRole } from '@/types';
interface ProfileRow { id: string; name: string; role: UserRole; driver_id: string | null; avatar_initials: string }
async function loadProfile(id: string, email: string): Promise<User> {
  const { data, error } = await supabase.from('profiles').select('id,name,role,driver_id,avatar_initials').eq('id', id).maybeSingle();
  if (error) throw error;
  const p = data as ProfileRow | null;
  if (!p || p.id !== id || !['admin','operator','driver'].includes(p.role) || (p.role === 'driver' && !p.driver_id)) {
    throw new Error('Perfil no encontrado o no autorizado. Contacte al administrador.');
  }
  return { id: p.id, name: p.name, email, role: p.role, driverId: p.driver_id || undefined, avatarInitials: p.avatar_initials };
}
export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    try {
      if (!data.user) throw new Error('No se pudo iniciar sesión');
      return await loadProfile(data.user.id, data.user.email || '');
    } catch (error) {
      await supabase.auth.signOut({ scope: 'local' });
      throw error;
    }
  },
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  },
  async getCurrentUser(): Promise<User | null> {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return loadProfile(data.user.id, data.user.email || '');
  },
};
