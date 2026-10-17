import { useTranslations } from "next-intl";
import { Shape, SpinningShape } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Etkinlik listesinin altındaki "Duyuruları kaçırma" kartı. */
export function StayUpdated() {
  const t = useTranslations("events.cta");

  return (
    <section
      aria-labelledby="cta-title"
      className="relative isolate mt-24 overflow-hidden rounded-4xl bg-g-blue px-6 py-12 text-white sm:px-12 sm:py-16"
    >
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-1/2 max-md:opacity-40">
        <SpinningShape
          kind="cookie"
          duration={45}
          className="absolute -top-16 right-10 size-56 text-white/15"
        />
        <Shape
          kind="clover"
          className="absolute right-48 bottom-6 size-24 rotate-12 fill-g-yellow max-lg:hidden"
        />
        <Shape
          kind="square"
          className="absolute -right-6 bottom-10 size-28 -rotate-12 fill-g-red"
        />
        <Shape
          kind="circle"
          className="absolute top-12 right-64 size-10 fill-g-green max-lg:hidden"
        />
      </div>

      <h2 id="cta-title" className="max-w-lg text-headline">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-md text-white/85">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-white text-g-blue hover:bg-white/90">
          <a href={siteConfig.socials.whatsapp}>{t("whatsapp")}</a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/60 dark:bg-transparent dark:hover:bg-white/10"
        >
          <a href={siteConfig.socials.instagram}>{t("instagram")}</a>
        </Button>
      </div>
    </section>
  );
}
