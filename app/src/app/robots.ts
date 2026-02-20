import type { MetadataRoute } from "next";

import { APP_URL } from "@/utils/constants";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/", "/auth/", "/cli/"],
  },
  sitemap: `${APP_URL}/sitemap.xml`,
});

export default robots;
