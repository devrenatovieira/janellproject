/** Caminhos das imagens oficiais do site (crawl FASE 1). */

export const brand = {
  logo: "/images/brand/logo.png",
  logoWide: "/images/brand/logo-institucional.png",
  /** Ícone da aba (logo oficial redimensionado) */
  icon: "/images/brand/icon.png",
  favicon: "/favicon.ico",
  appleIcon: "/apple-touch-icon.png",
  og: "/images/brand/og.png",
  hero: "/images/brand/hero-banner.jpg",
  historia: "/images/brand/historia.jpg",
  familiaAcolhedora: "/images/brand/familia-acolhedora.png",
  doacao: "/images/brand/doacao-capa.png",
  pixQr: "/images/brand/pix-qr.jpeg",
  estruturaServicos: "/images/brand/estrutura-servicos.jpg",
  estruturaOrg: "/images/brand/estrutura-org.jpg",
} as const;

export const serviceIcons: Record<string, string> = {
  "servico-de-convivencia": "/images/services/convivencia.png",
  "abordagem-social": "/images/services/abordagem.png",
  "abrigo-institucional": "/images/services/abrigo.png",
  "familia-acolhedora": "/images/services/familia-acolhedora.png",
};

export const galleryImages = [
  { src: "/images/gallery/01.jpg", alt: "Atividades do Lar Batista Janell Doyle" },
  { src: "/images/gallery/02.jpg", alt: "Momento institucional" },
  { src: "/images/gallery/03.jpg", alt: "Comunidade e acolhimento" },
  { src: "/images/gallery/04.jpg", alt: "Cuidado e convivência" },
  { src: "/images/gallery/05.jpg", alt: "Equipe e serviços" },
  { src: "/images/gallery/06.jpg", alt: "Projetos sociais" },
  { src: "/images/gallery/07.jpg", alt: "Ações na comunidade" },
  { src: "/images/gallery/08.jpg", alt: "Fortalecimento de vínculos" },
  { src: "/images/gallery/09.jpg", alt: "Espaços e rotina" },
  { src: "/images/gallery/10.jpg", alt: "Encontros e atividades" },
  { src: "/images/gallery/11.jpg", alt: "Trabalho social" },
  { src: "/images/gallery/12.jpg", alt: "Histórias de recomeço" },
  { src: "/images/gallery/13.jpg", alt: "Família e proteção" },
] as const;

export const heroSlides = [
  { src: brand.hero, alt: "Lar Batista Janell Doyle — acolhimento em Manaus" },
  { src: galleryImages[0].src, alt: galleryImages[0].alt },
  { src: galleryImages[8].src, alt: galleryImages[8].alt },
  { src: brand.familiaAcolhedora, alt: "Família Acolhedora" },
  { src: galleryImages[12].src, alt: galleryImages[12].alt },
  { src: galleryImages[3].src, alt: galleryImages[3].alt },
] as const;

/** Logos oficiais de parceiros (home do site atual). */
export const partnerLogos: Array<{
  name: string;
  url: string;
  logo: string;
}> = [
  { name: "Convenção Batista do Amazonas", url: "https://convencaobatistaam.org/", logo: "/images/partners/cba.jpg" },
  { name: "PIB Manaus", url: "http://www.pibmanaus.org.br/", logo: "/images/partners/pib.jpg" },
  { name: "IB Constantinópolis", url: "http://www.ibconstantinopolis.com.br/", logo: "/images/partners/ibc.jpg" },
  { name: "IB Japiim", url: "http://www.ibjapiim.com/", logo: "/images/partners/ibj.jpg" },
  { name: "Amazônia Polpas", url: "https://www.amazoniapolpas.com.br/", logo: "/images/partners/amazonia-polpas.png" },
  { name: "Amazon Gás", url: "http://www.amazongas.com.br/amazongas/", logo: "/images/partners/amazongas.jpg" },
  { name: "Alfatec", url: "http://www.alfatecbr.com.br/", logo: "/images/partners/alfatec.jpg" },
  { name: "Norte Clean", url: "http://www.norteclean.com.br/", logo: "/images/partners/norteclean.jpg" },
  { name: "SEAS-AM", url: "http://www.seas.am.gov.br/", logo: "/images/partners/seas.jpg" },
  { name: "SEMASC Manaus", url: "https://semasc.manaus.am.gov.br/", logo: "/images/partners/semasc.jpg" },
  { name: "Manaus Solidária", url: "https://manaussolidaria.manaus.am.gov.br/", logo: "/images/partners/manaus-solidaria.jpg" },
  { name: "SESC Mesa Brasil", url: "https://www2.sesc.com.br/portal/site/mesabrasilsesc/home/", logo: "/images/partners/sesc.jpg" },
  { name: "Santa Rosa Pan", url: "http://www.santarosapan.com.br/", logo: "/images/partners/santarosa.jpg" },
  { name: "DDW Color", url: "https://www.ddwcolor.com/pt/home-pt/", logo: "/images/partners/ddw.jpg" },
];
