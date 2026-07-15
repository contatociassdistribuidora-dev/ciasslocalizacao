import { getSupabaseBrowserClient } from '@/src/lib/supabase/client';

const supabase = getSupabaseBrowserClient();

export async function uploadLocationPhoto(locationId: string, file: File, description?: string) {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${locationId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from('location-photos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('location-photos').getPublicUrl(path);

  const { data: inserted, error } = await supabase.from('location_photos').insert({
    location_id: locationId,
    storage_path: path,
    file_url: data.publicUrl,
    description,
  }).select().single();

  if (error) throw error;
  return inserted;
}

export async function listLocationPhotos(locationId: string) {
  const { data, error } = await supabase.from('location_photos').select('*').eq('location_id', locationId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteLocationPhoto(id: string) {
  const { data, error } = await supabase.from('location_photos').select('storage_path').eq('id', id).single();
  if (error) throw error;

  const { error: removeError } = await supabase.storage.from('location-photos').remove([data.storage_path]);
  if (removeError) throw removeError;

  const { error: deleteError } = await supabase.from('location_photos').delete().eq('id', id);
  if (deleteError) throw deleteError;
}
