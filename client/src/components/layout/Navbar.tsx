import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { contact, navPrimary, site } from "@/content/site";
import { brand } from "@/content/media";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "glass border-b border-slate-200/70 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 md:h-[4.75rem]">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src={brand.logo}
            alt={`Logo ${site.name}`}
            className="h-11 w-11 rounded-2xl bg-white object-contain p-1 shadow-md ring-1 ring-black/5"
          />
          <span
            className={cn(
              "truncate text-sm font-semibold leading-tight sm:text-base",
              scrolled || open ? "text-slate-900" : "text-white",
            )}
          >
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navPrimary.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-100"
                    : isActive
                      ? "bg-white/15 text-white"
                      : "text-white/85 hover:bg-white/10",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/doacao"
            className="ml-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-500"
          >
            Doar
          </Link>
        </nav>

        <button
          type="button"
          className={cn(
            "rounded-xl p-2 lg:hidden",
            scrolled || open ? "text-slate-800" : "text-white",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navPrimary.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-lg bg-emerald-600 px-3 py-3 text-center text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
