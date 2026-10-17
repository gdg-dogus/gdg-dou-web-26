import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { asset, cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const t = useTranslations("common.site");
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image src={asset("/images/logo.webp")} alt="" width={36} height={36} priority />
      <span className="flex flex-col leading-tight">
        <span className="font-medium [font-variation-settings:'ROND'_100]">{t("name")}</span>
        <span className="text-muted-foreground text-xs">{t("university")}</span>
      </span>
    </Link>
  );
}
