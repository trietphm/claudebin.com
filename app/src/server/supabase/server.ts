import { cache } from "react";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/supabase/types";
import { getSupabaseAuthStorageKey } from "@/supabase/auth-storage-key";

type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const createClient = cache(async () => {
  const store = await cookies();

  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is required for server-side Supabase access.");
  }

  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is required for server-side Supabase access.");
  }

  return createServerClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookieOptions: {
      name: getSupabaseAuthStorageKey(),
    },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (cookies: ReadonlyArray<Cookie>) => {
        try {
          cookies.forEach((cookie) => {
            store.set(cookie.name, cookie.value, cookie.options);
          });
        } catch {}
      },
    },
  });
});
