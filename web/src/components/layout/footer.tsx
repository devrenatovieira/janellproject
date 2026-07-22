import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { contact, nav, site } from "@/content/site";
import { brand } from "@/content/media";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="container-site section-pad !py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-md">
                <Image
                  src={brand.logo}
                  alt={`Logo ${site.name}`}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </span>
              <div>
                <p className="font-semibold text-white">{site.name}</p>
                <p className="text-xs text-slate-400">
                  OSC · Manaus/AM · Desde 1996
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {site.tagline} Promovemos dignidade, esperança e oportunidades no
              Mauazinho e em toda Manaus — acolhimento, convivência e abordagem
              social.
            </p>
            <div className="mt-5 flex gap-3">
              <Social href={contact.social.instagram} label="Instagram">
                <FaInstagram />
              </Social>
              <Social href={contact.social.facebook} label="Facebook">
                <FaFacebook />
              </Social>
              <Social href={contact.social.youtube} label="YouTube">
                <FaYoutube />
              </Social>
              <Social href={contact.whatsappUrl} label="WhatsApp">
                <FaWhatsapp />
              </Social>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navegação
            </h3>
            <ul className="mt-4 columns-2 gap-x-6 space-y-2 text-sm sm:columns-1">
              {nav.map((item) => (
                <li key={item.href} className="break-inside-avoid">
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contato
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span>{contact.fullAddress}</span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all hover:text-white"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <a href={contact.whatsappUrl} className="hover:text-white">
                  WhatsApp {contact.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Transparência
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Consulte relatórios, balanços e termos de fomento no Portal da
              Transparência.
            </p>
            <Link
              href="/transparencia"
              className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Ver portal
            </Link>
            <p className="mt-6 text-xs text-slate-500">
              CNPJ {site.cnpj}
              <br />
              Filiada à {site.affiliation}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-slate-300">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-slate-300">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}
