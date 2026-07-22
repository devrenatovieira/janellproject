import { Download, FileText } from "lucide-react";
import {
  type TransparencyDoc,
  formatBytes,
  typeLabels,
} from "@/content/transparency";

export function DocumentsList({
  docs,
  emptyMessage = "Nenhum documento disponível para este filtro.",
}: {
  docs: TransparencyDoc[];
  emptyMessage?: string;
}) {
  if (!docs.length) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-muted">
        {emptyMessage}
      </p>
    );
  }

  // group by type
  const groups = new Map<string, TransparencyDoc[]>();
  for (const d of docs) {
    const key = d.type || "OUTRO";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(d);
  }

  const order = [
    "PLANO_TRABALHO",
    "TERMO_FOMENTO",
    "NOTA_EMPENHO",
    "TERMO_ADITIVO",
    "TERMO_APOSTILAMENTO",
    "DIARIO_OFICIAL",
    "EMENDA_PARLAMENTAR",
    "RELATORIO_ATIVIDADES",
    "BALANCO_ANUAL",
    "PRESTACAO_CONTAS",
    "ALVARA_JUDICIAL",
    "TERMO_RESPONSABILIDADE",
    "OUTRO",
  ];

  const sortedKeys = [...groups.keys()].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className="space-y-8">
      {sortedKeys.map((type) => (
        <div key={type}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">
            {typeLabels[type] ?? type}
            <span className="ml-2 font-normal normal-case tracking-normal text-muted">
              ({groups.get(type)!.length})
            </span>
          </h3>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {groups.get(type)!.map((doc) => (
              <li
                key={doc.id + doc.path}
                className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{doc.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      PDF
                      {doc.sizeBytes ? ` · ${formatBytes(doc.sizeBytes)}` : ""}
                      {doc.year ? ` · ${doc.year}` : ""}
                    </p>
                  </div>
                </div>
                {doc.path ? (
                  <a
                    href={doc.path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
                  >
                    <Download className="h-4 w-4" />
                    Baixar
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
