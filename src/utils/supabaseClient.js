import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// createClient() throws synchronously if either value is missing, which would
// crash every page/route that imports this module (e.g. when Supabase env
// vars aren't configured, or during local dev without a .env.local).
// Returning null instead lets callers degrade gracefully.
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.error(
    'Supabase client not initialized: missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export default supabase;