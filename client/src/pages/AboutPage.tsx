import { about, site } from "@/content/site";
import { SimplePage } from "./SimplePage";

export function AboutPage() {
  return (
    <SimplePage title="Sobre nós" subtitle={site.type}>
      <div className="prose prose-slate max-w-3xl">
        <p className="text-lg leading-relaxed text-slate-700">{about.summary}</p>
        <h2 className="mt-10 text-2xl font-bold text-slate-900">Missão</h2>
        <p className="mt-3 text-slate-600">{about.mission}</p>
        <h2 className="mt-10 text-2xl font-bold text-slate-900">Visão</h2>
        <p className="mt-3 text-slate-600">{about.vision}</p>
        <h2 className="mt-10 text-2xl font-bold text-slate-900">Valores</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {about.values.map((v) => (
            <li
              key={v}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-medium text-slate-800 shadow-sm"
            >
              {v}
            </li>
          ))}
        </ul>
      </div>
    </SimplePage>
  );
}
