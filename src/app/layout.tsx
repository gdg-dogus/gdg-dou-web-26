import "./globals.css";

/**
 * Asıl layout src/app/[locale]/layout.tsx içinde (her dil için ayrı <html lang>).
 * Bu dosya sadece kök yönlendirme ve 404 sayfası için gerekli.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
