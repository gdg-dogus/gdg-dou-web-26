import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { UnderConstruction } from "@/components/under-construction";
import { getProjects, toProjectView } from "@/features/projects/data";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.meta" });
  return { title: t("title"), description: t("description") };
}

// TODO: Proje listesi (features/projects/components/project-row.tsx hazır), ekip ve platform filtresi.
export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = getProjects().map((p) => toProjectView(p, locale));

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} />
      <UnderConstruction>
        <ul className="space-y-3 text-sm">
          {projects.map((p) => (
            <li key={p.slug}>
              <p className="font-medium">{p.title}</p>
              <p className="text-muted-foreground">{p.summary}</p>
            </li>
          ))}
        </ul>
      </UnderConstruction>
    </>
  );
}
