import "@/static/css/globals.css";
import "katex/dist/katex.min.css";

import type { Metadata } from "next";
import { Host_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { profiles } from "@/server/repos/profiles";
import { createClient } from "@/server/supabase/server";

import copy from "@/copy/en-EN.json";

import { cn } from "@/utils/helpers";
import { APP_URL } from "@/utils/constants";

import { AuthProvider } from "@/context/auth";
import { QueryProvider } from "@/context/query";

type RootLayoutProps = {
  children: React.ReactNode;
};

const sans = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: copy.metadata.title,
  description: copy.metadata.description,
  icons: "/images/favicon.svg",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Claudebin",
    title: copy.metadata.title,
    description: copy.metadata.description,
    images: ["/images/og-default-1200x630.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.metadata.title,
    description: copy.metadata.description,
    images: ["/images/og-default-1200x630.webp"],
  },
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await profiles.getById(supabase, user.id) : null;

  return (
    <html lang={locale} className={cn(sans.variable, mono.variable)}>
      <body className="min-h-screen bg-fade bg-gray-100 font-sans text-white antialiased selection:bg-orange-50 selection:text-white">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider initialUser={user} initialProfile={profile}>
              {children}
            </AuthProvider>
          </NextIntlClientProvider>
        </QueryProvider>

        <Analytics />
        <SpeedInsights />

        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
      </body>
    </html>
  );
};

export default RootLayout;
