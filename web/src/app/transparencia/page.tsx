import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FileText, FolderOpen, Scale } from "lucide-react";
import { site } from "@/content/site";
import { brand } from "@/content/media";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { DocumentsList } from "@/components/transparency/documents-list";
import {
  availableYears,
  docsByType,
  transparencyDocs,
  transparencyStats,
  typeLabels,
} from "@/content/transparency";

export const metadata: Metadata = {
  title: "Portal da Transparência",
  description: `Documentos, relatórios e balanços do ${site.name}.`,
};

const categories = [
  {
    title: "Fábrica de Sonhos / SCFV",
    desc: "Planos de trabalho e termos de fomento do serviço de convivência.",
  },
  {
    title: "Abordagem Social",
    desc: "Documentos de proteção social especial de média complexidade (REAME).",
  },
  {
    title: "Acolhimento Institucional",
    desc: "Termos e planos do abrigo de famílias e adultos.",
  },
  {
    title: "Família Acolhedora",
    desc: "Instrumentos de SEMASC, FMDCA e demais órgãos parceiros.",
  },
  {
    title: "Emendas",
    desc: "Emendas parlamentares e projetos de fortalecimento da rede.",
  },
  {
    title: "Relatórios e Balanços",
    desc: "Relatórios de atividades e balanços anuais.",
  },
];

export default function TransparenciaPage() {
  const years = availableYears();
  const stats = transparencyStats();
  const balancos = docsByType("BALANCO_ANUAL");
  const relatorios = docsByType("RELATORIO_ATIVIDADES");

  return (
    <>
      <PageHero
        eyebrow="Prestação de contas"
        title="Portal da Transparência"
        description={`Consulta pública aos documentos do ${site.name} (${years[years.length - 1] ?? 2017}–${years[0] ?? 2026}).`}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
              <Image
                src={brand.logo}
                alt={site.name}
                fill
                className="object-contain p-1"
                sizes="56px"
              />
            </span>
            <div>
              <p className="font-semibold text-slate-900">{site.name}</p>
              <p className="text-sm text-muted">
                {stats.total} documentos disponíveis · {stats.years} anos
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: FolderOpen,
                title: "Por ano",
                text: "Navegue pelos documentos publicados em cada exercício.",
              },
              {
                icon: FileText,
                title: "Tipos de documento",
                text: "Planos, termos de fomento, empenhos, aditivos, balanços e relatórios.",
              },
              {
                icon: Scale,
                title: "Acesso público",
                text: "Download livre dos arquivos para consulta da sociedade.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <c.icon className="h-6 w-6 text-brand" />
                <h2 className="mt-3 font-semibold text-slate-900">{c.title}</h2>
                <p className="mt-2 text-sm text-muted">{c.text}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-14 text-2xl font-semibold text-slate-900">
            Anos disponíveis
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {years.map((year) => {
              const count = transparencyDocs.filter(
                (d) => d.year === year && d.path,
              ).length;
              return (
                <Link
                  key={year}
                  href={`/transparencia/${year}`}
                  className="flex h-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 transition hover:border-brand/40 hover:bg-brand-soft hover:text-brand-dark"
                >
                  <span className="text-lg font-semibold">{year}</span>
                  <span className="mt-1 text-[11px] text-muted">
                    {count} documento{count === 1 ? "" : "s"}
                  </span>
                </Link>
              );
            })}
          </div>

          <h2 className="mt-14 text-2xl font-semibold text-slate-900">
            Tipos de documento
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(stats.byType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <span
                  key={type}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {typeLabels[type] ?? type}: {count}
                </span>
              ))}
          </div>

          <h2 className="mt-14 text-2xl font-semibold text-slate-900">
            Categorias de atuação
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm text-muted">{c.desc}</p>
              </div>
            ))}
          </div>

          {balancos.length > 0 ? (
            <div id="balancos" className="mt-14 scroll-mt-28">
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Balanços anuais
              </h2>
              <DocumentsList docs={balancos} />
            </div>
          ) : null}

          {relatorios.length > 0 ? (
            <div id="relatorios" className="mt-14 scroll-mt-28">
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Relatórios de atividades
              </h2>
              <DocumentsList docs={relatorios} />
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/doacao" variant="accent">
              Apoiar a instituição
            </ButtonLink>
            <ButtonLink href="/contato" variant="outline">
              Solicitar informação
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
