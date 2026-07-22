import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { DonationPanel } from "@/components/donations/donation-panel";

export const metadata: Metadata = {
  title: "Doação",
  description:
    "Doe pelo PIX para o Lar Batista Janell Doyle. Contas e chaves oficiais da instituição.",
};

export default function DoacaoPage() {
  return (
    <>
      <PageHero
        eyebrow="Captação · Lar Batista Janell Doyle"
        title="Doação"
        description="Sua generosidade sustenta o trabalho do Lar Batista Janell Doyle — acolhimento, convivência e esperança no Mauazinho."
      />
      <section className="section-pad">
        <DonationPanel />
      </section>
    </>
  );
}
