import { supabase } from './supabase';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

export async function request<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session?.access_token) throw new ApiError('Inicie sesión para continuar.', 401);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const payload = response.status === 204 ? null : await response.json();
    if (!response.ok) {
      const detail = payload?.detail;
      const message = typeof detail === 'string' ? detail
        : Array.isArray(detail) ? detail.map((item: { msg: string }) => item.msg).join('; ')
        : `La API respondió con error ${response.status}.`;
      throw new ApiError(message, response.status);
    }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) throw new Error('La API tardó demasiado en responder. Intente nuevamente.');
    if (error instanceof TypeError) throw new Error('No se pudo conectar con la API. Compruebe que el backend esté iniciado.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
