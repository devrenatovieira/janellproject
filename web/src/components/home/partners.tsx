"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { contact } from "@/content/site";
import { partnerLogos } from "@/content/media";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function PartnersSection() {
  const loop = [...partnerLogos, ...partnerLogos];
  const reduce = useReducedMotion();

  return (
    <section className="section-pad overflow-hidden bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Nossos padrinhos"
            title="Juntos por quem precisa"
            description="Igrejas, empresas e órgãos públicos que caminham conosco nessa missão."
          />
        </Reveal>
      </div>
      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max partner-marquee gap-5 px-4">
          {loop.map((p, i) => (
            <motion.a
              key={`${p.name}-${i}`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              title={p.name}
              whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="flex h-40 w-56 shrink-0 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 shadow-sm transition hover:border-brand/35 hover:shadow-md"
            >
              <span className="relative h-20 w-full sm:h-[5.5rem]">
                <Image
                  src={p.logo}
                  alt={p.name}
                  fill
                  className="object-contain"
                  sizes="220px"
                />
              </span>
              <span className="line-clamp-2 text-center text-xs font-medium text-slate-600">
                {p.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
      <div className="container-site mt-10 flex justify-center">
        <ButtonLink href={contact.whatsappUrl} variant="outline" external>
          Seja um Padrinho!
        </ButtonLink>
      </div>
    </section>
  );
}
