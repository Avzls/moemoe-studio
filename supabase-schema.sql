-- ============================================
-- Moemoe Cipluk - Supabase Schema
-- Copy-paste this into Supabase SQL Editor
-- ============================================

-- 1. Profile table (single row for portfolio owner)
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Moemoe Cipluk',
  bio TEXT DEFAULT 'Nature Photography',
  location TEXT DEFAULT 'Indonesia',
  avatar_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Alam',
  image_url TEXT NOT NULL,
  width INT DEFAULT 1600,
  height INT DEFAULT 1200,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Public read policies (anyone can read profile & photos)
CREATE POLICY "Public can read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public can read photos" ON photos FOR SELECT USING (true);

-- 6. Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

-- 7. Insert default categories
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Alam', 'alam', 0),
  ('Gunung', 'gunung', 1),
  ('Pantai', 'pantai', 2),
  ('Hutan', 'hutan', 3),
  ('Sunset', 'sunset', 4),
  ('Danau', 'danau', 5);

-- 8. Service role can do everything (used by our API routes)
-- Note: service_role key bypasses RLS by default, so no extra policies needed for admin ops

-- 7. Insert default profile row
INSERT INTO profile (name, bio, location, social_links) 
VALUES (
  'Moemoe Cipluk', 
  'Nature Photography • Keindahan Alam dalam Setiap Frame ✨', 
  'Indonesia', 
  '[{"type":"whatsapp","url":"https://wa.me/6281911205501","label":"WhatsApp"}]'::jsonb
);

-- ============================================
-- STORAGE BUCKETS (create manually in Supabase Dashboard → Storage)
-- 
-- 1. Create bucket: "photos" (public)
-- 2. Create bucket: "avatars" (public)
--
-- For each bucket, add this public read policy:
-- Policy name: "Public read"
-- Target roles: anon
-- SQL: bucket_id = 'photos' (or 'avatars')
-- ============================================
