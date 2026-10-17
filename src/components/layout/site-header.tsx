import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const t = useTranslations("common.nav");
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("skip")}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <nav aria-label={t("main")} className="max-lg:hidden">
          <NavLinks className="flex items-center gap-7 text-sm" />
        </nav>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
