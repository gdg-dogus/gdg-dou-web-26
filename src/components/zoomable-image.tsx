"use client";

import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { asset, cn } from "@/lib/utils";

/** Tıklanınca tam boy açılan görsel (afiş, galeri fotoğrafları). `className` kutunun boyutunu verir. */
export function ZoomableImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const t = useTranslations("common.zoom");

  return (
    <Dialog>
      <DialogTrigger
        aria-label={t("open", { name: alt })}
        className={cn(
          "group relative block cursor-zoom-in overflow-hidden bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className,
        )}
      >
        <Image
          src={asset(src)}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
        <span className="absolute right-3 bottom-3 rounded-full bg-background/85 p-2 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="size-4" aria-hidden />
        </span>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="w-auto max-w-[min(92vw,56rem)] border-0 bg-transparent p-0 shadow-none sm:max-w-[min(92vw,56rem)]"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <Image
          src={asset(src)}
          alt={alt}
          width={1080}
          height={1350}
          sizes="92vw"
          className="h-auto max-h-[88dvh] w-auto rounded-2xl object-contain"
        />
        <DialogClose className="absolute -top-3 -right-3 inline-flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <X className="size-5" aria-hidden />
          <span className="sr-only">{t("close")}</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
