"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { API_URL } from "@/lib/api";

/**
 * Contabiliza visualizações de página (site público) na API.
 * Falha silenciosa se a API estiver offline.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Não conta rotas admin no contador público (admin tem contador próprio)
    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();
    void fetch(`${API_URL}/public/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      /* offline ok */
    });

    return () => controller.abort();
  }, [pathname]);

  return null;
}
