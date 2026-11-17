import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ signIn: vi.fn(), signOut: vi.fn(), getSession: vi.fn(), getUser: vi.fn(), profile: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: {
  auth: { signInWithPassword: mocks.signIn, signOut: mocks.signOut, getSession: mocks.getSession, getUser: mocks.getUser },
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.profile }) }) }),
} }));
import { authService } from './auth';
beforeEach(() => {
  mocks.signIn.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } }, error: null });
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.profile.mockResolvedValue({ data: { id: 'user-1', name: 'User', role: 'driver', driver_id: 'driver-1', avatar_initials: 'US' }, error: null });
  mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null });
  mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } }, error: null });
});
describe('profile authorization', () => {
  it('maps a valid driver profile', async () => {
    expect(await authService.signIn('test@example.com', 'password')).toMatchObject({ role: 'driver', driverId: 'driver-1' });
  });
  it.each([null, { id: 'user-1', role: 'root' }, { id: 'user-1', role: 'driver', driver_id: null }, { id: 'another', role: 'admin' }])('clears sessions with unauthorized profiles: %s', async (profile) => {
    mocks.profile.mockResolvedValue({ data: profile, error: null });
    await expect(authService.signIn('test@example.com', 'password')).rejects.toThrow('Perfil');
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });
  it('verifies restored sessions with the auth server', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error('expired') });
    expect(await authService.getCurrentUser()).toBeNull();
    expect(mocks.profile).not.toHaveBeenCalled();
  });
  it('does not query a profile when signed out', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    expect(await authService.getCurrentUser()).toBeNull();
    expect(mocks.getUser).not.toHaveBeenCalled();
  });
});
