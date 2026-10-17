import Link from "next/link";

// GitHub Pages bilinmeyen adreslerde bu sayfayı (404.html) gösterir.
export default function NotFound() {
  return (
    <html lang="tr">
      <body className="flex min-h-dvh items-center bg-background font-sans text-foreground antialiased">
        <main className="mx-auto max-w-xl px-6">
          <p className="font-medium text-6xl text-g-blue">404</p>
          <h1 className="mt-4 text-headline">Bu sayfa bulunamadı</h1>
          <p className="mt-2 text-muted-foreground">Page not found.</p>
          <p className="mt-8 flex gap-6">
            <Link href="/tr/" className="font-medium text-primary underline underline-offset-4">
              Ana sayfa
            </Link>
            <Link href="/en/" className="font-medium text-primary underline underline-offset-4">
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
