import Image from "next/image";
import { brand } from "@/content/media";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden gradient-hero pb-16 pt-28 text-white md:pb-20 md:pt-32">
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <Image
          src={brand.hero}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="container-site relative">
        <div className="mb-4 flex items-center gap-3">
          <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-white shadow-md">
            <Image
              src={brand.logo}
              alt=""
              fill
              className="object-contain p-1"
              sizes="44px"
            />
          </span>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
              {eyebrow}
            </p>
          ) : null}
        </div>
        <h1 className="mt-1 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
