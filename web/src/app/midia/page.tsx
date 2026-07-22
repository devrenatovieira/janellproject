import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { MediaPressSection } from "@/components/home/media-press";

export const metadata: Metadata = {
  title: "Janell na Mídia",
  description: `Matérias e aparições do ${site.name} na imprensa e em visitas oficiais.`,
};

export default function MidiaPage() {
  return (
    <>
      <PageHero
        eyebrow="Imprensa e visitas"
        title="Janell na Mídia"
        description={`Reportagens, visitas e iniciativas que destacam o trabalho do ${site.name}.`}
      />
      <MediaPressSection />
    </>
  );
}
