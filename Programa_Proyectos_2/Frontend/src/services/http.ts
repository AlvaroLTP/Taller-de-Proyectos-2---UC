import { supabase } from './supabase';
import { createRequester } from './httpClient';
export const apiRequest = createRequester(import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1', async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.access_token;
});
