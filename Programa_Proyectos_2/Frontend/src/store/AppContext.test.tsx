import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@/types';
const mock = vi.hoisted(() => ({ getUser: vi.fn(), signOut: vi.fn(), event: vi.fn(), getAll: vi.fn(), getParameters: vi.fn(), metrics: vi.fn(), schedules: vi.fn() }));
vi.mock('@/services/auth', () => ({ authService: { getCurrentUser: mock.getUser, signOut: mock.signOut } }));
vi.mock('@/services/supabase', () => ({ supabase: { auth: { onAuthStateChange: (callback: unknown) => { mock.event(callback); return { data: { sub: null, subscription: { unsubscribe: vi.fn() } } }; } } } }));
vi.mock('@/services/api', () => ({
  vehicleService: { getAll: mock.getAll }, driverService: { getAll: mock.getAll, getSchedules: mock.schedules },
  clientService: { getAll: mock.getAll }, orderService: { getAll: mock.getAll }, routeService: { getAll: mock.getAll },
  parameterService: { get: mock.getParameters }, notificationService: { getAll: mock.getAll }, sustainabilityService: { getMetrics: mock.metrics },
}));
import { AppProvider, useApp } from './AppContext';
const user: User = { id: 'u1', name: 'User', email: 'user@example.com', role: 'admin', avatarInitials: 'US' };
afterEach(cleanup);
beforeEach(() => {
  mock.getUser.mockResolvedValue(user); mock.signOut.mockResolvedValue(undefined);
  mock.getAll.mockResolvedValue([{ id: 'private-data' }]); mock.getParameters.mockResolvedValue({});
  mock.metrics.mockResolvedValue(null); mock.schedules.mockResolvedValue([]);
});
describe('session data isolation', () => {
  it('clears operational data when signed out', async () => {
    const { result } = renderHook(useApp, { wrapper: AppProvider });
    await waitFor(() => expect(result.current.vehicles).toHaveLength(1));
    await act(async () => { await result.current.signOut(); });
    expect(result.current.currentUser).toBeNull();
    expect(result.current.vehicles).toEqual([]); expect(result.current.clients).toEqual([]);
    expect(result.current.orders).toEqual([]); expect(result.current.routes).toEqual([]);
  });
  it('discards requests that finish after logout', async () => {
    let complete!: (value: { id: string }[]) => void;
    const pending = new Promise<{ id: string }[]>(resolve => { complete = resolve; });
    mock.getAll.mockReturnValue(pending);
    const { result } = renderHook(useApp, { wrapper: AppProvider });
    await waitFor(() => expect(result.current.currentUser?.id).toBe('u1'));
    await act(async () => { await result.current.signOut(); });
    await act(async () => { complete([{ id: 'old-private-data' }]); await pending; });
    expect(result.current.vehicles).toEqual([]); expect(result.current.currentUser).toBeNull();
  });
  it('finishes initialization if session restoration fails', async () => {
    mock.getUser.mockRejectedValue(new Error('offline'));
    const { result } = renderHook(useApp, { wrapper: AppProvider });
    await waitFor(() => expect(result.current.authReady).toBe(true));
    expect(result.current.currentUser).toBeNull(); expect(result.current.loading).toBe(false);
  });
});
