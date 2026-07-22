import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { apiGet } from "@/lib/api";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyMd: string;
  bodyHtml: string | null;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await apiGet<Post>(`/public/posts/${slug}`);
  if (!post) return { title: "Publicação" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
  };
}

function renderMd(md: string) {
  // Minimal safe markdown: paragraphs + bold + links (no HTML injection)
  return md
    .split(/\n\n+/)
    .map((block) => {
      let html = block
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-brand underline underline-offset-2">$1</a>',
      );
      html = html.replace(/\n/g, "<br />");
      return `<p class="mb-4 leading-relaxed text-slate-700">${html}</p>`;
    })
    .join("");
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await apiGet<Post>(`/public/posts/${slug}`);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={post.title}
        description={post.excerpt || undefined}
      />
      <article className="section-pad">
        <div className="container-site max-w-3xl">
          {post.publishedAt ? (
            <time className="text-sm text-muted">
              {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : null}
          <div
            className="prose-site mt-6 text-base"
            dangerouslySetInnerHTML={{
              __html: post.bodyHtml || renderMd(post.bodyMd),
            }}
          />
          <div className="mt-10 border-t border-slate-200 pt-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-brand hover:underline"
            >
              ← Voltar ao blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
