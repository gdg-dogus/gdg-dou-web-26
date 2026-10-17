import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { accents } from "@/components/accents";
import { Shape } from "@/components/shapes";
import { asset, cn } from "@/lib/utils";

export type SpeakerView = { name: string; role?: string; photo?: string; link?: string };

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("tr")
    .slice(0, 2);
}

/** Konuşmacı kartları: renkli "cookie" şeklinin içinde fotoğraf ya da baş harfler. */
export function EventSpeakers({ speakers }: { speakers: SpeakerView[] }) {
  const t = useTranslations("events.detail");

  return (
    <section aria-labelledby="speakers-title">
      <h2 id="speakers-title" className="font-medium text-2xl">
        {t("speakers")}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {speakers.map((s, i) => {
          const accent = accents[i % accents.length];
          return (
            <li
              key={s.name}
              className="relative flex items-center gap-4 rounded-3xl border bg-card p-4 transition-colors has-[a:hover]:bg-muted/60"
            >
              <div className="relative size-16 shrink-0">
                <Shape kind="cookie" className={cn("absolute inset-0 size-full", accent.shape)} />
                {s.photo ? (
                  <div className="absolute inset-1.5 overflow-hidden rounded-full">
                    <Image
                      src={asset(s.photo)}
                      alt=""
                      fill
                      sizes="3.25rem"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 flex items-center justify-center font-medium text-lg",
                      accent.on,
                    )}
                  >
                    {initials(s.name)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">
                  {s.link ? (
                    <a
                      href={s.link}
                      className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
                    >
                      {s.name}
                    </a>
                  ) : (
                    s.name
                  )}
                </p>
                {s.role ? <p className="mt-0.5 text-muted-foreground text-sm">{s.role}</p> : null}
              </div>
              {s.link ? (
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
