import Image from "next/image";
import { about, site } from "@/content/site";
import { brand } from "@/content/media";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function AboutTeaser() {
  return (
    <section className="section-pad">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand/15 to-rose-200/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 shadow-2xl shadow-slate-900/10">
              <Image
                src={brand.logoWide}
                alt={`${site.name} — quem somos`}
                width={900}
                height={700}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-2xl border border-white/60 bg-white/90 p-3 shadow-xl backdrop-blur sm:block">
              <div className="relative h-16 w-16">
                <Image
                  src={brand.logo}
                  alt="Logo oficial"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Quem somos
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl text-balance">
              {site.name}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              {about.summary}
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {about.howWeLive}
            </p>
            <p className="mt-4 rounded-2xl border border-brand/15 bg-brand-soft/80 px-4 py-3 text-sm leading-relaxed text-brand-dark">
              {site.reameNote}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/sobre">Conheça</ButtonLink>
              <ButtonLink href="/nossa-historia" variant="outline">
                Nossa história
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
