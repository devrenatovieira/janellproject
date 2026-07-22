import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { contact } from "@/content/site";

export function PublicShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
      <a
        href={contact.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-400"
        aria-label="WhatsApp"
      >
        ✆
      </a>
    </div>
  );
}
