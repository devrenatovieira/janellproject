"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  HandHeart,
  MapPin,
  ScrollText,
  Users,
  Megaphone,
} from "lucide-react";
import { site } from "@/content/site";
import { extraInstitutionalFacts } from "@/content/media-press";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const icons = [Building2, Users, ScrollText, HandHeart, MapPin, Megaphone];

export function InstitutionFacts() {
  const reduce = useReducedMotion();

  return (
    <section className="section-pad mesh-soft">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Conheça mais"
            title={`Mais sobre o ${site.name}`}
            description="Missão social, território de atuação e parcerias que sustentam o nosso trabalho em Manaus."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {extraInstitutionalFacts.map((fact, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={fact.title} delay={i * 0.05}>
                <motion.div
                  whileHover={reduce ? undefined : { y: -5 }}
                  className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm card-hover"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {fact.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {fact.text}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-soft to-white p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Identidade
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 md:text-lg">
              <strong>{site.name}</strong> — {site.type}. Filiada à{" "}
              {site.affiliation}. Inaugurada em {site.foundedDisplay}, no bairro{" "}
              {site.community}, {site.city}/{site.state}. Direção institucional
              registrada na história oficial: {site.director.name} (
              {site.director.role}).
            </p>
            <p className="mt-3 text-sm text-muted">{site.reameNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
