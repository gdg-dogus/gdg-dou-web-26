import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { asset, cn } from "@/lib/utils";
import type { Post } from "../data";
import { InlineMarkdown } from "./markdown";

/** Destedeki kartların duruşu: önce üst üste, deste üzerine gelince yelpaze gibi açılır. */
const fan = [
  "-rotate-6 group-hover/deck:-translate-x-[58%] group-hover/deck:-rotate-12",
  "rotate-0 group-hover/deck:-translate-y-6",
  "rotate-6 group-hover/deck:translate-x-[58%] group-hover/deck:rotate-12",
];

/**
 * Ana sayfadaki "Son yazılar": solda yazı listesi, geniş ekranda sağda kapaklardan bir deste.
 * Deste sadece görsel; aynı linkler listede de olduğu için ekran okuyuculardan gizlenir.
 */
export async function LatestPosts({ posts }: { posts: Post[] }) {
  const t = await getTranslations("home.posts");
  const format = await getFormatter();
  if (posts.length === 0) return null;
  // En yeni yazı destenin en üstünde (en son çizilen) dursun.
  const deck = posts.slice(0, fan.length).reverse();

  return (
    <section aria-labelledby="posts-title" className="mt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div>
              <h2 id="posts-title" className="text-headline">
                {t("title")}
              </h2>
              <p className="mt-3 text-muted-foreground">{t("body")}</p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-sm font-medium text-primary text-sm hover:underline hover:underline-offset-4"
            >
              {t("all")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <ul className="mt-8 divide-y border-y">
            {posts.map((post) => (
              <li key={post.slug}>
                {/* TODO: blog/[slug] sayfası gelince linkler yazının kendisine bağlanacak. */}
                <Link href="/blog" className="group flex gap-5 py-5 sm:px-2">
                  <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden rounded-2xl bg-g-blue/10 lg:hidden">
                    {post.cover ? (
                      <Image
                        src={asset(post.cover)}
                        alt=""
                        fill
                        sizes="6rem"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-sm">
                      <time dateTime={post.date.toISOString().slice(0, 10)}>
                        {format.dateTime(post.date, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      {", "}
                      {t("reading", { minutes: post.readingMinutes })}
                    </p>
                    <h3 className="mt-1.5 font-medium text-lg leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-1 text-muted-foreground text-sm max-sm:hidden">
                      <InlineMarkdown>{post.excerpt}</InlineMarkdown>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden className="group/deck relative h-96 max-lg:hidden">
          {deck.map((post, i) => (
            <Link
              key={post.slug}
              href="/blog"
              tabIndex={-1}
              className={cn(
                "absolute top-10 left-1/2 -ml-36 w-72 overflow-hidden rounded-3xl border bg-card shadow-xl transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
                fan[i],
              )}
            >
              <div className="relative aspect-video bg-g-blue/10">
                {post.cover ? (
                  <Image
                    src={asset(post.cover)}
                    alt=""
                    fill
                    sizes="18rem"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <p className="line-clamp-2 p-4 font-medium leading-snug">{post.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
