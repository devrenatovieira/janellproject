/**
 * Aparições e matérias sobre o Lar Batista Janell Doyle.
 * Fontes públicas verificadas — sem inventar fatos.
 */

export type PressItem = {
  year: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  tags: string[];
};

export const pressItems: PressItem[] = [
  {
    year: 2025,
    title: "Instituição contemplada no sorteio da Nota Fiscal Amazonense",
    summary:
      "O Lar Batista Janell Doyle foi contemplado com R$ 8 mil no 91º sorteio mensal da Nota Fiscal Amazonense (SEFAZ-AM).",
    source: "SEFAZ-AM / Nota Fiscal Amazonense",
    url: "https://nfamazonense.sefaz.am.gov.br/lar-batista-janell-doyle-foi-contemplada-com-r-8-mil-no-91-sorteio-mensal/",
    tags: ["2025", "Doações", "SEFAZ"],
  },
  {
    year: 2024,
    title: "Corregedoria-Geral de Justiça do Amazonas inspeciona o abrigo",
    summary:
      "A CGJ/AM inspecionou o Lar Batista Janell Doyle em Manaus. A matéria registra a atuação de décadas da instituição e a importância das doações.",
    source: "Tribunal de Justiça do Amazonas (TJAM)",
    url: "https://www.tjam.jus.br/index.php/cgj-sala-de-imprensa/cgj-noticias/10759-corregedoria-geral-de-justica-do-amazonas-inspeciona-abrigo-lar-batista-janell-doyle-em-manaus",
    tags: ["2024", "Justiça", "Inspeção"],
  },
  {
    year: 2023,
    title: "Abrigo passa a atuar com Famílias Acolhedoras em Manaus",
    summary:
      "Radar Amazônico noticiou a transição e o fortalecimento do serviço de Família Acolhedora, após décadas de acolhimento institucional de crianças e adolescentes.",
    source: "Radar Amazônico",
    url: "https://radaramazonico.com.br/abrigo-de-criancas-lar-batista-janell-doyle-passa-a-atuar-com-familias-acolhedoras-em-manaus/",
    tags: ["2023", "Família Acolhedora"],
  },
  {
    year: 2021,
    title: "Primeira-dama do Amazonas e Michelle Bolsonaro visitam instituições de caridade",
    summary:
      "A primeira-dama do Amazonas, Taiana Lima, e a então primeira-dama Michelle Bolsonaro visitaram instituições sociais em Manaus, incluindo o Lar Batista Janell Doyle, na zona leste.",
    source: "Amazonas Atual / Portal Único",
    url: "https://amazonasatual.com.br/primeira-dama-do-amazonas-e-michelle-bolsonaro-visitam-instituicoes-de-caridade/",
    tags: ["2021", "Primeira-dama", "Visita"],
  },
  {
    year: 2021,
    title: "Prefeitura visita o Lar após Termo de Fomento",
    summary:
      "A Prefeitura de Manaus visitou a instituição após celebração de Termo de Fomento, destacando os serviços de acolhimento e convivência.",
    source: "Prefeitura de Manaus",
    url: "https://www.manaus.am.gov.br/noticia/assistencia-social/prefeitura-visita-lar-batista-janell-doyle-apos-celebracao-de-termo-de-fomento/",
    tags: ["2021", "Prefeitura", "Fomento"],
  },
  {
    year: 2020,
    title: "Ações sociais contam com apoio da Prefeitura e do Fundo Manaus Solidária",
    summary:
      "Matéria oficial da Prefeitura sobre o projeto Fábrica de Sonhos, com fomentos do Fundo Manaus Solidária. A iniciativa é associada à então primeira-dama e presidente do Fundo, Elisabeth Valeiko Ribeiro. A reportagem cita oficinas de culinária, informática, jiu-jitsu, música e inglês no Mauazinho.",
    source: "Prefeitura de Manaus",
    url: "https://www.manaus.am.gov.br/noticia/solidariedade/janell-doyle-apoio-prefeitura/",
    tags: ["2020", "Primeira-dama", "Fábrica de Sonhos", "FMS"],
  },
  {
    year: 2018,
    title: "Após incêndio, instituição pede doações (JAM / Rede Amazônica)",
    summary:
      "Reportagem do JAM 1ª edição (Globoplay) sobre o pedido de doações do Lar Batista Janell Doyle após incêndio.",
    source: "Globoplay / JAM",
    url: "https://globoplay.globo.com/v/3335852/",
    tags: ["2018", "TV", "Solidariedade"],
  },
  {
    year: 2016,
    title: "TV A Crítica: conheça o abrigo e como ajudar",
    summary:
      "Reportagem da TV A Crítica apresenta o trabalho do abrigo e formas de apoio à instituição.",
    source: "TV A Crítica / YouTube",
    url: "https://www.youtube.com/watch?v=bg47WW0XpMM",
    tags: ["TV", "YouTube", "Institucional"],
  },
];

/** Fatos institucionais adicionais a partir de fontes públicas oficiais/jornalísticas. */
export const extraInstitutionalFacts = [
  {
    title: "Quatro serviços socioassistenciais",
    text: "Atua com SCFV (Fábrica de Sonhos), Abordagem Social, Abrigo de Famílias e Família Acolhedora — conforme comunicação oficial da instituição.",
  },
  {
    title: "Comunidade do Mauazinho",
    text: "Sede na Rua Igarapé de Mauá, N 01 – Mauazinho, zona sul de Manaus, com forte vínculo com a comunidade local.",
  },
  {
    title: "Fomento público e transparência",
    text: "Recebe recursos de termos de fomento (FMS, SEAS, SEMASC, FPS, FMDCA e emendas), com documentos publicados no Portal da Transparência.",
  },
  {
    title: "Sustento por doações e padrinhos",
    text: "Além de fomentos e emendas, a instituição depende de doações e padrinhos financeiros para manter o atendimento.",
  },
  {
    title: "Histórico de acolhimento",
    text: "Documentos públicos (ex.: planos de trabalho SEAS) registram décadas de acolhimento a crianças e adolescentes com direitos violados.",
  },
  {
    title: "Presença na mídia e parcerias institucionais",
    text: "Ações e visitas oficiais (Prefeitura, primeiras-damas, TJAM, TV local) reforçam a relevância social do trabalho no Amazonas.",
  },
] as const;
