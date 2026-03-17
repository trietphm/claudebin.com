import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/supabase/types";
import { getSupabaseAuthStorageKey } from "@/supabase/auth-storage-key";

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions: {
        name: getSupabaseAuthStorageKey(),
      },
    },
  );
};
