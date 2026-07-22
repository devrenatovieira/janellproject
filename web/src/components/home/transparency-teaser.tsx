import { FileText, BarChart3, Scale } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { transparencyYears } from "@/content/site";

export function TransparencyTeaser() {
  return (
    <section className="section-pad mesh-soft">
      <div className="container-site">
        <SectionHeading
          eyebrow="Transparência"
          title="Prestação de contas com clareza"
          description="Portal com documentos oficiais de 2017 a 2026: planos de trabalho, termos de fomento, relatórios e balanços."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Documentos oficiais",
              text: "Planos de trabalho, termos de fomento, empenhos e publicações oficiais.",
            },
            {
              icon: BarChart3,
              title: "Por ano e por serviço",
              text: "Consulte documentos organizados por exercício e linha de atuação.",
            },
            {
              icon: Scale,
              title: "Prestação de contas",
              text: "Relatórios de atividades e balanços anuais disponíveis para consulta.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <item.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {transparencyYears.slice(0, 6).map((y) => (
            <span
              key={y}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
            >
              {y}
            </span>
          ))}
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            +{transparencyYears.length - 6} anos
          </span>
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/transparencia">Abrir portal</ButtonLink>
        </div>
      </div>
    </section>
  );
}
