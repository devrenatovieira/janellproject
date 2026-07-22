import type { Metadata } from "next";
import Image from "next/image";
import { history, site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nossa História",
  description:
    "A história do Lar Batista Janell Doyle, contada pela diretora Magaly Araújo.",
};

export default function HistoriaPage() {
  return (
    <>
      <PageHero
        eyebrow="Trajetória"
        title="Nossa História"
        description="Um sonho acolhido pelas mulheres batistas que se tornou casa de esperança em Manaus."
      />
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
              <Image
                src="/images/brand/historia.jpg"
                alt="História institucional"
                width={600}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="mt-4 text-center text-sm text-muted">
              {history.author} — {history.authorRole}
            </p>
          </div>
          <div>
            <div className="space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
              {history.fullText.split("\n\n").map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>

            <ol className="mt-12 space-y-6 border-l-2 border-brand/30 pl-6">
              {history.timeline.map((item) => (
                <li key={item.year} className="relative">
                  <span className="absolute -left-[1.95rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand bg-white" />
                  <p className="text-sm font-semibold text-brand">{item.year}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                    {item.event}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/sobre">Quem somos</ButtonLink>
              <ButtonLink href="/doacao" variant="accent">
                Apoie essa história
              </ButtonLink>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
