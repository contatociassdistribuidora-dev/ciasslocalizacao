import { supabase } from '@/src/lib/supabase/client';

export type LocationRecord = {
  id: string;
  name: string;
  document_number?: string | null;
  category?: string | null;
  address?: string | null;
  address_number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contact_name?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  status?: 'active' | 'inactive' | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export async function getLocations() {
  const { data, error } = await supabase.from('locations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as LocationRecord[];
}

export async function createLocation(payload: Partial<LocationRecord>) {
  const { data, error } = await supabase.from('locations').insert(payload).select().single();
  if (error) throw error;
  return data as LocationRecord;
}

export async function updateLocation(id: string, payload: Partial<LocationRecord>) {
  const { data, error } = await supabase.from('locations').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as LocationRecord;
}

export async function deleteLocation(id: string) {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw error;
}
