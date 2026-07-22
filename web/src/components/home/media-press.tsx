"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Newspaper, Radio, Tv } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { pressItems } from "@/content/media-press";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const years = [
  "Todos",
  ...Array.from(new Set(pressItems.map((p) => String(p.year)))).sort(
    (a, b) => Number(b) - Number(a),
  ),
];

function iconFor(tags: string[]) {
  if (tags.some((t) => /tv|youtube/i.test(t))) return Tv;
  if (tags.some((t) => /rádio|radio/i.test(t))) return Radio;
  return Newspaper;
}

export function MediaPressSection() {
  const [year, setYear] = useState("Todos");
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    if (year === "Todos") return pressItems;
    return pressItems.filter((p) => String(p.year) === year);
  }, [year]);

  return (
    <section className="section-pad bg-slate-950 text-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            light
            eyebrow="Janell na mídia"
            title="O Lar Batista Janell Doyle nos noticiários"
            description="Acompanhe reportagens, visitas e iniciativas que marcaram a trajetória do Lar Batista Janell Doyle na imprensa e na vida pública."
          />
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                year === y
                  ? "border-cyan-300 bg-cyan-400/20 text-cyan-100"
                  : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10",
              )}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {filtered.map((item, i) => {
            const Icon = iconFor(item.tags);
            return (
              <Reveal key={item.url} delay={i * 0.05}>
                <motion.a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-300/30 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-100">
                      <Icon className="h-3.5 w-3.5" />
                      {item.year}
                    </span>
                    <ExternalLink className="h-4 w-4 text-white/40 transition group-hover:text-cyan-200" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-cyan-50">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                    <p className="text-xs font-medium text-slate-400">
                      {item.source}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/videos" variant="white">
            Ver vídeos oficiais
          </ButtonLink>
          <ButtonLink
            href="/transparencia"
            variant="outline"
            className="border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            Portal da Transparência
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
