import Image from "next/image";
import { galleryImages } from "@/content/media";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function GalleryTeaser() {
  const images = galleryImages.slice(0, 8);
  return (
    <section className="section-pad bg-slate-950 text-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            light
            eyebrow="Galeria"
            title="Vidas sendo reescritas"
            description="Imagens do dia a dia do Lar Batista Janell Doyle e das ações com a comunidade."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.04} className="h-full">
              <div
                className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${
                  i % 5 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-60" />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-3">
          <ButtonLink href="/galeria" variant="white">
            Ver galeria completa
          </ButtonLink>
          <ButtonLink
            href="/videos"
            variant="outline"
            className="border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            Ver vídeos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
