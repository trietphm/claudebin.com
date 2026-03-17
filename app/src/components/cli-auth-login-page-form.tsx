"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { createClient } from "@/supabase/client";

import { SvgIconGithub } from "@/components/icon/svg-icon-github";
import { SvgIconGoogle } from "@/components/icon/svg-icon-google";
import { SvgIconSkull } from "@/components/icon/svg-icon-skull";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

import { LoginPageHeader } from "@/components/login-page-header";

type AuthProvider = "github" | "google";

const CliAuthLoginPageForm = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");

  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  const handleSignIn = async (provider: AuthProvider) => {
    setLoadingProvider(provider);

    const supabase = createClient();
    const redirect = encodeURIComponent(redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-18">
      <LoginPageHeader />

      <div className="flex flex-col items-start gap-5">
        {authError ? (
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconSkull />
              {t("login.errorTitle")}
            </Typography>
            <Typography variant="body" color="neutral">
              {authErrorDescription || t("login.errorDescription")}
            </Typography>
          </div>
        ) : null}

        <div className="flex w-full max-w-sm flex-col items-stretch gap-3">
          <Button onClick={() => handleSignIn("google")} disabled={loadingProvider !== null}>
            <SvgIconGoogle />
            {loadingProvider === "google" ? t("common.loading") : t("login.continueWithGoogle")}
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleSignIn("github")}
            disabled={loadingProvider !== null}
          >
            <SvgIconGithub />
            {loadingProvider === "github" ? t("common.loading") : t("login.continueWithGithub")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { CliAuthLoginPageForm };
