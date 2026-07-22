"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { VLibrasWidget } from "@/components/layout/vlibras";

/** Mostra navbar/footer apenas fora de /admin */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main id="conteudo">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <VLibrasWidget />
    </>
  );
}
