import type { Metadata } from "next";
import { videos } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Vídeos",
  description:
    "Galeria de vídeos institucionais do Lar Batista Janell Doyle no YouTube.",
};

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="Mídia"
        title="Galeria de Vídeos"
        description="Assista aos vídeos oficiais da instituição e confira realizações e marcos da nossa história."
      />
      <section className="section-pad">
        <div className="container-site grid gap-6 md:grid-cols-2">
          {videos.map((v) => (
            <article
              key={v.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-video bg-slate-900">
                <iframe
                  title={v.title}
                  src={`https://www.youtube.com/embed/${v.id}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-slate-900">{v.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
