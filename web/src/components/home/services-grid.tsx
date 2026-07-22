import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ServiceIcon } from "@/components/shared/service-icon";

export function ServicesGrid() {
  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Nossos serviços"
            title="Cuidado integral para quem mais precisa"
            description="Quatro frentes oficiais de atuação: convivência, abordagem social, abrigo de famílias e família acolhedora."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.06}>
              <Link
                href={
                  service.slug === "familia-acolhedora"
                    ? "/familia-acolhedora"
                    : `/servicos/${service.slug}`
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 md:p-8 card-hover"
              >
                <div className="mb-5 flex items-center gap-4">
                  <ServiceIcon
                    iconKey={service.icon}
                    slug={service.slug}
                    size="md"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {service.name}
                    </h3>
                    {service.alsoKnownAs.length > 0 ? (
                      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-brand">
                        {service.alsoKnownAs.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted md:text-[15px]">
                  {service.short}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition group-hover:gap-2.5">
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
