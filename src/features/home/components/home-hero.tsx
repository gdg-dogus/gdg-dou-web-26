"use client";

import { ArrowDown } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { DotField } from "./dot-field";

/** Yazılan kelimelerin renkleri sırayla döner. Sarı açık zeminde okunmadığı için yok. */
const wordColors = ["text-g-blue", "text-g-red", "text-g-green"] as const;

/**
 * Ana sayfanın açılışı: renkli noktalar uçuşup GDG logosundaki iki parantezi çizer (`DotField`),
 * aralarında "birlikte öğreniyoruz / üretiyoruz / …" yazılıp silinir.
 * Sunucu HTML'inde ilk kelime tam yazılıdır; hareket azaltma açıksa öyle kalır.
 */
export function HomeHero() {
  const t = useTranslations("home.hero");
  const words = useMemo(() => t.raw("words") as string[], [t]);
  const reduce = useReducedMotion();
  const { index, length } = useTypedWord(words, !reduce);
  const text = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      {/* Sayfa genişliğini aşıp ekranın iki kenarına kadar uzanır (body'deki overflow-x-clip yatay kaydırmayı önler). */}
      <section className="relative isolate left-1/2 flex min-h-[min(calc(100dvh-4rem),56rem)] w-screen -translate-x-1/2 flex-col items-center justify-center overflow-hidden px-4 py-20">
        <h1 className="sr-only">{t("title")}</h1>
        <DotField around={text} />

        <div aria-hidden>
          <div ref={text} className="w-fit">
            <p className="text-base text-muted-foreground sm:text-xl">{t("kicker")}</p>
            <p className="mt-1 text-[2.4rem] leading-[1.04] tracking-[-0.035em] [font-variation-settings:'ROND'_100] sm:text-display">
              {t("lead")}
              <br />
              <span className="inline-grid">
                {words.map((word) => (
                  <span key={word} className="invisible col-start-1 row-start-1">
                    {word}
                  </span>
                ))}
                <span
                  className={cn("col-start-1 row-start-1", wordColors[index % wordColors.length])}
                >
                  {words[index].slice(0, length)}
                  <span className="ml-1 inline-block h-[0.82em] w-[0.07em] translate-y-[0.08em] animate-pulse bg-current motion-reduce:hidden" />
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/events">{t("primary")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={siteConfig.socials.whatsapp}>{t("secondary")}</a>
          </Button>
        </div>

        <a
          href="#next"
          aria-label={t("scroll")}
          className="absolute bottom-6 rounded-full p-2 text-muted-foreground hover:text-foreground"
        >
          <motion.span
            className="block"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ArrowDown className="size-5" />
          </motion.span>
        </a>
      </section>
    </MotionConfig>
  );
}

/** Kelimeleri harf harf yazıp silen sayaç. İlk kelime tam yazılı başlar. */
function useTypedWord(words: string[], enabled: boolean) {
  const [state, setState] = useState({ index: 0, length: words[0]?.length ?? 0 });

  useEffect(() => {
    if (!enabled || words.length < 2) return;
    let index = 0;
    let length = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (deleting) {
        if (length > 0) {
          length -= 1;
          timer = setTimeout(step, 40);
        } else {
          deleting = false;
          index = (index + 1) % words.length;
          timer = setTimeout(step, 250);
        }
      } else if (length < words[index].length) {
        length += 1;
        timer = setTimeout(step, 85);
      } else {
        deleting = true;
        timer = setTimeout(step, 2200);
      }
      setState({ index, length });
    };

    timer = setTimeout(step, 2800);
    return () => clearTimeout(timer);
  }, [words, enabled]);

  return state;
}
