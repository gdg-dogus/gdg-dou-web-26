import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { UnderConstruction } from "@/components/under-construction";
import { getPosts } from "@/features/blog/data";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return { title: t("title"), description: t("description") };
}

// TODO: Blog listesi, yazı detay sayfası (blog/[slug]) ve Medium entegrasyonu.
// Yazı gövdesi için: <Markdown>{post.body}</Markdown> (features/blog/components/markdown.tsx)
export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = getPosts(locale);

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} />
      <UnderConstruction>
        <ul className="space-y-3 text-sm">
          {posts.map((p) => (
            <li key={p.slug}>
              <p className="font-medium">{p.title}</p>
              <p className="text-muted-foreground">
                {p.author}, {p.readingMinutes} dk
              </p>
            </li>
          ))}
        </ul>
      </UnderConstruction>
    </>
  );
}
