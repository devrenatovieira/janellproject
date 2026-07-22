"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Widget oficial VLibras (governo brasileiro) — acessibilidade em Libras.
 * Não carrega no admin para não interferir no painel.
 */
export function VLibrasWidget() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const existing = document.getElementById("vlibras-script");
    if (existing) return;

    const container = document.createElement("div");
    container.setAttribute("vw", "");
    container.className = "enabled";
    container.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(container);

    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const VLibras = (window as any).VLibras;
        if (VLibras?.Widget) {
          new VLibras.Widget("https://vlibras.gov.br/app");
        }
      } catch {
        /* opcional */
      }
    };
    document.body.appendChild(script);

    return () => {
      /* mantém o widget entre navegações do site público */
    };
  }, [pathname]);

  return null;
}
