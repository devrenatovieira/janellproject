import { Link } from "react-router-dom";
import { contact, site } from "@/content/site";
import { brand } from "@/content/media";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={brand.logo}
              alt=""
              className="h-12 w-12 rounded-2xl bg-white object-contain p-1"
            />
            <div>
              <p className="font-semibold text-white">{site.name}</p>
              <p className="text-xs text-slate-400">{site.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {site.descriptionLong}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Contato</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{contact.fullAddress}</li>
            <li>
              <a className="hover:text-white" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
            <li>
              <a
                className="hover:text-white"
                href={contact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp {contact.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="hover:text-white" to="/sobre">
                Sobre
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/transparencia">
                Transparência
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/doacao">
                Doação
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/admin">
                Área administrativa
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs text-slate-500">CNPJ {site.cnpj}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
