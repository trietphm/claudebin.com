const getSupabaseAuthStorageKey = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("A Supabase URL is required to derive the auth storage key.");
  }

  const hostname = new URL(supabaseUrl).hostname.split(".")[0];

  return `sb-${hostname}-auth-token`;
};

export { getSupabaseAuthStorageKey };
