-- ==============================================================================
-- AS Realty (Nagpur) - Supabase Database Schema
-- Project ID: dpadpxnkrvsntbruwohp
-- URL: https://dpadpxnkrvsntbruwohp.supabase.co
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bookings Table (VIP Site Visits & Client Consultations)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  property_name TEXT NOT NULL,
  booking_date DATE,
  booking_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inquiries Table (Private Advisory Requests & Lead Capture)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'Website Advisory Form',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Properties Table (Catalog & Architectural Dossier)
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  bhk TEXT NOT NULL,
  price TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  carpet_area TEXT,
  rera_id TEXT,
  status TEXT,
  image_url TEXT,
  gallery TEXT[],
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Performance Indices
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties (location);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 7. Row Level Security Policies (Idempotent: Drop first if exists)
DROP POLICY IF EXISTS "Allow anon insert bookings" ON public.bookings;
CREATE POLICY "Allow anon insert bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read bookings" ON public.bookings;
CREATE POLICY "Allow anon read bookings" ON public.bookings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert inquiries" ON public.inquiries;
CREATE POLICY "Allow anon insert inquiries" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read inquiries" ON public.inquiries;
CREATE POLICY "Allow anon read inquiries" ON public.inquiries
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public read properties" ON public.properties;
CREATE POLICY "Allow public read properties" ON public.properties
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon manage properties" ON public.properties;
CREATE POLICY "Allow anon manage properties" ON public.properties
  FOR ALL TO anon, authenticated
  USING (true);

-- 8. VIP Client Profiles Table (Connected to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow individual user read profile" ON public.profiles;
CREATE POLICY "Allow individual user read profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual user update profile" ON public.profiles;
CREATE POLICY "Allow individual user update profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow service role or anon insert" ON public.profiles;
CREATE POLICY "Allow service role or anon insert" ON public.profiles
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- 9. Automatic Profile Creation Trigger on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

