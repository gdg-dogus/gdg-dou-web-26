"use client";

import { ArrowRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { accents } from "@/components/accents";
import { Shape } from "@/components/shapes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { linkClass, SectionHeading } from "./section-heading";

export type TeamSummary = { key: string; name: string; description: string; members: number };

/**
 * Ekipler: her nokta ekipteki bir kişi. Bölüm görününce noktalar yukarıdan düşüp yerine oturur,
 * bir ekibin üzerine gelince o ekibin noktaları sırayla zıplar.
 */
export function TeamsOverview({ teams }: { teams: TeamSummary[] }) {
  const t = useTranslations("home.teams");
  const members = teams.reduce((n, team) => n + team.members, 0);
  let order = 0;

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="teams-title" className="mt-32">
        <SectionHeading
          id="teams-title"
          title={t("title", { teams: teams.length, members })}
          body={t("body")}
        >
          <Link href="/team" className={linkClass}>
            {t("all")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </SectionHeading>

        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => {
            const accent = accents[i % accents.length];
            return (
              <motion.li
                key={team.key}
                className="border-t py-7"
                initial="hidden"
                whileInView="shown"
                whileHover="hop"
                viewport={{ once: true, amount: 0.6 }}
              >
                <h3 className="font-medium text-xl">{team.name}</h3>
                <p className="mt-2 line-clamp-2 text-muted-foreground text-sm">
                  {team.description}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span aria-hidden className="flex flex-wrap gap-1.5">
                    {Array.from({ length: team.members }, (_, j) => {
                      const delay = (order++ % 12) * 0.05;
                      return (
                        <motion.span
                          // biome-ignore lint/suspicious/noArrayIndexKey: noktalar sadece sayıyı gösterir
                          key={j}
                          variants={{
                            hidden: { y: -36, scale: 0 },
                            shown: {
                              y: 0,
                              scale: 1,
                              transition: { type: "spring", stiffness: 380, damping: 14, delay },
                            },
                            hop: {
                              y: [0, -10, 0],
                              transition: { duration: 0.45, delay: j * 0.06 },
                            },
                          }}
                        >
                          <Shape kind="circle" className={cn("size-3.5", accent.shape)} />
                        </motion.span>
                      );
                    })}
                  </span>
                  <span className="font-medium text-sm">
                    {t("members", { count: team.members })}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </MotionConfig>
  );
}
