import { useTranslations } from "next-intl";
import { ZoomableImage } from "@/components/zoomable-image";
import { cn } from "@/lib/utils";

/** Etkinlik fotoğrafları: ilki büyük, diğerleri kare; tıklanınca tam boy açılır. */
export function EventGallery({ title, photos }: { title: string; photos: string[] }) {
  const t = useTranslations("events.detail");

  return (
    <section aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="font-medium text-2xl">
        {t("gallery")}
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, i) => (
          <li key={src} className={cn(i === 0 && "col-span-2 row-span-2")}>
            <ZoomableImage
              src={src}
              alt={t("photoAlt", { title, n: i + 1 })}
              sizes={i === 0 ? "(min-width: 640px) 30rem, 100vw" : "(min-width: 640px) 15rem, 50vw"}
              className="aspect-square size-full rounded-2xl"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
