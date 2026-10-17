import { Construction } from "lucide-react";
import { useTranslations } from "next-intl";

/** Henüz yapılmamış sayfalarda geçici olarak gösterilir. Sayfa bitince kaldırın. */
export function UnderConstruction({ children }: { children?: React.ReactNode }) {
  const t = useTranslations("common.placeholder");
  return (
    <div className="rounded-xl border border-dashed p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Construction className="mt-0.5 size-5 shrink-0 text-g-yellow" aria-hidden />
        <div>
          <p className="font-medium">{t("title")}</p>
          <p className="mt-1 max-w-prose text-muted-foreground text-sm">{t("body")}</p>
        </div>
      </div>
      {children ? <div className="mt-6 border-t pt-6">{children}</div> : null}
    </div>
  );
}
