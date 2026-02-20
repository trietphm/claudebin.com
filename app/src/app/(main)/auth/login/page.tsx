import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/server/supabase/server";

import copy from "@/copy/en-EN.json";

import { Container } from "@/components/ui/container";

import { CliAuthLoginPageForm } from "@/components/cli-auth-login-page-form";
import { CliAuthLoginPageFormSkeleton } from "@/components/cli-auth-login-page-form-skeleton";

export const metadata: Metadata = {
  title: copy.metadata.login.title,
  description: copy.metadata.login.description,
  openGraph: {
    title: copy.metadata.login.title,
    description: copy.metadata.login.description,
  },
};

const AuthLoginPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <Container as="main" size="sm" spacing="md">
      <Suspense fallback={<CliAuthLoginPageFormSkeleton />}>
        <CliAuthLoginPageForm />
      </Suspense>
    </Container>
  );
};

export default AuthLoginPage;
