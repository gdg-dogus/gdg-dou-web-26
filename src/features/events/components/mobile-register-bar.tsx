import { Button } from "@/components/ui/button";

/** Telefonda ekranın altına sabitlenen kayıt çubuğu; sayfa kaydırılsa da kayıt butonu görünür kalır. */
export function MobileRegisterBar({
  title,
  url,
  label,
}: {
  title: string;
  url: string;
  label: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <p className="min-w-0 flex-1 truncate font-medium text-sm">{title}</p>
        <Button asChild>
          <a href={url}>{label}</a>
        </Button>
      </div>
    </div>
  );
}
