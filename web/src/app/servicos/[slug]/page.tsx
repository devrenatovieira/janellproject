import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services
    .filter((s) => s.slug !== "familia-acolhedora")
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Serviço" };
  return { title: service.name, description: service.short };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "familia-acolhedora") {
    // handled by dedicated route, but keep fallback
  }
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow={service.alsoKnownAs.join(" · ") || "Serviço"}
        title={service.name}
        description={service.short}
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <h2 className="text-xl font-semibold text-slate-900">Sobre o serviço</h2>
          <p className="mt-4 leading-relaxed text-slate-700">{service.about}</p>
          {service.capacity ? (
            <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand-dark">
              Capacidade: {service.capacity} acolhidos (informação oficial).
            </p>
          ) : null}
          {service.full
            ? service.full.split("\n\n").map((p) => (
                <p key={p.slice(0, 32)} className="mt-4 leading-relaxed text-slate-700">
                  {p}
                </p>
              ))
            : null}

          

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/doacao" variant="accent">
              Quero ajudar
            </ButtonLink>
            <ButtonLink href="/servicos" variant="outline">
              Todos os serviços
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
