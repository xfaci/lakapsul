import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Build-safe instantiation: only create the client when env vars are present.
export const supabase: SupabaseClient | null =
    supabaseUrl && supabaseAnonKey
        ? createBrowserClient(supabaseUrl, supabaseAnonKey)
        : null;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
