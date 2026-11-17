export function createRequester(baseUrl: string, getToken: () => Promise<string | undefined>, transport: typeof fetch = fetch) {
  return async function request<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
    const token = await getToken();
    if (!token) throw new Error('Inicie sesión para continuar');
    let response: Response;
    try {
      response = await transport(`${baseUrl.replace(/\/$/, '')}${path}`, {
        method, headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (error) {
      if (error instanceof TypeError) throw new Error('No se pudo conectar con la API. Compruebe que el backend esté iniciado y que VITE_API_URL sea correcto.');
      throw error;
    }
    const data = response.status === 204 ? undefined : await response.json().catch(() => undefined);
    if (!response.ok) {
      const detail: unknown = data?.detail;
      const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? 'Revise los campos: hay datos inválidos' : 'No se pudo completar la operación';
      throw new Error(message);
    }
    return data as T;
  };
}
