import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Shape, SpinningShape } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Sayfanın sonundaki "Topluluğun bir parçası ol" kartı: etkinliklere ve ekibe yönlendirir. */
export function AboutCta() {
  const t = useTranslations("about.cta");

  return (
    <section
      aria-labelledby="about-cta-title"
      className="relative isolate mt-32 overflow-hidden rounded-4xl bg-g-green px-6 py-12 text-white sm:px-12 sm:py-16"
    >
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-1/2 max-md:opacity-40">
        <SpinningShape
          kind="flower"
          duration={45}
          className="absolute -top-14 right-12 size-56 text-white/15"
        />
        <Shape
          kind="pill"
          className="absolute right-52 bottom-4 size-28 -rotate-12 fill-g-yellow max-lg:hidden"
        />
        <Shape kind="cookie" className="absolute -right-8 bottom-8 size-28 fill-g-blue" />
        <Shape
          kind="circle"
          className="absolute top-14 right-72 size-10 fill-g-red max-lg:hidden"
        />
      </div>

      <h2 id="about-cta-title" className="max-w-lg text-headline">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-md text-white/85">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-white text-g-green hover:bg-white/90">
          <Link href="/events">
            {t("events")}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/60 dark:bg-transparent dark:hover:bg-white/10"
        >
          <Link href="/team">{t("team")}</Link>
        </Button>
      </div>
    </section>
  );
}
