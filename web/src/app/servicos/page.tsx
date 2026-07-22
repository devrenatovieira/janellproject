import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceIcon } from "@/components/shared/service-icon";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Serviço de Convivência, Abordagem Social, Abrigo de Famílias e Família Acolhedora.",
};

export default function ServicosPage() {
  return (
    <>
      <PageHero
        eyebrow="Atuação"
        title="Nossos serviços para a sociedade"
        description="Proteção, convivência e acolhimento com excelência e respeito à dignidade humana."
      />
      <section className="section-pad">
        <div className="container-site grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={
                s.slug === "familia-acolhedora"
                  ? "/familia-acolhedora"
                  : `/servicos/${s.slug}`
              }
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm card-hover"
            >
              <div className="flex items-start gap-4">
                <ServiceIcon iconKey={s.icon} slug={s.slug} size="lg" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    {s.alsoKnownAs.join(" · ") || "Serviço"}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                    {s.name}
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{s.short}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                Saiba mais{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
