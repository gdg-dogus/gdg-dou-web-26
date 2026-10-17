"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("common.nav");
  const pathname = usePathname();

  return (
    <ul className={className}>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex py-2 text-muted-foreground transition-colors hover:text-foreground",
                active && "font-medium text-foreground",
              )}
            >
              {t(item.key)}
              {active ? (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary max-lg:hidden"
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
