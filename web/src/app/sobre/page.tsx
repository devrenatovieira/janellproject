import type { Metadata } from "next";
import Image from "next/image";
import { about, site, services } from "@/content/site";
import { brand, serviceIcons } from "@/content/media";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: about.summary.slice(0, 155),
};

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Quem somos"
        description={site.tagline}
      />
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
            <Image
              src={brand.logoWide}
              alt="Lar Batista Janell Doyle"
              width={900}
              height={700}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          </Reveal>
          <Reveal delay={0.08}>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white shadow ring-1 ring-slate-200">
                <Image
                  src={brand.logo}
                  alt={site.name}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                Quem somos
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              {site.name}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{about.summary}</p>
            <p className="mt-4 leading-relaxed text-slate-700">
              {about.howWeLive}
            </p>
            <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
              {site.reameNote}
            </p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand-soft p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Fundação
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {site.foundedDisplay}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Filiação
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {site.affiliation}
                </dd>
              </div>
            </dl>
          </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-slate-50">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={brand.estruturaServicos}
                alt="Serviços e Projetos Janell Doyle"
                width={900}
                height={640}
                className="h-auto w-full object-cover"
              />
              <p className="p-4 text-sm font-medium text-slate-700">
                Serviços e projetos do Lar Batista Janell Doyle
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={brand.estruturaOrg}
                alt="Estrutura Organizacional"
                width={900}
                height={640}
                className="h-auto w-full object-cover"
              />
              <p className="p-4 text-sm font-medium text-slate-700">
                Estrutura organizacional
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {[
            { title: "Missão", body: about.mission },
            { title: "Visão", body: about.vision },
            {
              title: "Valores",
              body: about.values.join(" · "),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Nossos serviços
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={
                  s.slug === "familia-acolhedora"
                    ? "/familia-acolhedora"
                    : `/servicos/${s.slug}`
                }
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand/30 hover:shadow-md"
              >
                {serviceIcons[s.slug] ? (
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
                    <Image src={serviceIcons[s.slug]} alt="" fill className="object-contain p-1.5" sizes="48px" />
                  </span>
                ) : null}
                <div>
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted">{s.about}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/doacao" variant="accent">
              Como ajudar?
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
