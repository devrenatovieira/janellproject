"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { contact, nav, navMore, navPrimary, site } from "@/content/site";
import { brand } from "@/content/media";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const linkClass = (scrolledBar: boolean) =>
    cn(
      "rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors 2xl:px-3 2xl:text-sm",
      scrolledBar
        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        : "text-white/85 hover:bg-white/10 hover:text-white",
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "glass border-b border-slate-200/70 shadow-sm"
          : "bg-transparent",
      )}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm"
      >
        Pular para o conteúdo
      </a>

      <div className="container-site flex h-[4.25rem] items-center justify-between gap-3 md:h-[4.75rem]">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-center gap-2.5 sm:flex-none sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <span
            className={cn(
              "relative shrink-0 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all",
              scrolled || open ? "h-11 w-11" : "h-12 w-12 md:h-[3.25rem] md:w-[3.25rem]",
            )}
          >
            <Image
              src={brand.logo}
              alt={`Logo ${site.name}`}
              fill
              className="object-contain p-1"
              sizes="52px"
              priority
            />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span
              className={cn(
                "font-semibold tracking-tight transition-all",
                scrolled || open
                  ? "text-[13px] text-slate-900 sm:text-sm"
                  : "text-[13px] text-white sm:text-sm md:text-[15px]",
              )}
            >
              <span className="block truncate sm:whitespace-normal">
                Lar Batista
              </span>
              <span className="block truncate sm:whitespace-normal">
                Janell Doyle
              </span>
            </span>
            <span
              className={cn(
                "mt-0.5 text-[10px] uppercase tracking-[0.12em] transition-colors",
                scrolled || open ? "text-muted" : "text-white/70",
              )}
            >
              Manaus · AM · Desde 1996
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Principal"
        >
          {navPrimary.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(scrolled)}>
              {item.label}
            </Link>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className={cn(linkClass(scrolled), "inline-flex items-center gap-1")}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen((v) => !v)}
            >
              Mais
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition", moreOpen && "rotate-180")}
              />
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
                {navMore.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink
            href="/doacao"
            variant="accent"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Doe Agora
          </ButtonLink>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full xl:hidden",
              scrolled || open
                ? "bg-slate-100 text-slate-800"
                : "bg-white/10 text-white",
            )}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200/70 bg-white xl:hidden">
          <div className="container-site border-b border-slate-100 py-3">
            <p className="text-sm font-semibold text-slate-900">{site.name}</p>
            <p className="text-xs text-muted">
              Organização da Sociedade Civil · Manaus/AM
            </p>
          </div>
          <nav
            className="container-site flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-4"
            aria-label="Mobile"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <div onClick={() => setOpen(false)}>
                <ButtonLink href="/doacao" variant="accent" className="w-full">
                  Doe Agora
                </ButtonLink>
              </div>
              <ButtonLink href={contact.whatsappUrl} variant="outline" external>
                WhatsApp
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
