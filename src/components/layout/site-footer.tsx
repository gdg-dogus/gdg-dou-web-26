import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { navItems, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

const socialLabels = {
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
  medium: "Medium",
} as const;

export function SiteFooter() {
  const t = useTranslations("common");
  return (
    <footer className="mt-32 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-muted-foreground text-sm">{t("site.description")}</p>
        </div>
        <div>
          <h2 className="font-medium text-sm">{t("footer.pages")}</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-medium text-sm">{t("footer.community")}</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
            <li>
              <a href={siteConfig.socials.whatsapp} className="hover:text-foreground">
                {t("footer.joinWhatsapp")}
              </a>
            </li>
            {Object.entries(socialLabels).map(([key, label]) => (
              <li key={key}>
                <a
                  href={siteConfig.socials[key as keyof typeof socialLabels]}
                  className="hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-muted-foreground text-xs sm:px-6">
          {t("footer.source")}{" "}
          <a
            href={siteConfig.repoUrl}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {t("footer.sourceLink")}
          </a>
        </p>
      </div>
    </footer>
  );
}
