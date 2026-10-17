import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/utils";
import type { ProjectView } from "../data";

/** Projeler sayfasındaki tek proje: kapak, künye ve bağlantılar. */
export function ProjectRow({ project }: { project: ProjectView }) {
  const t = useTranslations("projects");
  const tp = useTranslations("projects.platforms");
  const host = project.links.page
    ? new URL(project.links.page).hostname.replace(/^www\./, "")
    : null;

  const details = [
    { label: t("details.platforms"), value: project.platforms.map((p) => tp(p)).join(", ") },
    { label: t("details.tools"), value: project.tools.join(", ") },
    { label: t("details.credits"), value: project.credits.join(", ") },
  ].filter((d) => d.value);

  return (
    <article className="grid gap-6 py-10 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-12">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <Image
          src={asset(project.cover)}
          alt=""
          fill
          sizes="(min-width: 1024px) 26rem, (min-width: 768px) 18rem, 100vw"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-sm">
          {project.team} · {project.year}
        </p>
        <h2 className="mt-2 text-headline">{project.title}</h2>
        <p className="mt-4 max-w-prose text-muted-foreground">{project.summary}</p>
        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {details.map((d) => (
            <div key={d.label} className="contents">
              <dt className="text-muted-foreground">{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.links.page ? (
            <>
              <Button asChild size="lg">
                <a href={project.links.page}>
                  {t("links.page")}
                  <ArrowUpRight aria-hidden />
                </a>
              </Button>
              <span className="text-muted-foreground text-sm">{host}</span>
            </>
          ) : null}
          {project.links.source ? (
            <a
              href={project.links.source}
              className="font-medium text-primary text-sm hover:underline hover:underline-offset-4"
            >
              {t("links.source")}
            </a>
          ) : null}
          {project.links.video ? (
            <a
              href={project.links.video}
              className="font-medium text-primary text-sm hover:underline hover:underline-offset-4"
            >
              {t("links.video")}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
