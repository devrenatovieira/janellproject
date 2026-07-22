"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function StatCard({
  label,
  value,
  suffix,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const n = useCountUp(value, active);
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm card-hover">
      <p className="text-4xl font-semibold tracking-tight text-brand-dark md:text-5xl">
        {n}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-muted">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-pad mesh-soft" ref={ref}>
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Impacto"
            title="Números que contam nossa trajetória"
            description="Números que traduzem décadas de acolhimento, proteção e serviço à sociedade amazonense."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.05}>
              <StatCard
                label={s.label}
                value={s.value}
                suffix={s.suffix}
                active={active}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
