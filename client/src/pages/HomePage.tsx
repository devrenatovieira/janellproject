import { Link } from "react-router-dom";
import { about, contact, services, site } from "@/content/site";
import { brand } from "@/content/media";

export function HomePage() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-slate-950 text-white">
        <img
          src={brand.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-32">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-200/90">
            Manaus · AM · desde {site.foundedYear}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-base text-white/70">
            {about.homeIntro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/doacao"
              className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-rose-500"
            >
              Quero doar
            </Link>
            <Link
              to="/sobre"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Conheça nossa história
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">
              Quem somos
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {about.missionHeadline}
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{about.summary}</p>
            <Link
              to="/nossa-historia"
              className="mt-6 inline-flex text-sm font-semibold text-cyan-800 hover:underline"
            >
              Ler nossa história →
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-slate-200">
            <img
              src={brand.historia}
              alt={`${site.name} — sede`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-slate-900">Nossos serviços</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Programas oficiais de acolhimento, convivência e abordagem social.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                to={`/servicos/${s.slug}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {s.short}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-cyan-800 to-slate-900 px-8 py-12 text-white shadow-xl md:px-12">
          <h2 className="text-3xl font-bold">Faça parte dessa história</h2>
          <p className="mt-3 max-w-2xl text-white/80">
            Doações, voluntariado e apadrinhamento sustentam o trabalho com
            crianças, adolescentes e famílias do Mauazinho.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/doacao"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Doar agora
            </Link>
            <Link
              to="/voluntario"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
            >
              Ser voluntário
            </Link>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
