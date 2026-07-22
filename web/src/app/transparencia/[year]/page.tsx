import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { DocumentsList } from "@/components/transparency/documents-list";
import {
  availableYears,
  docsByYear,
  transparencyStats,
} from "@/content/transparency";

type Props = { params: Promise<{ year: string }> };

export async function generateStaticParams() {
  return availableYears().map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Transparência ${year}`,
    description: `Documentos e prestações de contas do exercício ${year} — Lar Batista Janell Doyle.`,
  };
}

export default async function TransparenciaYearPage({ params }: Props) {
  const { year } = await params;
  const y = Number(year);
  const years = availableYears();
  if (!years.includes(y)) notFound();

  const docs = docsByYear(y);

  return (
    <>
      <PageHero
        eyebrow="Portal da Transparência"
        title={`Exercício ${year}`}
        description={`${docs.length} documento${docs.length === 1 ? "" : "s"} disponível${docs.length === 1 ? "" : "eis"} para download.`}
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/transparencia"
              className="text-sm font-semibold text-brand hover:underline"
            >
              ← Voltar ao portal
            </Link>
            <p className="text-xs text-muted">
              Total no portal: {transparencyStats().total} documentos
            </p>
          </div>
          <DocumentsList
            docs={docs}
            emptyMessage={`Nenhum documento encontrado para ${year}.`}
          />
        </div>
      </section>
    </>
  );
}
