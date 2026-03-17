import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";

export const createServiceClient = () => {
  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is required for server-side Supabase access.");
  }

  return createClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};
