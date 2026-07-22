"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { about, site } from "@/content/site";
import { brand, heroSlides } from "@/content/media";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 1.15 }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[index].src}
              alt={heroSlides[index].alt}
              fill
              priority={index === 0}
              className={reduce ? "object-cover" : "object-cover kenburns"}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/92" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,116,144,0.42),_transparent_55%)]" />
        {!reduce ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
          >
            <div className="absolute left-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/80" />
            <div className="absolute left-[72%] top-[20%] h-1 w-1 rounded-full bg-cyan-200/90" />
            <div className="absolute left-[38%] top-[68%] h-1 w-1 rounded-full bg-white/50" />
            <div className="absolute left-[88%] top-[52%] h-2 w-2 rounded-full bg-rose-200/40 blur-[1px]" />
          </div>
        ) : null}
      </div>

      <div className="container-site relative z-10 flex min-h-[100svh] flex-col justify-center pb-28 pt-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-white/30 sm:h-[4.5rem] sm:w-[4.5rem]">
              <Image
                src={brand.logo}
                alt={`Logo ${site.name}`}
                fill
                className="object-contain p-1.5"
                sizes="72px"
                priority
              />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white sm:text-base">
                {site.name}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-cyan-100/90">
                OSC · Manaus/AM · Desde 1996
              </p>
            </div>
          </div>

          <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
            Organização da Sociedade Civil · Mauazinho
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[3.6rem] lg:leading-[1.08]">
            {site.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl">
            {about.missionHeadline} {about.homeIntro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/doacao" variant="accent" size="lg">
              Doe Agora
            </ButtonLink>
            <ButtonLink href="/nossa-historia" variant="white" size="lg">
              Conheça nossa história
            </ButtonLink>
            <ButtonLink
              href="/sobre"
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Quem somos
            </ButtonLink>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="scroll-indicator h-5 w-5" />
        </div>

        <div className="absolute bottom-8 right-4 hidden gap-2 md:flex">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-white"
                  : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
