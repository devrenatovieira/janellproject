import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { apiGet } from "@/lib/api";

type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  content: string;
};

export async function TestimonialsSection() {
  const items = await apiGet<Testimonial[]>("/public/testimonials");
  if (!items?.length) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Depoimentos"
            title="Vozes que caminham conosco"
            description="Mensagens oficiais de quem vive e sustenta a missão do Lar Batista Janell Doyle."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <blockquote className="relative h-full rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-brand/15" />
                <p className="text-base leading-relaxed text-slate-700 md:text-[15px]">
                  “{t.content}”
                </p>
                <footer className="mt-5 border-t border-slate-200 pt-4">
                  <p className="font-semibold text-slate-900">{t.authorName}</p>
                  {t.authorRole ? (
                    <p className="text-sm text-muted">{t.authorRole}</p>
                  ) : null}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
