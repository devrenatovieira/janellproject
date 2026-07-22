import type { NextConfig } from "next";

const apiOrigin =
  process.env.API_PROXY_ORIGIN ||
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  "";

const nextConfig: NextConfig = {
  // standalone only for Docker; Vercel uses default Next output
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async rewrites() {
    // Same-origin proxy: browser calls /api/v1/* → Nest API
    if (!apiOrigin) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin.replace(/\/$/, "")}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/portaldatransparencia",
        destination: "/transparencia",
        permanent: true,
      },
      {
        source: "/relatoriodeatividades",
        destination: "/transparencia#relatorios",
        permanent: true,
      },
      {
        source: "/balancoanual",
        destination: "/transparencia#balancos",
        permanent: true,
      },
      {
        source: "/transparencia2017",
        destination: "/transparencia/2017",
        permanent: true,
      },
      {
        source: "/transparencia2018",
        destination: "/transparencia/2018",
        permanent: true,
      },
      {
        source: "/transparencia2019",
        destination: "/transparencia/2019",
        permanent: true,
      },
      {
        source: "/transparencia2020",
        destination: "/transparencia/2020",
        permanent: true,
      },
      {
        source: "/transparencia2021",
        destination: "/transparencia/2021",
        permanent: true,
      },
      {
        source: "/transparencia2022",
        destination: "/transparencia/2022",
        permanent: true,
      },
      {
        source: "/transparencia2023",
        destination: "/transparencia/2023",
        permanent: true,
      },
      {
        source: "/transparencia2024",
        destination: "/transparencia/2024",
        permanent: true,
      },
      {
        source: "/2025",
        destination: "/transparencia/2025",
        permanent: true,
      },
      {
        source: "/2026",
        destination: "/transparencia/2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
