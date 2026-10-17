import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { UnderConstruction } from "@/components/under-construction";
import { getOffers } from "@/features/offers/data";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers.meta" });
  return { title: t("title"), description: t("description") };
}

// TODO: Teklif kartları, kategori filtresi ve "nasıl alınır" adımları.
export default async function OffersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("offers");
  const offers = getOffers();

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} />
      <UnderConstruction>
        <ul className="space-y-3 text-sm">
          {offers.map((o) => (
            <li key={o.id}>
              <p className="font-medium">{o.name}</p>
              <p className="text-muted-foreground">{localize(o.summary, locale)}</p>
            </li>
          ))}
        </ul>
      </UnderConstruction>
    </>
  );
}
