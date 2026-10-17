import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import { asset } from "@/lib/utils";

/**
 * Markdown'ı build sırasında HTML'e çevirir (Server Component, tarayıcıya JS gitmez).
 * Yazıdaki HTML etiketleri işlenmez, düz metin olarak kalır.
 * Her etiketin görünümü aşağıdaki `components` listesinden gelir; stil burada değişir.
 */
const heading: Components["h2"] = ({ children }) => (
  <h2 className="mt-12 font-medium text-2xl sm:text-3xl">{children}</h2>
);

const components: Components = {
  // Sayfanın h1'i yazının başlığıdır; yazı içindeki # başlıklar h2 olarak çizilir.
  h1: heading,
  h2: heading,
  h3: ({ children }) => <h3 className="mt-10 font-medium text-xl sm:text-2xl">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-8 font-medium text-lg">{children}</h4>,
  p: ({ children }) => <p className="mt-5 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>,
  li: ({ children }) => (
    <li className="pl-1 leading-relaxed marker:text-muted-foreground">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-g-blue border-l-4 pl-5 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-border" />,
  a: ({ href = "", children }) => {
    const className =
      "rounded-sm font-medium text-primary underline underline-offset-4 hover:decoration-2";
    // Site içi linkler dil önekini alsın; dış linkler ve #başlık linkleri olduğu gibi kalır.
    if (href.startsWith("/") && !href.startsWith("/images/")) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  },
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <Image
        src={asset(src)}
        alt={alt ?? ""}
        width={0}
        height={0}
        sizes="(min-width: 768px) 42rem, 100vw"
        className="mt-6 h-auto w-full rounded-3xl"
      />
    ) : null,
  code: ({ children }) => (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-2xl border bg-muted p-4 text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-2xl border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b bg-muted px-4 py-2.5 font-medium">{children}</th>,
  td: ({ children }) => <td className="border-b px-4 py-2.5">{children}</td>,
};

/** Bir blog yazısının gövdesi. Yazı sayfasında `<Markdown>{post.body}</Markdown>` şeklinde kullanılır. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-prose [&>:first-child]:mt-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Tek satırlık metinler (özet gibi) için: sadece **kalın**, *italik* ve `kod` işlenir,
 * paragraf ve link üretmez. Böylece bir `<p>` ya da `<Link>` içine güvenle konabilir.
 */
export function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      allowedElements={["strong", "em", "code"]}
      unwrapDisallowed
      components={{ strong: components.strong, code: components.code }}
    >
      {children}
    </ReactMarkdown>
  );
}
