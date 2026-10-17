"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";

export function MobileNav() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("nav.menu")}>
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>{t("site.name")}</SheetTitle>
        </SheetHeader>
        <NavLinks className="flex flex-col gap-1 px-4 text-lg" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
