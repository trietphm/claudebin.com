"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import type { Database } from "@/supabase/types";
import type { User } from "@supabase/supabase-js";

type AuthProfile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "username" | "name" | "avatarUrl"
>;

const fetchProfile = async (userId: string): Promise<AuthProfile | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, name, avatarUrl")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
};

type AuthContextValue = {
  user: User | null;
  profile: AuthProfile | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  signOut: async () => {},
});

type AuthProviderProps = {
  initialUser: User | null;
  initialProfile: AuthProfile | null;
  children: React.ReactNode;
};

const AuthProvider = ({ initialUser, initialProfile, children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<AuthProfile | null>(initialProfile);

  useEffect(() => {
    let isActive = true;
    const supabase = createClient();

    const syncProfile = async (nextUser: User | null) => {
      if (!nextUser) {
        if (isActive) {
          setProfile(null);
        }
        return;
      }

      try {
        const nextProfile = await fetchProfile(nextUser.id);

        if (isActive) {
          setProfile(nextProfile);
        }
      } catch {
        if (isActive) {
          setProfile(null);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const nextUser = session?.user ?? null;

      setUser(nextUser);
      void syncProfile(nextUser);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return <AuthContext.Provider value={{ user, profile, signOut }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, type AuthProfile };
