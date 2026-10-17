import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * "Doğuş Üniversitesi, Z-25" gibi adreslerden derslik kodunu (Z-25, B2-03) çıkarır.
 * Google bu kodları tanımadığı için aksi halde haritada bütün şehri gösteriyor.
 */
function withoutRoom(address: string) {
  const parts = address.split(",").map((p) => p.trim());
  const kept = parts.filter((p) => !/^[A-Z]\d*-\d+[A-Z]?$/i.test(p));
  return kept.length > 0 ? kept.join(", ") : address;
}

/**
 * Detay sayfasındaki Google Maps haritası. API anahtarı gerektirmeyen gömme linki kullanılır.
 * `query` Türkçe adres olmalı; Google Türkçe adresleri daha iyi buluyor.
 */
export function EventMap({ query, label }: { query: string; label: string }) {
  const t = useTranslations("events.detail.map");
  const q = encodeURIComponent(withoutRoom(query));

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
        <iframe
          title={t("title", { location: label })}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        className="mt-3 inline-flex items-center gap-1.5 text-primary text-sm underline-offset-4 hover:underline"
      >
        {t("open")}
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
    </div>
  );
}
