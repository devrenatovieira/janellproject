"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  Film,
  HandHeart,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Quote,
  Settings,
  Users,
  UsersRound,
  Wallet,
  X,
  Building2,
} from "lucide-react";
import { brand } from "@/content/media";
import { site } from "@/content/site";
import { getAdminToken, setAdminToken } from "@/lib/admin-api";
import { AdminLoginForm } from "@/components/admin/login-form";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/doacoes", label: "Doações", icon: Wallet },
  { href: "/admin/voluntarios", label: "Voluntários", icon: HandHeart },
  {
    href: "/admin/familia-acolhedora",
    label: "Família Acolhedora",
    icon: HeartHandshake,
  },
  { href: "/admin/documentos", label: "Documentos", icon: FileText },
  { href: "/admin/paginas", label: "Páginas", icon: Building2 },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Quote },
  { href: "/admin/servicos", label: "Serviços", icon: Home },
  { href: "/admin/parceiros", label: "Parceiros", icon: Users },
  { href: "/admin/estatisticas", label: "Números", icon: BarChart3 },
  { href: "/admin/videos", label: "Vídeos", icon: Film },
  { href: "/admin/equipe", label: "Equipe", icon: UsersRound },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

const SIDEBAR_W = "18rem"; // w-72

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = getAdminToken();
    setAuthed(!!t);
    setReady(true);
  }, [pathname]);

  const logout = () => {
    setAdminToken(null);
    setAuthed(false);
    router.push("/admin");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Carregando…
      </div>
    );
  }

  if (!authed) {
    return (
      <AdminLoginForm
        onSuccess={() => {
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topo mobile fixo */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">
            <Image
              src={brand.logo}
              alt=""
              fill
              className="object-contain p-0.5"
              sizes="36px"
            />
          </span>
          <span className="text-sm font-semibold text-slate-900">
            Administração
          </span>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-slate-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu lateral SEMPRE fixo — não rola com o conteúdo */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-5 flex shrink-0 items-center gap-3 pt-1">
            <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
              <Image
                src={brand.logo}
                alt=""
                fill
                className="object-contain p-1"
                sizes="44px"
              />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-slate-900">
                Administração
              </p>
              <p className="truncate text-[11px] text-slate-500">{site.name}</p>
            </div>
          </div>

          {/* Só a lista do menu rola se não couber na tela; a barra fica fixa */}
          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain pr-1">
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-brand text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 shrink-0 space-y-1 border-t border-slate-100 pt-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Ver site público
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Conteúdo com margem para o menu fixo — este sim rola */}
      <main
        className="min-h-screen min-w-0 p-4 pt-[4.5rem] md:p-8 md:pt-8 lg:pt-8"
        style={{ marginLeft: 0 }}
      >
        <div className="lg:pl-72">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
