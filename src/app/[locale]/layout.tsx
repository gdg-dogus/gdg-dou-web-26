import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "tr" | "en", namespace: "common.site" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("name"), template: `%s | ${t("name")}` },
    description: t("description"),
    openGraph: { siteName: t("name"), locale, type: "website" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        <ThemeProvider>
          <NextIntlClientProvider>
            <SiteHeader />
            <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
              {children}
            </main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
