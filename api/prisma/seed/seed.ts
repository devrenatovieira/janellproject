// @ts-nocheck
// Seed runs via `prisma db seed` only — not part of the Vercel serverless bundle.
// Requires: npx prisma generate && npx prisma db seed
import {
  ContentSource,
  MediaType,
  MediaVisibility,
  PrismaClient,
  StatSource,
  TransparencyDocType,
  UserStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type TransparencySeedDoc = {
  id: string;
  title: string;
  year: number | null;
  type: string;
  sourceUrl: string;
  path: string | null;
  sizeBytes: number | null;
  pages: string[];
};

const DOC_TYPES = new Set(Object.values(TransparencyDocType));

function toDocType(raw: string): TransparencyDocType {
  if (DOC_TYPES.has(raw as TransparencyDocType)) {
    return raw as TransparencyDocType;
  }
  return TransparencyDocType.OUTRO;
}

type Institutional = {
  about: {
    summary: string;
    mission: string;
    vision: string;
    values: string[];
    how_we_live?: string;
    home_intro?: string;
  };
  history: { full_text: string; author: string; author_role: string };
  services: Array<{
    slug: string;
    name: string;
    also_known_as?: string[];
    home_description: string;
    about_description: string;
    capacity?: number;
    tagline?: string;
    full_description?: string;
    eligibility_criteria?: string[];
    required_documents?: string[];
  }>;
  partners: Array<{ name: string; url?: string }>;
  contact: {
    address_street: string;
    city: string;
    state: string;
    postal_code: string;
    email: string;
    whatsapp_display: string;
    whatsapp_e164: string;
    whatsapp_url: string;
    social: { instagram: string; facebook: string; youtube: string };
  };
  donations: {
    accounts: Array<{
      agency: string;
      account: string;
      account_type?: string;
      pix_key_type: string;
      pix_key: string;
      bank_name?: string | null;
    }>;
    external_partner_url?: string;
  };
  identity: {
    legal_name: string;
    cnpj_formatted: string;
    cnpj: string;
    founded_display: string;
    affiliation: string;
  };
  videos: Array<{ youtube_id: string; title_hint?: string }>;
  transparency: { years: Array<{ year: number }> };
};

async function main() {
  console.log('Seeding Lar Batista Janell Doyle...');

  const contentPath = path.join(__dirname, 'conteudo_institucional.json');
  const raw = JSON.parse(fs.readFileSync(contentPath, 'utf8')) as Institutional;

  // Permissions
  const permissionCodes = [
    'dashboard:read',
    'users:read',
    'users:write',
    'content:read',
    'content:write',
    'blog:read',
    'blog:write',
    'blog:publish',
    'media:read',
    'media:write',
    'donations:read',
    'donations:write',
    'transparency:read',
    'transparency:write',
    'volunteers:read',
    'volunteers:write',
    'contact:read',
    'contact:write',
    'settings:read',
    'settings:write',
    'logs:read',
  ];

  for (const code of permissionCodes) {
    await prisma.permission.upsert({
      where: { code },
      create: { code, description: code },
      update: {},
    });
  }

  const allPerms = await prisma.permission.findMany();

  const roles = [
    { name: 'SUPER_ADMIN', description: 'Acesso total', all: true },
    {
      name: 'ADMIN',
      description: 'Administrador',
      codes: permissionCodes,
    },
    {
      name: 'EDITOR',
      description: 'Editor de conteúdo',
      codes: [
        'dashboard:read',
        'content:read',
        'content:write',
        'blog:read',
        'blog:write',
        'blog:publish',
        'media:read',
        'media:write',
      ],
    },
    {
      name: 'FINANCE',
      description: 'Financeiro',
      codes: [
        'dashboard:read',
        'donations:read',
        'donations:write',
        'transparency:read',
        'transparency:write',
      ],
    },
    {
      name: 'GODPARENT',
      description: 'Padrinho',
      codes: [],
    },
  ];

  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      create: {
        name: r.name,
        description: r.description,
        isSystem: true,
      },
      update: { description: r.description },
    });

    const codes = 'all' in r && r.all ? permissionCodes : r.codes ?? [];
    for (const code of codes) {
      const perm = allPerms.find((p) => p.code === code);
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
        create: { roleId: role.id, permissionId: perm.id },
        update: {},
      });
    }
  }

  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? 'admin@larbatistamanaus.org.br'
  ).toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Teste@123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: 'Administrador',
      passwordHash,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
    update: {
      passwordHash,
      status: UserStatus.ACTIVE,
    },
  });

  const superRole = await prisma.role.findUniqueOrThrow({
    where: { name: 'SUPER_ADMIN' },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: admin.id, roleId: superRole.id },
    },
    create: { userId: admin.id, roleId: superRole.id },
    update: {},
  });

  // Site settings (public)
  const publicSettings: Record<string, unknown> = {
    organizationName: raw.identity.legal_name,
    cnpj: raw.identity.cnpj_formatted,
    foundedDisplay: raw.identity.founded_display,
    affiliation: raw.identity.affiliation,
    contact: raw.contact,
    mission: raw.about.mission,
    vision: raw.about.vision,
    values: raw.about.values,
    partnerUrl: raw.donations.external_partner_url,
  };

  for (const [key, value] of Object.entries(publicSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: value as object, isPublic: true },
      update: { value: value as object, isPublic: true },
    });
  }

  // Pages
  await prisma.page.upsert({
    where: { slug_locale: { slug: 'sobre', locale: 'pt-BR' } },
    create: {
      slug: 'sobre',
      locale: 'pt-BR',
      title: 'Quem Somos',
      bodyMd: raw.about.summary,
      excerpt: raw.about.mission,
      source: ContentSource.OFFICIAL,
      publishedAt: new Date(),
      seoTitle: 'Quem Somos | Lar Batista Janell Doyle',
      seoDescription: raw.about.summary.slice(0, 155),
    },
    update: {
      bodyMd: raw.about.summary,
      publishedAt: new Date(),
      source: ContentSource.OFFICIAL,
    },
  });

  await prisma.page.upsert({
    where: { slug_locale: { slug: 'nossa-historia', locale: 'pt-BR' } },
    create: {
      slug: 'nossa-historia',
      locale: 'pt-BR',
      title: 'Nossa História',
      bodyMd: raw.history.full_text,
      excerpt: `${raw.history.author} — ${raw.history.author_role}`,
      source: ContentSource.OFFICIAL,
      publishedAt: new Date(),
    },
    update: {
      bodyMd: raw.history.full_text,
      publishedAt: new Date(),
      source: ContentSource.OFFICIAL,
    },
  });

  // Services
  let order = 0;
  for (const s of raw.services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        name: s.name,
        alsoKnownAs: s.also_known_as ?? [],
        shortDescription: s.home_description,
        aboutDescription: s.about_description,
        fullDescription: s.full_description,
        tagline: s.tagline,
        capacity: s.capacity,
        eligibility: s.eligibility_criteria ?? [],
        requiredDocuments: s.required_documents ?? [],
        sortOrder: order++,
        isPublished: true,
        source: ContentSource.OFFICIAL,
      },
      update: {
        name: s.name,
        alsoKnownAs: s.also_known_as ?? [],
        shortDescription: s.home_description,
        aboutDescription: s.about_description,
        fullDescription: s.full_description,
        tagline: s.tagline,
        capacity: s.capacity,
        eligibility: s.eligibility_criteria ?? [],
        requiredDocuments: s.required_documents ?? [],
        isPublished: true,
        source: ContentSource.OFFICIAL,
      },
    });
  }

  // Partners
  await prisma.partner.deleteMany({});
  let pOrder = 0;
  for (const p of raw.partners) {
    await prisma.partner.create({
      data: {
        name: p.name,
        url: p.url,
        sortOrder: pOrder++,
        isPublished: true,
        source: ContentSource.OFFICIAL,
      },
    });
  }

  // Stats oficiais
  const stats = [
    {
      key: 'years_of_service',
      label: 'Anos de serviço',
      value: 30,
      display: '30 anos',
      source: StatSource.OFFICIAL,
      sortOrder: 1,
    },
    {
      key: 'founded_year',
      label: 'Desde',
      value: 1996,
      display: '1996',
      source: StatSource.OFFICIAL,
      sortOrder: 2,
    },
    {
      key: 'shelter_capacity',
      label: 'Capacidade do abrigo',
      value: 20,
      display: '20 acolhidos',
      source: StatSource.OFFICIAL,
      sortOrder: 3,
    },
    {
      key: 'active_services',
      label: 'Serviços ativos',
      value: 4,
      display: '4',
      source: StatSource.OFFICIAL,
      sortOrder: 4,
    },
    {
      key: 'monthly_attendances',
      label: 'Atendimentos/mês',
      value: null,
      display: 'Em atualização',
      source: StatSource.PLACEHOLDER,
      sortOrder: 5,
      notes: 'Não publicado no site oficial',
    },
  ];

  for (const st of stats) {
    await prisma.stat.upsert({
      where: { key: st.key },
      create: {
        key: st.key,
        label: st.label,
        value: st.value,
        display: st.display,
        source: st.source,
        sortOrder: st.sortOrder,
        isPublished: true,
        notes: st.notes,
      },
      update: {
        label: st.label,
        value: st.value,
        display: st.display,
        source: st.source,
        sortOrder: st.sortOrder,
        notes: st.notes,
      },
    });
  }

  // Donation accounts
  await prisma.donationAccount.deleteMany({});
  let aOrder = 0;
  for (const acc of raw.donations.accounts) {
    await prisma.donationAccount.create({
      data: {
        agency: acc.agency,
        account: acc.account,
        accountType: acc.account_type ?? 'conta corrente',
        pixKeyType: acc.pix_key_type,
        pixKey: acc.pix_key,
        bankName: acc.bank_name ?? null,
        isActive: true,
        sortOrder: aOrder++,
        source: ContentSource.OFFICIAL,
      },
    });
  }

  // Videos
  let vOrder = 0;
  for (const v of raw.videos) {
    await prisma.video.upsert({
      where: { youtubeId: v.youtube_id },
      create: {
        youtubeId: v.youtube_id,
        title: v.title_hint ?? `Vídeo ${v.youtube_id}`,
        sortOrder: vOrder++,
        isPublished: true,
        source: ContentSource.OFFICIAL,
      },
      update: {
        title: v.title_hint ?? `Vídeo ${v.youtube_id}`,
        isPublished: true,
      },
    });
  }

  // Transparency years (ensure 2017–2026)
  const yearsSet = new Set<number>(
    (raw.transparency.years ?? []).map((y) => y.year),
  );
  for (let y = 2017; y <= 2026; y++) yearsSet.add(y);
  for (const year of [...yearsSet].sort()) {
    await prisma.transparencyYear.upsert({
      where: { year },
      create: {
        year,
        title: `Transparência ${year}`,
        isPublished: true,
        sortOrder: 3000 - year,
      },
      update: { isPublished: true, title: `Transparência ${year}` },
    });
  }

  // ── Transparency documents (190 PDFs from site crawl) ──
  const docsPath = path.join(__dirname, 'transparency_documents.json');
  if (fs.existsSync(docsPath)) {
    const docs = JSON.parse(
      fs.readFileSync(docsPath, 'utf8'),
    ) as TransparencySeedDoc[];

    console.log(`Seeding ${docs.length} transparency documents...`);

    // Clean previous transparency docs + their media (bucket transparency)
    await prisma.transparencyDocument.deleteMany({});
    await prisma.mediaAsset.deleteMany({ where: { bucket: 'transparency' } });

    const yearRows = await prisma.transparencyYear.findMany();
    const yearByNum = new Map(yearRows.map((y) => [y.year, y.id]));

    let created = 0;
    let skipped = 0;
    let sort = 0;

    for (const doc of docs) {
      if (!doc.path || !doc.year) {
        skipped++;
        continue;
      }
      const yearId = yearByNum.get(doc.year);
      if (!yearId) {
        skipped++;
        continue;
      }

      const objectKey = doc.path.replace(/^\//, '');
      const filename = path.basename(doc.path);

      const media = await prisma.mediaAsset.create({
        data: {
          bucket: 'transparency',
          objectKey,
          url: doc.path,
          filename,
          mimeType: 'application/pdf',
          sizeBytes: doc.sizeBytes ?? 0,
          type: MediaType.DOCUMENT,
          visibility: MediaVisibility.PUBLIC,
          title: doc.title,
          altText: doc.title,
          checksum: doc.id,
        },
      });

      await prisma.transparencyDocument.create({
        data: {
          yearId,
          type: toDocType(doc.type),
          title: doc.title,
          description: null,
          organ: null,
          contractCode: null,
          objectText: null,
          fileId: media.id,
          sourceUrl: doc.sourceUrl,
          isPublished: true,
          publishedAt: new Date(),
          sortOrder: sort++,
        },
      });
      created++;
    }

    console.log(
      `Transparency docs created: ${created} (skipped: ${skipped})`,
    );
  } else {
    console.warn('transparency_documents.json not found — skipping PDFs seed');
  }

  // Director as team member
  await prisma.teamMember.deleteMany({
    where: { name: 'Magaly Araújo' },
  });
  await prisma.teamMember.create({
    data: {
      name: 'Magaly Araújo',
      roleTitle: 'Diretora',
      bio: 'Diretora do Lar Batista Janell Doyle. Autora do texto institucional Nossa História.',
      sortOrder: 0,
      isPublished: true,
      source: ContentSource.OFFICIAL,
    },
  });

  // Testimonials — only official attributed quotes
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        authorName: 'Magaly Araújo',
        authorRole: 'Diretora',
        content:
          'Temos experimentado ao longo desses anos o quanto Deus supre as necessidades dos pequeninos. Todas as pessoas, que sensíveis às necessidades de nossas crianças estendem suas mãos e nos ajudam, são enviadas por Deus.',
        isPublished: true,
        sortOrder: 0,
        source: ContentSource.OFFICIAL,
      },
      {
        authorName: 'Lar Batista Janell Doyle',
        authorRole: 'Missão institucional',
        content:
          'Assegurar os direitos das crianças, adolescentes, jovens, adultos e idosos é a nossa missão!',
        isPublished: true,
        sortOrder: 1,
        source: ContentSource.OFFICIAL,
      },
    ],
  });

  // Blog — welcome post from official institutional content
  await prisma.post.deleteMany({ where: { slug: 'bem-vindo-ao-lar-batista' } });
  await prisma.post.create({
    data: {
      slug: 'bem-vindo-ao-lar-batista',
      locale: 'pt-BR',
      title: 'Bem-vindo ao Lar Batista Janell Doyle',
      excerpt:
        'Há 30 anos servindo com excelência em Manaus — acolhimento, convivência e abordagem social.',
      bodyMd: `${raw.about.summary}

${raw.about.home_intro || ''}

**Missão:** ${raw.about.mission}

**Visão:** ${raw.about.vision}

Saiba mais em [Quem Somos](/sobre) e conheça nossos [serviços](/servicos). Você também pode [doar](/doacao) ou [ser voluntário](/voluntario).`,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Counts summary
  const counts = {
    users: await prisma.user.count(),
    services: await prisma.service.count(),
    partners: await prisma.partner.count(),
    videos: await prisma.video.count(),
    stats: await prisma.stat.count(),
    pages: await prisma.page.count(),
    donationAccounts: await prisma.donationAccount.count(),
    transparencyYears: await prisma.transparencyYear.count(),
    transparencyDocuments: await prisma.transparencyDocument.count(),
    mediaAssets: await prisma.mediaAsset.count(),
    teamMembers: await prisma.teamMember.count(),
    testimonials: await prisma.testimonial.count(),
    posts: await prisma.post.count(),
  };

  console.log('Seed complete.');
  console.log('DB counts:', counts);
  console.log(`Admin: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
