import { supabase } from '@/src/lib/supabase/client';

export async function createVisit(payload: Record<string, unknown>) {
  const { data, error } = await supabase.from('visits').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function getVisitsByLocation(locationId: string) {
  const { data, error } = await supabase.from('visits').select('*').eq('location_id', locationId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
