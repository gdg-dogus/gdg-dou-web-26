"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("common.locale");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "tr" ? "en" : "tr";

  return (
    <Button asChild variant="ghost" size="sm" className="font-medium">
      <Link href={pathname} locale={other} aria-label={t("switch")} hrefLang={other}>
        {t("short")}
      </Link>
    </Button>
  );
}
