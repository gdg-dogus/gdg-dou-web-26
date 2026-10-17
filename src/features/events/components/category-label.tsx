import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { categoryStyles } from "../category";
import type { EventCategory } from "../schema";

export function CategoryDot({
  category,
  className,
}: {
  category: EventCategory;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2.5 shrink-0 rounded-full",
        categoryStyles[category].fill,
        className,
      )}
    />
  );
}

export function CategoryIcon({
  category,
  className,
}: {
  category: EventCategory;
  className?: string;
}) {
  const Icon = categoryStyles[category].icon;
  return <Icon aria-hidden className={cn("size-4 shrink-0", className)} />;
}

export function CategoryLabel({
  category,
  className,
}: {
  category: EventCategory;
  className?: string;
}) {
  const t = useTranslations("common.categories");
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <CategoryDot category={category} />
      {t(category)}
    </span>
  );
}
