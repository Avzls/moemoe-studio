import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create clients only when configured
function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

// Public client (for reading data on frontend)
export const supabase = createSupabaseClient();

// Admin client (for server-side mutations — never expose to frontend)
export const supabaseAdmin = createSupabaseAdmin();

// Types
export interface Profile {
  id: string;
  name: string;
  bio: string;
  location: string;
  avatar_url: string | null;
  social_links: SocialLink[];
  updated_at: string;
}

export interface SocialLink {
  type: string;
  url: string;
  label: string;
}

export interface PhotoRecord {
  id: string;
  title: string;
  category: string;
  image_url: string;
  width: number;
  height: number;
  sort_order: number;
  created_at: string;
}
