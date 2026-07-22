import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationStatus,
  MediaType,
  MediaVisibility,
  Prisma,
  TransparencyDocType,
} from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

const DOC_TYPES = new Set(Object.values(TransparencyDocType));

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private docsRoot() {
    return (
      process.env.DOCUMENTS_PATH ||
      path.resolve(
        process.cwd(),
        '../larbatista-web/public/documentos',
      )
    );
  }

  // ─── Dashboard ─────────────────────────────────────────
  async dashboard() {
    const [
      donationsPending,
      donationsPaid,
      volunteers,
      foster,
      contacts,
      services,
      documents,
      partners,
      videos,
      pageviewsSetting,
      adminAccessSetting,
    ] = await Promise.all([
      this.prisma.donation.count({ where: { status: 'PENDING' } }),
      this.prisma.donation.count({ where: { status: 'PAID' } }),
      this.prisma.volunteerApplication.count({
        where: { status: 'SUBMITTED' },
      }),
      this.prisma.fosterFamilyApplication.count({
        where: { status: 'SUBMITTED' },
      }),
      this.prisma.contactMessage.count({ where: { handledAt: null } }),
      this.prisma.service.count({
        where: { isPublished: true, deletedAt: null },
      }),
      this.prisma.transparencyDocument.count({
        where: { isPublished: true, deletedAt: null },
      }),
      this.prisma.partner.count({
        where: { isPublished: true, deletedAt: null },
      }),
      this.prisma.video.count({ where: { isPublished: true } }),
      this.prisma.siteSetting.findUnique({ where: { key: 'site_pageviews' } }),
      this.prisma.siteSetting.findUnique({
        where: { key: 'admin_access_count' },
      }),
    ]);

    const byPath =
      (pageviewsSetting?.value as { byPath?: Record<string, number> } | null)
        ?.byPath ?? {};

    // Friendly page names instead of routes
    const pageLabels: Record<string, string> = {
      '/': 'Início',
      '/sobre': 'Quem Somos',
      '/nossa-historia': 'Nossa História',
      '/servicos': 'Serviços',
      '/familia-acolhedora': 'Família Acolhedora',
      '/doacao': 'Doação',
      '/contato': 'Contato',
      '/transparencia': 'Transparência',
      '/videos': 'Vídeos',
      '/galeria': 'Galeria',
      '/midia': 'Na Mídia',
      '/adocao': 'Adoção',
      '/voluntario': 'Voluntário',
      '/padrinho': 'Padrinho',
      '/blog': 'Blog',
    };

    const topPages = Object.entries(byPath)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pathKey, count]) => ({
        name: pageLabels[pathKey] || this.friendlyPath(pathKey),
        count,
      }));

    return {
      visits: Number(
        (pageviewsSetting?.value as { count?: number } | null)?.count ?? 0,
      ),
      adminLogins: Number(
        (adminAccessSetting?.value as { count?: number } | null)?.count ?? 0,
      ),
      lastAdminLogin:
        (adminAccessSetting?.value as { lastAt?: string } | null)?.lastAt ??
        null,
      pendingDonations: donationsPending,
      paidDonations: donationsPaid,
      pendingVolunteers: volunteers,
      pendingFoster: foster,
      openMessages: contacts,
      publishedServices: services,
      publishedDocuments: documents,
      publishedPartners: partners,
      publishedVideos: videos,
      topPages,
    };
  }

  private friendlyPath(p: string) {
    if (p.startsWith('/transparencia/')) {
      return `Transparência ${p.split('/').pop()}`;
    }
    if (p.startsWith('/servicos/')) {
      return 'Detalhe de serviço';
    }
    return 'Página do site';
  }

  // ─── Settings ──────────────────────────────────────────
  async getSettings() {
    const rows = await this.prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      key: r.key,
      value: r.value,
      isPublic: r.isPublic,
      updatedAt: r.updatedAt,
    }));
  }

  async upsertSetting(key: string, value: unknown, isPublic = false) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value: value as Prisma.InputJsonValue,
        isPublic,
      },
      update: {
        value: value as Prisma.InputJsonValue,
        isPublic,
      },
    });
  }

  // ─── Pages ─────────────────────────────────────────────
  async listPages() {
    return this.prisma.page.findMany({
      where: { deletedAt: null },
      orderBy: { title: 'asc' },
    });
  }

  async createPage(data: {
    title: string;
    slug?: string;
    bodyMd: string;
    excerpt?: string;
    published?: boolean;
  }) {
    let slug = (data.slug || this.slugify(data.title)).trim();
    if (!slug) slug = `pagina-${Date.now()}`;
    const exists = await this.prisma.page.findFirst({
      where: { slug, locale: 'pt-BR' },
    });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    return this.prisma.page.create({
      data: {
        title: data.title,
        slug,
        locale: 'pt-BR',
        bodyMd: data.bodyMd,
        excerpt: data.excerpt,
        publishedAt: data.published === false ? null : new Date(),
      },
    });
  }

  async updatePage(
    id: string,
    data: {
      title?: string;
      bodyMd?: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
      published?: boolean;
    },
  ) {
    const page = await this.prisma.page.findFirst({
      where: { id, deletedAt: null },
    });
    if (!page) throw new NotFoundException('Página não encontrada');
    return this.prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        bodyMd: data.bodyMd,
        excerpt: data.excerpt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        publishedAt:
          data.published === undefined
            ? undefined
            : data.published
              ? page.publishedAt ?? new Date()
              : null,
      },
    });
  }

  async deletePage(id: string) {
    const page = await this.prisma.page.findFirst({
      where: { id, deletedAt: null },
    });
    if (!page) throw new NotFoundException('Página não encontrada');
    return this.prisma.page.update({
      where: { id },
      data: { deletedAt: new Date(), publishedAt: null },
    });
  }

  // ─── Services ──────────────────────────────────────────
  async listServices() {
    return this.prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      include: { faqs: true },
    });
  }

  private slugify(text: string) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80);
  }

  async createService(data: {
    name: string;
    shortDescription: string;
    aboutDescription?: string;
    fullDescription?: string;
    tagline?: string;
    capacity?: number | null;
    isPublished?: boolean;
    slug?: string;
  }) {
    let slug = (data.slug || this.slugify(data.name)).trim();
    if (!slug) slug = `servico-${Date.now()}`;
    const exists = await this.prisma.service.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const maxOrder = await this.prisma.service.aggregate({
      where: { deletedAt: null },
      _max: { sortOrder: true },
    });

    return this.prisma.service.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        aboutDescription:
          data.aboutDescription || data.shortDescription,
        fullDescription: data.fullDescription,
        tagline: data.tagline,
        capacity: data.capacity ?? null,
        isPublished: data.isPublished ?? true,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });
  }

  async updateService(
    id: string,
    data: {
      name?: string;
      shortDescription?: string;
      aboutDescription?: string;
      fullDescription?: string;
      tagline?: string;
      capacity?: number | null;
      isPublished?: boolean;
      sortOrder?: number;
      eligibility?: string[];
      requiredDocuments?: string[];
    },
  ) {
    const row = await this.prisma.service.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Serviço não encontrado');
    return this.prisma.service.update({ where: { id }, data });
  }

  async deleteService(id: string) {
    const row = await this.prisma.service.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Serviço não encontrado');
    return this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });
  }

  // ─── Partners ──────────────────────────────────────────
  async listPartners() {
    return this.prisma.partner.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createPartner(data: {
    name: string;
    url?: string;
    isPublished?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.partner.create({
      data: {
        name: data.name,
        url: data.url,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updatePartner(
    id: string,
    data: {
      name?: string;
      url?: string | null;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ) {
    await this.ensurePartner(id);
    return this.prisma.partner.update({ where: { id }, data });
  }

  async deletePartner(id: string) {
    await this.ensurePartner(id);
    return this.prisma.partner.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });
  }

  private async ensurePartner(id: string) {
    const row = await this.prisma.partner.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Parceiro não encontrado');
  }

  // ─── Stats ─────────────────────────────────────────────
  async listStats() {
    return this.prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createStat(data: {
    label: string;
    value?: number | null;
    display?: string;
    isPublished?: boolean;
    key?: string;
  }) {
    let key = (data.key || this.slugify(data.label)).replace(/-/g, '_');
    if (!key) key = `stat_${Date.now()}`;
    const exists = await this.prisma.stat.findUnique({ where: { key } });
    if (exists) key = `${key}_${Date.now().toString(36)}`;

    const maxOrder = await this.prisma.stat.aggregate({
      _max: { sortOrder: true },
    });

    return this.prisma.stat.create({
      data: {
        key,
        label: data.label,
        value: data.value ?? null,
        display: data.display ?? (data.value != null ? String(data.value) : null),
        isPublished: data.isPublished ?? true,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });
  }

  async updateStat(
    id: string,
    data: {
      label?: string;
      value?: number | null;
      display?: string;
      isPublished?: boolean;
      sortOrder?: number;
      notes?: string | null;
    },
  ) {
    const row = await this.prisma.stat.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Estatística não encontrada');
    return this.prisma.stat.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value === undefined ? undefined : data.value,
        display: data.display,
        isPublished: data.isPublished,
        sortOrder: data.sortOrder,
        notes: data.notes,
      },
    });
  }

  async deleteStat(id: string) {
    const row = await this.prisma.stat.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Estatística não encontrada');
    return this.prisma.stat.delete({ where: { id } });
  }

  // ─── Videos ────────────────────────────────────────────
  async listVideos() {
    return this.prisma.video.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createVideo(data: {
    youtubeId: string;
    title: string;
    description?: string;
    isPublished?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.video.create({
      data: {
        youtubeId: data.youtubeId,
        title: data.title,
        description: data.description,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateVideo(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      youtubeId?: string;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ) {
    const row = await this.prisma.video.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Vídeo não encontrado');
    return this.prisma.video.update({ where: { id }, data });
  }

  async deleteVideo(id: string) {
    const row = await this.prisma.video.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Vídeo não encontrado');
    return this.prisma.video.delete({ where: { id } });
  }

  // ─── Team ──────────────────────────────────────────────
  async listTeam() {
    return this.prisma.teamMember.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createTeamMember(data: {
    name: string;
    roleTitle: string;
    bio?: string;
    isPublished?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.teamMember.create({
      data: {
        name: data.name,
        roleTitle: data.roleTitle,
        bio: data.bio,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateTeamMember(
    id: string,
    data: {
      name?: string;
      roleTitle?: string;
      bio?: string | null;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ) {
    const row = await this.prisma.teamMember.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Membro não encontrado');
    return this.prisma.teamMember.update({ where: { id }, data });
  }

  async deleteTeamMember(id: string) {
    const row = await this.prisma.teamMember.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Membro não encontrado');
    return this.prisma.teamMember.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });
  }

  // ─── Transparency ──────────────────────────────────────
  async listTransparencyDocs(query: {
    year?: number;
    type?: string;
    q?: string;
  }) {
    const where: Prisma.TransparencyDocumentWhereInput = {
      deletedAt: null,
    };
    if (query.year) where.year = { year: query.year };
    if (query.type && DOC_TYPES.has(query.type as TransparencyDocType)) {
      where.type = query.type as TransparencyDocType;
    }
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { organ: { contains: query.q, mode: 'insensitive' } },
        { contractCode: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const data = await this.prisma.transparencyDocument.findMany({
      where,
      include: {
        year: true,
        file: true,
      },
      orderBy: [{ year: { year: 'desc' } }, { sortOrder: 'asc' }],
    });

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      year: d.year.year,
      yearId: d.yearId,
      organ: d.organ,
      contractCode: d.contractCode,
      description: d.description,
      isPublished: d.isPublished,
      downloadUrl: d.file?.url ?? null,
      filename: d.file?.filename ?? null,
      sizeBytes: d.file?.sizeBytes ?? null,
      sourceUrl: d.sourceUrl,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
  }

  async updateTransparencyDoc(
    id: string,
    data: {
      title?: string;
      type?: string;
      year?: number;
      organ?: string | null;
      contractCode?: string | null;
      description?: string | null;
      isPublished?: boolean;
    },
  ) {
    const doc = await this.prisma.transparencyDocument.findFirst({
      where: { id, deletedAt: null },
    });
    if (!doc) throw new NotFoundException('Documento não encontrado');

    let yearId = doc.yearId;
    if (data.year) {
      const year = await this.prisma.transparencyYear.upsert({
        where: { year: data.year },
        create: {
          year: data.year,
          title: `Transparência ${data.year}`,
          isPublished: true,
          sortOrder: 3000 - data.year,
        },
        update: {},
      });
      yearId = year.id;
    }

    return this.prisma.transparencyDocument.update({
      where: { id },
      data: {
        title: data.title,
        type:
          data.type && DOC_TYPES.has(data.type as TransparencyDocType)
            ? (data.type as TransparencyDocType)
            : undefined,
        yearId,
        organ: data.organ,
        contractCode: data.contractCode,
        description: data.description,
        isPublished: data.isPublished,
      },
      include: { year: true, file: true },
    });
  }

  async deleteTransparencyDoc(id: string) {
    const doc = await this.prisma.transparencyDocument.findFirst({
      where: { id, deletedAt: null },
      include: { file: true },
    });
    if (!doc) throw new NotFoundException('Documento não encontrado');

    await this.prisma.transparencyDocument.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    return { success: true };
  }

  async uploadTransparencyDoc(input: {
    title: string;
    year: number;
    type?: string;
    organ?: string;
    file: Express.Multer.File;
  }) {
    if (!input.file) throw new BadRequestException('Arquivo obrigatório');
    if (!input.file.mimetype.includes('pdf') && !input.file.originalname.toLowerCase().endsWith('.pdf')) {
      throw new BadRequestException('Envie um arquivo PDF');
    }

    const year = await this.prisma.transparencyYear.upsert({
      where: { year: input.year },
      create: {
        year: input.year,
        title: `Transparência ${input.year}`,
        isPublished: true,
        sortOrder: 3000 - input.year,
      },
      update: {},
    });

    const root = this.docsRoot();
    const yearDir = path.join(root, String(input.year));
    fs.mkdirSync(yearDir, { recursive: true });

    const safe = input.file.originalname
      .replace(/[^\w.\-]+/g, '_')
      .replace(/_+/g, '_');
    const filename = `${Date.now()}_${safe}`;
    const abs = path.join(yearDir, filename);
    fs.writeFileSync(abs, input.file.buffer);
    const publicPath = `/documentos/${input.year}/${filename}`;

    const media = await this.prisma.mediaAsset.create({
      data: {
        bucket: 'transparency',
        objectKey: publicPath.replace(/^\//, ''),
        url: publicPath,
        filename,
        mimeType: input.file.mimetype || 'application/pdf',
        sizeBytes: input.file.size,
        type: MediaType.DOCUMENT,
        visibility: MediaVisibility.PUBLIC,
        title: input.title,
        altText: input.title,
      },
    });

    const doc = await this.prisma.transparencyDocument.create({
      data: {
        yearId: year.id,
        type:
          input.type && DOC_TYPES.has(input.type as TransparencyDocType)
            ? (input.type as TransparencyDocType)
            : TransparencyDocType.OUTRO,
        title: input.title,
        organ: input.organ,
        fileId: media.id,
        isPublished: true,
        publishedAt: new Date(),
      },
      include: { year: true, file: true },
    });

    return {
      id: doc.id,
      title: doc.title,
      year: doc.year.year,
      type: doc.type,
      downloadUrl: media.url,
    };
  }

  async listTransparencyYears() {
    return this.prisma.transparencyYear.findMany({
      orderBy: { year: 'desc' },
      include: { _count: { select: { documents: true } } },
    });
  }

  // ─── Messages / Volunteers / Foster / Donations ────────
  async listContacts() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async markContactHandled(id: string, handled: boolean, userId?: string) {
    const row = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Mensagem não encontrada');
    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        handledAt: handled ? new Date() : null,
        handledById: handled ? userId : null,
      },
    });
  }

  async listVolunteers() {
    return this.prisma.volunteerApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async updateVolunteerStatus(id: string, status: ApplicationStatus) {
    const row = await this.prisma.volunteerApplication.findUnique({
      where: { id },
    });
    if (!row) throw new NotFoundException('Inscrição não encontrada');
    return this.prisma.volunteerApplication.update({
      where: { id },
      data: { status },
    });
  }

  async listFoster() {
    return this.prisma.fosterFamilyApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async updateFosterStatus(id: string, status: ApplicationStatus) {
    const row = await this.prisma.fosterFamilyApplication.findUnique({
      where: { id },
    });
    if (!row) throw new NotFoundException('Inscrição não encontrada');
    return this.prisma.fosterFamilyApplication.update({
      where: { id },
      data: { status },
    });
  }

  async listDonations() {
    const data = await this.prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return data.map((d) => ({
      ...d,
      amountCents: Number(d.amountCents),
      amountReais: (Number(d.amountCents) / 100).toFixed(2),
    }));
  }

  async updateDonationStatus(
    id: string,
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED',
  ) {
    const row = await this.prisma.donation.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Doação não encontrada');
    return this.prisma.donation.update({
      where: { id },
      data: {
        status,
        paidAt: status === 'PAID' ? new Date() : row.paidAt,
      },
    });
  }

  // ─── Blog posts ────────────────────────────────────────
  async listPosts() {
    return this.prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createPost(data: {
    title: string;
    bodyMd: string;
    excerpt?: string;
    slug?: string;
    published?: boolean;
  }) {
    let slug = (data.slug || this.slugify(data.title)).trim();
    if (!slug) slug = `post-${Date.now()}`;
    const exists = await this.prisma.post.findFirst({
      where: { slug, locale: 'pt-BR' },
    });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const published = data.published !== false;
    return this.prisma.post.create({
      data: {
        title: data.title,
        slug,
        locale: 'pt-BR',
        bodyMd: data.bodyMd,
        excerpt: data.excerpt,
        status: published ? 'PUBLISHED' : 'DRAFT',
        publishedAt: published ? new Date() : null,
      },
    });
  }

  async updatePost(
    id: string,
    data: {
      title?: string;
      bodyMd?: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
      published?: boolean;
    },
  ) {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: null },
    });
    if (!post) throw new NotFoundException('Publicação não encontrada');

    let status = post.status;
    let publishedAt = post.publishedAt;
    if (data.published === true) {
      status = 'PUBLISHED';
      publishedAt = post.publishedAt ?? new Date();
    } else if (data.published === false) {
      status = 'DRAFT';
      publishedAt = null;
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        bodyMd: data.bodyMd,
        excerpt: data.excerpt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status,
        publishedAt,
      },
    });
  }

  async deletePost(id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: null },
    });
    if (!post) throw new NotFoundException('Publicação não encontrada');
    return this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED', publishedAt: null },
    });
  }

  // ─── Testimonials ──────────────────────────────────────
  async listTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createTestimonial(data: {
    authorName: string;
    content: string;
    authorRole?: string;
    isPublished?: boolean;
    sortOrder?: number;
  }) {
    const max = await this.prisma.testimonial.aggregate({
      _max: { sortOrder: true },
    });
    return this.prisma.testimonial.create({
      data: {
        authorName: data.authorName,
        authorRole: data.authorRole,
        content: data.content,
        isPublished: data.isPublished !== false,
        sortOrder: data.sortOrder ?? (max._max.sortOrder ?? 0) + 1,
        source: 'CMS',
      },
    });
  }

  async updateTestimonial(
    id: string,
    data: {
      authorName?: string;
      authorRole?: string;
      content?: string;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ) {
    const row = await this.prisma.testimonial.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Depoimento não encontrado');
    return this.prisma.testimonial.update({
      where: { id },
      data: {
        authorName: data.authorName,
        authorRole: data.authorRole,
        content: data.content,
        isPublished: data.isPublished,
        sortOrder: data.sortOrder,
      },
    });
  }

  async deleteTestimonial(id: string) {
    const row = await this.prisma.testimonial.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Depoimento não encontrado');
    return this.prisma.testimonial.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });
  }
}
