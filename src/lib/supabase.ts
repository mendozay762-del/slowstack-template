/**
 * Supabase browser client. Reads NEXT_PUBLIC_* env vars at module load.
 * Safe to import from client components — these vars are public by design.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey);
