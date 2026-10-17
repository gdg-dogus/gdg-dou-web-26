"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes temayı ilk yüklemede inline <script> ile uygular. Dil değişince layout client'ta
// yeniden mount edilir ve React 19 client'ta render edilen script için konsola hata basar.
// Client'ta script'i veri bloğu (çalışmayan) olarak işaretlemek bu uyarıyı kaldırır; sunucu
// HTML'indeki script normal çalışmaya devam eder.
const scriptProps =
  typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
