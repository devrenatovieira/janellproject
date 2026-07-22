import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { apiGet } from "@/lib/api";

type CmsPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyMd: string;
  bodyHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await apiGet<CmsPage>(`/public/pages/${slug}`);
  if (!page) return { title: "Página" };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt || undefined,
  };
}

function renderMd(md: string) {
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

export default async function DynamicCmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await apiGet<CmsPage>(`/public/pages/${slug}`);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title={page.title}
        description={page.excerpt || undefined}
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <div
            className="text-base"
            dangerouslySetInnerHTML={{
              __html: page.bodyHtml || renderMd(page.bodyMd),
            }}
          />
        </div>
      </section>
    </>
  );
}
