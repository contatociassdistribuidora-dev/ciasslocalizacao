import { supabase } from '@/src/lib/supabase/client';

export type ProfileRecord = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  role?: 'admin' | 'operator' | 'viewer' | null;
  active?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export async function getCurrentProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  return data as ProfileRecord | null;
}

export async function updateProfile(id: string, payload: Partial<ProfileRecord>) {
  const { data, error } = await supabase.from('profiles').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as ProfileRecord;
}
