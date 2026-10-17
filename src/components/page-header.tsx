/** Alt sayfaların başlık alanı. Tüm sayfalarda aynı ölçü ve boşluklar için bunu kullanın. */
export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="pt-14 pb-10 sm:pt-20">
      <h1 className="text-display">{title}</h1>
      {intro ? <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{intro}</p> : null}
    </header>
  );
}
