import { supabase } from '@/src/lib/supabase/client';

export async function getReportRows() {
  const { data, error } = await supabase
    .from('locations')
    .select('id,name,document_number,category,address,neighborhood,city,state,zip_code,latitude,longitude,contact_name,phone,email,status,created_at,created_by')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
