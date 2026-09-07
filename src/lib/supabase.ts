import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase project configurations
export const SUPABASE_PROJECT_ID = 'dpadpxnkrvsntbruwohp';

/**
 * Sanitizes and normalizes Supabase URL to guarantee a valid HTTP/HTTPS URL
 */
export function normalizeSupabaseUrl(rawUrl?: string | null): string {
  const FALLBACK = 'https://dpadpxnkrvsntbruwohp.supabase.co';
  if (!rawUrl || typeof rawUrl !== 'string') return FALLBACK;

  let cleaned = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!cleaned) return FALLBACK;

  // If user entered only the project id e.g. "dpadpxnkrvsntbruwohp"
  if (/^[a-z0-9]{15,30}$/i.test(cleaned)) {
    return `https://${cleaned}.supabase.co`;
  }

  // If missing protocol (e.g. "dpadpxnkrvsntbruwohp.supabase.co")
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  // Remove trailing /rest/v1 or /rest/v1/ or any trailing slashes
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch (e) {
    console.warn('[Supabase] Malformed SUPABASE_URL, using fallback:', rawUrl);
  }

  return FALLBACK;
}

export function normalizeSupabaseKey(rawKey?: string | null): string {
  const FALLBACK = 'sb_publishable_pWOhSjHo80ibN7z_kZSr_Q_Pb-En6E1';
  if (!rawKey || typeof rawKey !== 'string') return FALLBACK;
  const cleaned = rawKey.trim().replace(/^["']|["']$/g, '');
  return cleaned || FALLBACK;
}

const rawEnvUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : undefined;
const rawEnvKey = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_ANON_KEY : undefined;

export const SUPABASE_URL = normalizeSupabaseUrl(rawEnvUrl);
export const SUPABASE_ANON_KEY = normalizeSupabaseKey(rawEnvKey);

// Lazy Supabase client singleton with error recovery
let _clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_clientInstance) {
    try {
      _clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('[Supabase] Primary client init warning, using safe fallback instance:', err);
      _clientInstance = createClient('https://dpadpxnkrvsntbruwohp.supabase.co', 'sb_publishable_pWOhSjHo80ibN7z_kZSr_Q_Pb-En6E1', {
        auth: { persistSession: false },
      });
    }
  }
  return _clientInstance;
}

// Transparent Proxy export so existing `supabase.from(...)` syntax works seamlessly without throwing at module load
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabase();
    const value = (instance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export interface SupabaseBooking {
  id?: string;
  full_name: string;
  phone?: string;
  property_name: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface SupabaseInquiry {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  interest?: string;
  message?: string;
  source?: string;
  created_at?: string;
}

/**
 * Save VIP Site Visit Booking to Supabase
 * Tries server API proxy first, falls back to direct Supabase client
 */
export async function saveBookingToSupabase(booking: SupabaseBooking): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // 1. Try server proxy endpoint
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result.data };
    }
  } catch (proxyError) {
    console.warn('[Supabase] Proxy booking failed, attempting direct client insert...', proxyError);
  }

  // 2. Direct client fallback
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          full_name: booking.full_name,
          phone: booking.phone || '',
          property_name: booking.property_name,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          notes: booking.notes || '',
          status: booking.status || 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('[Supabase] Direct booking insert notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error during booking save:', err);
    return { success: false, error: err?.message || 'Failed to persist booking' };
  }
}

/**
 * Save Inquiry to Supabase
 */
export async function saveInquiryToSupabase(inquiry: SupabaseInquiry): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // 1. Try server proxy endpoint
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result.data };
    }
  } catch (proxyError) {
    console.warn('[Supabase] Proxy inquiry failed, attempting direct client insert...', proxyError);
  }

  // 2. Direct client fallback
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: inquiry.name,
          phone: inquiry.phone || '',
          email: inquiry.email || '',
          interest: inquiry.interest || '',
          message: inquiry.message || '',
          source: inquiry.source || 'Website Contact Form',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('[Supabase] Direct inquiry insert notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error during inquiry save:', err);
    return { success: false, error: err?.message || 'Failed to persist inquiry' };
  }
}

/**
 * Fetch all bookings from Supabase
 */
export async function fetchBookingsFromSupabase(): Promise<SupabaseBooking[]> {
  try {
    const res = await fetch('/api/bookings');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) return json.data;
    }
  } catch (e) {
    // fallback
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data;
    }
  } catch (e) {
    console.warn('[Supabase] Could not fetch bookings:', e);
  }

  return [];
}

/**
 * Fetch all inquiries from Supabase
 */
export async function fetchInquiriesFromSupabase(): Promise<SupabaseInquiry[]> {
  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) return json.data;
    }
  } catch (e) {
    // fallback
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data;
    }
  } catch (e) {
    console.warn('[Supabase] Could not fetch inquiries:', e);
  }

  return [];
}

/**
 * ==============================================================================
 * Supabase Authentication Functions
 * ==============================================================================
 */

export interface AuthUserProfile {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { full_name?: string; phone?: string }
) {
  try {
    const client = getSupabase();
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: metadata?.full_name?.trim() || '',
          phone: metadata?.phone?.trim() || '',
        },
      },
    });

    return { data, error };
  } catch (err: any) {
    console.error('[Supabase Auth] Sign up error:', err);
    return { data: null, error: err };
  }
}

/**
 * Sign in existing user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const client = getSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return { data, error };
  } catch (err: any) {
    console.error('[Supabase Auth] Sign in error:', err);
    return { data: null, error: err };
  }
}

/**
 * Sign out the currently active user
 */
export async function signOutUser() {
  try {
    const client = getSupabase();
    const { error } = await client.auth.signOut();
    return { error };
  } catch (err: any) {
    console.error('[Supabase Auth] Sign out error:', err);
    return { error: err };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  try {
    const client = getSupabase();
    const { data, error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#reset-password` : undefined,
    });
    return { data, error };
  } catch (err: any) {
    console.error('[Supabase Auth] Reset password error:', err);
    return { data: null, error: err };
  }
}

/**
 * Get the currently logged-in user
 */
export async function getCurrentUser() {
  try {
    const client = getSupabase();
    const { data: { user }, error } = await client.auth.getUser();
    if (error) return null;
    return user;
  } catch (err) {
    return null;
  }
}

/**
 * Get the current active session
 */
export async function getCurrentSession() {
  try {
    const client = getSupabase();
    const { data: { session }, error } = await client.auth.getSession();
    if (error) return null;
    return session;
  } catch (err) {
    return null;
  }
}

