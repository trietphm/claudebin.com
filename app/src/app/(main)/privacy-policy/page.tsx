import type { ReactNode } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import copy from "@/copy/en-EN.json";

import { Container } from "@/components/ui/container";
import { Steps, StepsItem } from "@/components/ui/steps";
import { Typography } from "@/components/ui/typography";

const renderers = {
  link: (chunks: ReactNode) => (
    <a href="mailto:office@wunderlabs.dev" className="text-orange-50">
      {chunks}
    </a>
  ),
} as const;

export const metadata: Metadata = {
  title: copy.metadata.privacyPolicy.title,
  description: copy.metadata.privacyPolicy.description,
  openGraph: {
    title: copy.metadata.privacyPolicy.title,
    description: copy.metadata.privacyPolicy.description,
  },
};

const PrivacyPolicyPage = () => {
  const t = useTranslations();

  return (
    <Container as="article" size="sm" spacing="md" className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-3 pb-6">
        <Typography variant="h1">{t("privacyPolicy.title")}</Typography>
        <Typography variant="body" color="neutral">
          {t("privacyPolicy.subtitle")}
        </Typography>
        <div className="flex flex-col gap-1">
          <Typography variant="small" color="muted">
            {t("privacyPolicy.operatedBy")}
          </Typography>
          <Typography variant="small" color="muted">
            {t("privacyPolicy.lastUpdated")}
          </Typography>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.overview.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.overview.p4")}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.overview.p1")}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.overview.p2")}
        </Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.overview.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.overview.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.overview.item3")}</StepsItem>
          <StepsItem>{t("privacyPolicy.overview.item4")}</StepsItem>
          <StepsItem>{t("privacyPolicy.overview.item5")}</StepsItem>
        </Steps>

        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.overview.p3")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.data.title")}</Typography>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.auth.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.auth.p1")}
          </Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.auth.p2")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.auth.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.auth.item2")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.auth.item3")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.auth.item4")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.auth.p3")}
          </Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.auth.p4")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.content.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.content.p1")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.content.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item2")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item3")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item4")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item5")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item6")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item7")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.content.p2")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.content.item8")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.content.item9")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.content.p3")}
          </Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.content.p4")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.profile.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.profile.p1")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.profile.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item2")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item3")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item4")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item5")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item6")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.profile.p2")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.profile.item7")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item8")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item9")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item10")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item11")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.profile.item12")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.profile.p3")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.views.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.views.p1")}
          </Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.views.p2")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.views.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.views.item2")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.views.item3")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.views.item4")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.views.item5")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.views.p3")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.analytics.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.analytics.p1")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.analytics.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.analytics.item2")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.analytics.item3")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.analytics.item4")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.analytics.p2")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.ai.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.ai.p1")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.ai.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.ai.item2")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.ai.item3")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.ai.p2")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.cookies.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.cookies.p1")}
          </Typography>

          <Steps variant="unordered">
            <StepsItem>{t("privacyPolicy.data.cookies.item1")}</StepsItem>
            <StepsItem>{t("privacyPolicy.data.cookies.item2")}</StepsItem>
          </Steps>

          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.cookies.p2")}
          </Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.cookies.p3")}
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="h4">{t("privacyPolicy.data.emails.title")}</Typography>
          <Typography variant="small" color="muted" className="leading-7">
            {t("privacyPolicy.data.emails.p1")}
          </Typography>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.infrastructure.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.infrastructure.p1")}
        </Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.infrastructure.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.infrastructure.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.infrastructure.item3")}</StepsItem>
          <StepsItem>{t("privacyPolicy.infrastructure.item4")}</StepsItem>
          <StepsItem>{t("privacyPolicy.infrastructure.item5")}</StepsItem>
          <StepsItem>{t("privacyPolicy.infrastructure.item6")}</StepsItem>
          <StepsItem>{t("privacyPolicy.infrastructure.item7")}</StepsItem>
        </Steps>

        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.infrastructure.p2")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.legal.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.legal.p1")}
        </Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.legal.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.legal.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.legal.item3")}</StepsItem>
          <StepsItem>{t("privacyPolicy.legal.item4")}</StepsItem>
        </Steps>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.retention.title")}</Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.retention.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.retention.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.retention.item3")}</StepsItem>
          <StepsItem>{t("privacyPolicy.retention.item4")}</StepsItem>
          <StepsItem>{t("privacyPolicy.retention.item5")}</StepsItem>
          <StepsItem>{t("privacyPolicy.retention.item6")}</StepsItem>
        </Steps>

        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.retention.p1")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.deletion.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.deletion.p1")}
        </Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.deletion.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.deletion.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.deletion.item3")}</StepsItem>
        </Steps>

        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.deletion.p3")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.rights.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.rights.p1")}
        </Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.rights.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item3")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item4")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item5")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item6")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item7")}</StepsItem>
          <StepsItem>{t("privacyPolicy.rights.item8")}</StepsItem>
        </Steps>

        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.rights.p2")}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t.rich("privacyPolicy.rights.p3", renderers)}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.rights.p4")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.transfers.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.transfers.p1")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.security.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.security.p1")}
        </Typography>

        <Steps variant="unordered">
          <StepsItem>{t("privacyPolicy.security.item1")}</StepsItem>
          <StepsItem>{t("privacyPolicy.security.item2")}</StepsItem>
          <StepsItem>{t("privacyPolicy.security.item3")}</StepsItem>
          <StepsItem>{t("privacyPolicy.security.item4")}</StepsItem>
        </Steps>

        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.security.p2")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.children.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.children.p1")}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.children.p2")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.payments.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.payments.p1")}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.payments.p2")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.changes.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.changes.p1")}
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h3">{t("privacyPolicy.contactInfo.title")}</Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.contactInfo.p1")}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t.rich("privacyPolicy.contactInfo.p2", renderers)}
        </Typography>
        <Typography variant="small" color="muted" className="leading-7">
          {t("privacyPolicy.contactInfo.p3")}
        </Typography>
      </section>
    </Container>
  );
};

export default PrivacyPolicyPage;
