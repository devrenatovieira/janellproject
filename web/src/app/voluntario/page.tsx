import type { Metadata } from "next";
import { contact, site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { VolunteerForm } from "@/components/volunteers/volunteer-form";

export const metadata: Metadata = {
  title: "Voluntariado",
  description: `Cadastre-se como voluntário do ${site.name}. Doe tempo e talento em Manaus.`,
};

export default function VoluntarioPage() {
  return (
    <>
      <PageHero
        eyebrow="Participe"
        title="Seja voluntário"
        description="Doe tempo e talento ao Lar Batista Janell Doyle. Preencha o formulário e nossa equipe entrará em contato."
      />
      <section className="section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Como você pode ajudar
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 md:text-[15px]">
              O trabalho do {site.name} se fortalece com pessoas sensíveis às
              necessidades de crianças, adolescentes e famílias da comunidade do
              Mauazinho e de Manaus. Voluntários apoiam atividades de
              convivência, eventos, comunicação e o dia a dia da instituição.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                Apoio em atividades e eventos
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                Reforço escolar e convivência
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                Comunicação, campanhas e doações
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={contact.whatsappUrl} variant="outline" external>
                Falar no WhatsApp
              </ButtonLink>
              <ButtonLink href="/doacao" variant="ghost">
                Prefiro doar
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-3">
            <VolunteerForm />
          </div>
        </div>
      </section>
    </>
  );
}
