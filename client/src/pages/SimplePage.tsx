import type { ReactNode } from "react";

export function SimplePage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-gradient-to-br from-cyan-900 to-slate-900 px-4 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-3xl text-lg text-white/75">{subtitle}</p>
          ) : null}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">{children}</section>
    </>
  );
}
