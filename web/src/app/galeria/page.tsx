import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";
import { brand, galleryImages } from "@/content/media";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Galeria",
  description: `Fotos oficiais do ${site.name}.`,
};

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        eyebrow="Mídia"
        title="Galeria de fotos"
        description={`Momentos do trabalho do ${site.name} com crianças, famílias e a comunidade.`}
      />
      <section className="section-pad">
        <div className="container-site">
          <div className="mb-8 flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-white shadow ring-1 ring-slate-200">
              <Image
                src={brand.logo}
                alt={site.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </span>
            <p className="text-sm text-muted">
              Galeria de fotos do {site.name}
            </p>
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {galleryImages.map((img, i) => (
              <Reveal key={img.src} delay={(i % 6) * 0.04} className="mb-4 break-inside-avoid">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition duration-500 hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="p-3 text-xs text-muted">{img.alt}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
