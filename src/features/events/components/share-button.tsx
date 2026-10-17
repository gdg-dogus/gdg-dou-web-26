"use client";

import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Telefonda sistemin paylaş menüsünü açar; masaüstünde sayfa linkini panoya kopyalar. */
export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("events.detail.share");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Kullanıcı paylaşım menüsünü kapattı.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <Button variant="outline" size="lg" className="w-full" onClick={share}>
      {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
      <span aria-live="polite">{copied ? t("copied") : t("label")}</span>
    </Button>
  );
}
