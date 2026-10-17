export const linkClass =
  "inline-flex items-center gap-1.5 rounded-sm font-medium text-primary text-sm hover:underline hover:underline-offset-4";

/** Ana sayfa bölüm başlığı: solda başlık ve açıklama, sağda "tümü" linki. */
export function SectionHeading({
  id,
  title,
  body,
  children,
}: {
  id: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div className="max-w-2xl">
        <h2 id={id} className="text-headline">
          {title}
        </h2>
        {body ? <p className="mt-3 text-muted-foreground">{body}</p> : null}
      </div>
      {children}
    </div>
  );
}
