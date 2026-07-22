import docsJson from "./transparency-docs.json";

export type TransparencyDocType =
  | "PLANO_TRABALHO"
  | "TERMO_FOMENTO"
  | "NOTA_EMPENHO"
  | "DIARIO_OFICIAL"
  | "TERMO_ADITIVO"
  | "TERMO_APOSTILAMENTO"
  | "PRESTACAO_CONTAS"
  | "ALVARA_JUDICIAL"
  | "TERMO_RESPONSABILIDADE"
  | "EMENDA_PARLAMENTAR"
  | "RELATORIO_ATIVIDADES"
  | "BALANCO_ANUAL"
  | "OUTRO";

export type TransparencyDoc = {
  id: string;
  title: string;
  year: number | null;
  type: TransparencyDocType | string;
  sourceUrl: string;
  path: string | null;
  sizeBytes: number | null;
  pages: string[];
};

export const transparencyDocs = docsJson as TransparencyDoc[];

export const typeLabels: Record<string, string> = {
  PLANO_TRABALHO: "Plano de Trabalho",
  TERMO_FOMENTO: "Termo de Fomento",
  NOTA_EMPENHO: "Nota de Empenho",
  DIARIO_OFICIAL: "Diário Oficial",
  TERMO_ADITIVO: "Termo Aditivo",
  TERMO_APOSTILAMENTO: "Termo de Apostilamento",
  PRESTACAO_CONTAS: "Prestação de Contas",
  ALVARA_JUDICIAL: "Alvará Judicial",
  TERMO_RESPONSABILIDADE: "Termo de Responsabilidade",
  EMENDA_PARLAMENTAR: "Emenda Parlamentar",
  RELATORIO_ATIVIDADES: "Relatório de Atividades",
  BALANCO_ANUAL: "Balanço Anual",
  OUTRO: "Documento",
};

export function docsByYear(year: number) {
  return transparencyDocs
    .filter((d) => d.year === year && d.path)
    .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

export function docsByType(type: string) {
  return transparencyDocs.filter((d) => d.type === type && d.path);
}

export function availableYears() {
  const years = [
    ...new Set(
      transparencyDocs
        .map((d) => d.year)
        .filter((y): y is number => typeof y === "number"),
    ),
  ];
  return years.sort((a, b) => b - a);
}

export function formatBytes(n?: number | null) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function transparencyStats() {
  const withFile = transparencyDocs.filter((d) => d.path);
  const byType: Record<string, number> = {};
  for (const d of withFile) {
    byType[d.type] = (byType[d.type] ?? 0) + 1;
  }
  return {
    total: withFile.length,
    years: availableYears().length,
    byType,
  };
}
