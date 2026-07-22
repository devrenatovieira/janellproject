import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { StatsSection } from "@/components/home/stats";
import { AboutTeaser } from "@/components/home/about-teaser";
import { ServicesGrid } from "@/components/home/services-grid";
import { InstitutionFacts } from "@/components/home/institution-facts";
import { GalleryTeaser } from "@/components/home/gallery-teaser";
import { MediaPressSection } from "@/components/home/media-press";
import { PartnersSection } from "@/components/home/partners";
import { TestimonialsSection } from "@/components/home/testimonials";
import { CtaDonate } from "@/components/home/cta-donate";
import { TransparencyTeaser } from "@/components/home/transparency-teaser";
import { ContactTeaser } from "@/components/home/contact-teaser";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { apiGet } from "@/lib/api";

export default async function HomePage() {
  const recent = await apiGet<{
    recentPosts?: Array<{
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      publishedAt: string | null;
    }>;
  }>("/public/home");

  const posts = recent?.recentPosts ?? [];

  return (
    <>
      <Hero />
      <StatsSection />
      <AboutTeaser />
      <ServicesGrid />
      <InstitutionFacts />
      <GalleryTeaser />
      <TestimonialsSection />
      <MediaPressSection />
      <PartnersSection />

      {posts.length ? (
        <section className="section-pad bg-white">
          <div className="container-site">
            <Reveal>
              <SectionHeading
                eyebrow="Blog"
                title="Últimas publicações"
                description="Acompanhe notícias e atualizações do Lar Batista Janell Doyle."
              />
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-brand/30 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{post.title}</h3>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-3 inline-block text-sm font-medium text-brand">
                    Ler mais →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <ButtonLink href="/blog" variant="outline">
                Ver todo o blog
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad">
        <div className="container-site">
          <Reveal>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:flex md:items-center md:justify-between md:gap-10 md:p-12">
              <div className="max-w-xl">
                <SectionHeading
                  align="left"
                  eyebrow="Voluntariado"
                  title="Seja voluntário"
                  description="Doe tempo e talento ao Lar Batista Janell Doyle. Preencha o formulário ou fale conosco pelo WhatsApp."
                />
              </div>
              <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row md:mt-0 md:flex-col">
                <ButtonLink href="/voluntario" size="lg">
                  Quero me voluntariar
                </ButtonLink>
                <ButtonLink href="/padrinho" size="lg" variant="outline">
                  Área do padrinho
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaDonate />
      <TransparencyTeaser />
      <ContactTeaser />
    </>
  );
}
