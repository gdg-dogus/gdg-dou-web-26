import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { UnderConstruction } from "@/components/under-construction";
import { getTeams } from "@/features/team/data";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team.meta" });
  return { title: t("title"), description: t("description") };
}

// TODO: Ekip sayfası tasarımı. Veriler getTeams() ile hazır.
export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const teams = getTeams();

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} />
      <UnderConstruction>
        <ul className="space-y-4 text-sm">
          {teams.map((team) => (
            <li key={team.key}>
              <p className="font-medium">{localize(team.name, locale)}</p>
              <p className="text-muted-foreground">{team.members.map((m) => m.name).join(", ")}</p>
            </li>
          ))}
        </ul>
      </UnderConstruction>
    </>
  );
}
