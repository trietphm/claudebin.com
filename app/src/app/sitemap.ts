import type { MetadataRoute } from "next";

import { APP_URL } from "@/utils/constants";
import { createServiceClient } from "@/server/supabase/service";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const supabase = createServiceClient();

  const [{ data: threads }, { data: profiles }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, createdAt")
      .eq("isPublic", true)
      .order("createdAt", { ascending: false }),
    supabase
      .from("profiles")
      .select("username, updatedAt")
      .is("deletedAt", null)
      .not("username", "is", null),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${APP_URL}/threads`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${APP_URL}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const threadPages: MetadataRoute.Sitemap = (threads ?? []).map((thread) => ({
    url: `${APP_URL}/threads/${thread.id}`,
    lastModified: new Date(thread.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: `${APP_URL}/profile/${profile.username}`,
    lastModified: new Date(profile.updatedAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...threadPages, ...profilePages];
};

export default sitemap;
