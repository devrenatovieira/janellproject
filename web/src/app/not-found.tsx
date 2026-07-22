import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-site max-w-xl py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Página não encontrada
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          O endereço pode ter mudado ou a página não existe. Volte ao início ou
          fale conosco.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Ir para o início</ButtonLink>
          <ButtonLink href="/contato" variant="outline">
            Contato
          </ButtonLink>
        </div>
        <p className="mt-8 text-xs text-muted">
          <Link href="/transparencia" className="hover:underline">
            Transparência
          </Link>
          {" · "}
          <Link href="/doacao" className="hover:underline">
            Doação
          </Link>
          {" · "}
          <Link href="/servicos" className="hover:underline">
            Serviços
          </Link>
        </p>
      </div>
    </section>
  );
}
