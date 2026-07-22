import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { RouteProgress } from "@/components/layout/route-progress";
import { PublicShell } from "@/components/layout/public-shell";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { site } from "@/content/site";
import { brand } from "@/content/media";
import "./globals.css";

/**
 * Hobby plan Vercel: max 12 Serverless Functions.
 * Force static HTML for all pages (admin is client-side anyway).
 */
export const dynamic = "force-static";
export const revalidate = 60;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Manaus/AM`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: brand.icon, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "pt_BR",
    type: "website",
    images: [{ url: brand.og, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [brand.og],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ScrollToTop />
        <RouteProgress />
        <PageViewTracker />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
