import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını birleştirir; çakışan sınıflarda sonuncusu kazanır. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `public/` altındaki bir dosyanın yolunu döndürür.
 * GitHub Pages alt yolda (ör. /gdg-dou-web-26) yayınlandığında `basePath` ekler.
 * Görsellerde `src="/images/..."` yerine her zaman `asset("/images/...")` kullanın.
 */
export function asset(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
