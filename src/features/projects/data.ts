import { getTeams } from "@/features/team/data";
import type { Locale } from "@/i18n/routing";
import { readJsonDir } from "@/lib/content";
import { type LocalizedString, localize } from "@/lib/localized";
import { type Project, type ProjectPlatform, projectSchema } from "./schema";

export type ProjectItem = Project & { teamName: LocalizedString };

/** Bileşenlere gönderilen, tek dile çevrilmiş sade proje nesnesi. */
export type ProjectView = {
  slug: string;
  title: string;
  team: string;
  year: number;
  summary: string;
  cover: string;
  platforms: ProjectPlatform[];
  tools: string[];
  credits: string[];
  links: Project["links"];
};

/** Projeler, en yeniden eskiye; aynı yıl içinde ada göre. */
export function getProjects(): ProjectItem[] {
  const teams = new Map(getTeams().map((t) => [t.key, t.name]));

  return readJsonDir("projects", projectSchema)
    .map((p) => {
      const teamName = teams.get(p.team);
      if (!teamName) {
        throw new Error(`"${p.title}" bilinmeyen bir ekipte: "${p.team}". teams.json'a bakın.`);
      }
      return { ...p, teamName };
    })
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function toProjectView(p: ProjectItem, locale: Locale): ProjectView {
  return {
    slug: p.slug,
    title: p.title,
    team: localize(p.teamName, locale),
    year: p.year,
    summary: localize(p.summary, locale),
    cover: p.cover,
    platforms: p.platforms,
    tools: p.tools,
    credits: p.credits,
    links: p.links,
  };
}
