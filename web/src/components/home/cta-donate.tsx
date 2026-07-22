import Image from "next/image";
import { donations } from "@/content/site";
import { brand } from "@/content/media";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaDonate() {
  return (
    <section className="section-pad">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-600 via-accent to-rose-800 px-6 py-14 text-white shadow-2xl shadow-rose-900/20 md:px-12 md:py-16">
            <div className="absolute -right-6 top-6 hidden opacity-25 md:block">
              <div className="relative h-40 w-40 overflow-hidden rounded-3xl bg-white/90 p-2">
                <Image
                  src={brand.logo}
                  alt=""
                  fill
                  className="object-contain p-3"
                  sizes="160px"
                />
              </div>
            </div>
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">
                Transforme vidas
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl text-balance">
                {donations.headline} Sua generosidade sustenta acolhimento e
                esperança.
              </h2>
              <p className="mt-4 text-base text-rose-50/90 md:text-lg">
                Todo ano, centenas de crianças se encontram em situação de risco
                social. Com a sua ajuda, estamos fazendo a diferença.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/doacao" variant="white" size="lg">
                  Quero doar
                </ButtonLink>
                <ButtonLink
                  href={donations.partnerUrl}
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  external
                >
                  {donations.partnerLabel}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
