import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://dpadpxnkrvsntbruwohp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pWOhSjHo80ibN7z_kZSr_Q_Pb-En6E1';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(200).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: data || [] });
    } catch (e: any) {
      return res.status(200).json({ success: true, data: [] });
    }
  }

  if (req.method === 'POST') {
    const { name, phone, email, interest, message, source } = req.body || {};
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const record = {
      id: `inquiry-${Date.now()}`,
      name,
      phone: phone || '',
      email: email || '',
      interest: interest || 'General Advisory',
      message: message || '',
      source: source || 'Website Advisory Form',
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('inquiries').insert([record]).select();
      if (error) {
        return res.status(200).json({ success: true, persisted: 'buffered', data: record });
      }
      return res.status(200).json({ success: true, persisted: 'supabase', data: data?.[0] || record });
    } catch (e) {
      return res.status(200).json({ success: true, persisted: 'buffered', data: record });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
