import { Bus, Info, type LucideIcon, Mic, Palette, Trophy, Wrench } from "lucide-react";
import type { EventCategory } from "./schema";

/**
 * Her kategori Google'ın dört renginden birini kullanır (logodaki noktalar gibi).
 * Renkler globals.css'teki --g-* değişkenlerinden gelir.
 */
export const categoryStyles: Record<
  EventCategory,
  {
    fill: string;
    ring: string;
    text: string;
    soft: string;
    /** `Shape` dolgusu */
    shape: string;
    /** Dolu renkli zemin üstündeki yazı/ikon rengi */
    on: string;
    icon: LucideIcon;
  }
> = {
  summit: {
    fill: "bg-g-blue",
    ring: "border-g-blue",
    text: "text-g-blue",
    soft: "bg-g-blue/10",
    shape: "fill-g-blue",
    on: "text-white",
    icon: Trophy,
  },
  tech_talk: {
    fill: "bg-g-red",
    ring: "border-g-red",
    text: "text-g-red",
    soft: "bg-g-red/10",
    shape: "fill-g-red",
    on: "text-white",
    icon: Mic,
  },
  workshop: {
    fill: "bg-g-green",
    ring: "border-g-green",
    text: "text-g-green",
    soft: "bg-g-green/10",
    shape: "fill-g-green",
    on: "text-white",
    icon: Wrench,
  },
  trip: {
    fill: "bg-g-yellow",
    ring: "border-g-yellow",
    text: "text-g-yellow",
    soft: "bg-g-yellow/10",
    shape: "fill-g-yellow",
    on: "text-neutral-900",
    icon: Bus,
  },
  info_session: {
    fill: "bg-muted-foreground",
    ring: "border-muted-foreground",
    text: "text-muted-foreground",
    soft: "bg-muted",
    shape: "fill-muted-foreground",
    on: "text-background",
    icon: Info,
  },
  design: {
    fill: "bg-g-green",
    ring: "border-g-green",
    text: "text-g-green",
    soft: "bg-g-green/10",
    shape: "fill-g-green",
    on: "text-white",
    icon: Palette,
  },
};
