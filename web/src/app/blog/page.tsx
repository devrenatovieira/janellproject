import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { apiGet } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notícias e atualizações do ${site.name}.`,
};

type PostList = {
  data: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: string | null;
  }>;
  meta: { total: number };
};

export default async function BlogPage() {
  const result = await apiGet<PostList>("/public/posts?perPage=24");
  const posts = result?.data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Notícias"
        title="Blog"
        description="Atualizações e conteúdos do Lar Batista Janell Doyle."
      />
      <section className="section-pad">
        <div className="container-site">
          {!posts.length ? (
            <p className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-muted">
              Nenhuma publicação disponível no momento. Volte em breve.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                >
                  {post.publishedAt ? (
                    <time className="text-xs font-medium uppercase tracking-wide text-muted">
                      {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  ) : null}
                  <h2 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-brand">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-4 text-sm font-medium text-brand">
                    Ler mais →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
