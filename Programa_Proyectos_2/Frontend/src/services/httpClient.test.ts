import { describe, expect, it, vi } from 'vitest';
import { createRequester } from './httpClient';

describe('authenticated API requests', () => {
  it('explains connection failures instead of exposing Failed to fetch', async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(createRequester('/api/v1', async () => 'token', fetcher)('/orders/')).rejects.toThrow('backend esté iniciado');
  });
  it('rejects missing sessions before sending data', async () => {
    const fetcher = vi.fn();
    await expect(createRequester('/api/v1', async () => undefined, fetcher)('/orders/')).rejects.toThrow('Inicie sesión');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('sends bearer tokens and omits undefined patch fields', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    await createRequester('/api/v1/', async () => 'token', fetcher)('/vehicles/1', 'PATCH', { available: false, driver_id: undefined });
    expect(fetcher).toHaveBeenCalledWith('/api/v1/vehicles/1', expect.objectContaining({
      headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' }, body: '{"available":false}',
    }));
  });
  it.each([401, 403, 404, 409])('propagates denied requests (%s)', async (status) => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{"detail":"Acceso rechazado"}', { status }));
    await expect(createRequester('/api', async () => 't', fetcher)('/orders')).rejects.toThrow('Acceso rechazado');
  });
  it('does not expose validation payloads', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{"detail":[{"input":"private"}]}', { status: 422 }));
    await expect(createRequester('/api', async () => 't', fetcher)('/orders')).rejects.toThrow('Revise los campos');
  });
  it('handles empty success responses', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    await expect(createRequester('/api', async () => 't', fetcher)('/orders/1', 'DELETE')).resolves.toBeUndefined();
  });
  it('handles server responses that contain no JSON', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('private stack trace', { status: 500 }));
    await expect(createRequester('/api', async () => 't', fetcher)('/orders')).rejects.toThrow('No se pudo completar');
  });
});
