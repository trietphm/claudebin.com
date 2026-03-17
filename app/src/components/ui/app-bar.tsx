"use client";

import Link from "next/link";
import { isServer } from "@tanstack/react-query";
import { useState, type ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEventListener, useIsomorphicLayoutEffect, useMediaQuery } from "usehooks-ts";

import { cn } from "@/utils/helpers";
import { mediaQueries } from "@/utils/media-queries";

import { useAuth } from "@/context/auth";

import { SvgIconClaudebinXs } from "@/components/icon/svg-icon-claudebin-xs";
import { SvgIconHome } from "@/components/icon/svg-icon-home";
import { SvgIconUser } from "@/components/icon/svg-icon-user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Nav, NavLink, NavLabel } from "@/components/ui/nav";
type AppBarProps = ComponentProps<"header">;

const links = [
  { href: "/", label: "appBar.claudebin", icon: <SvgIconHome size="sm" /> },
  { href: "/threads", label: "appBar.threads", icon: null },
] as const;

const AppBar = ({ className, ...props }: AppBarProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

  const { user, profile, signOut } = useAuth();
  const [isSticky, setIsSticky] = useState<number>();

  const avatarUrl =
    profile?.avatarUrl ?? user?.user_metadata.avatar_url ?? user?.user_metadata.picture;
  const profileLabel =
    profile?.username ??
    profile?.name ??
    user?.user_metadata.full_name ??
    user?.user_metadata.name ??
    user?.email ??
    t("appBar.account");
  const profileHref = profile?.username ? `/profile/${profile.username}` : null;

  useEventListener("scroll", () => {
    setIsSticky(window.scrollY);
  });
  useIsomorphicLayoutEffect(() => {
    setIsSticky(window.scrollY);
  }, []);

  return (
    <header
      data-slot="app-bar"
      className={cn(
        "sticky top-0 z-50",
        isSticky ? "bg-gray-100/25 backdrop-blur-md" : undefined,
        className,
      )}
      {...props}
    >
      <Container size="lg">
        <div className="flex items-center justify-between pt-3 pb-2">
          <div className="flex items-center gap-24">
            <Link href="/" className="transition-colors ease-in-out hover:text-orange-50">
              <SvgIconClaudebinXs size="auto" className="w-14" />
            </Link>

            {md ? (
              <Nav>
                {links.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    variant={pathname === link.href ? "active" : "default"}
                  >
                    {link.icon}
                    <NavLabel>{t(link.label)}</NavLabel>
                  </NavLink>
                ))}
              </Nav>
            ) : null}
          </div>

          {user ? (
            <div className="flex items-center gap-4 sm:gap-8">
              {profileHref ? (
                <NavLink href={profileHref}>
                  <Avatar size="sm">
                    <AvatarImage src={avatarUrl ?? undefined} />
                    <AvatarFallback name={profileLabel} />
                  </Avatar>
                  <NavLabel>{profileLabel}</NavLabel>
                </NavLink>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={avatarUrl ?? undefined} />
                    <AvatarFallback name={profileLabel} />
                  </Avatar>
                  <NavLabel>{profileLabel}</NavLabel>
                </div>
              )}

              <Button onClick={signOut}>
                <SvgIconUser size="sm" />
                {t("appBar.logout")}
              </Button>
            </div>
          ) : (
            <Button as={Link} href="/auth/login">
              <SvgIconUser size="sm" />
              {t("appBar.login")}
            </Button>
          )}
        </div>

        <Divider />
      </Container>
    </header>
  );
};

export { AppBar };
