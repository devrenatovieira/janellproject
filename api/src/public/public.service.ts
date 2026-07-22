import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/public.dto';
import { CreateDonationIntentDto } from './dto/public.dto';
import { CreateVolunteerDto } from './dto/public.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getSite() {
    const settings = await this.prisma.siteSetting.findMany({
      where: { isPublic: true },
    });
    const map: Record<string, unknown> = {};
    for (const s of settings) map[s.key] = s.value;
    return map;
  }

  async getHome() {
    const [services, partners, stats, videos, testimonials, posts, settings] =
      await Promise.all([
        this.prisma.service.findMany({
          where: { isPublished: true, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.partner.findMany({
          where: { isPublished: true, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.stat.findMany({
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.video.findMany({
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          take: 6,
        }),
        this.listTestimonials(),
        this.listPosts({ page: 1, perPage: 3 }),
        this.getSite(),
      ]);

    return {
      settings,
      services,
      partners,
      stats,
      videos,
      testimonials,
      recentPosts: posts.data,
    };
  }

  async getPage(slug: string) {
    const page = await this.prisma.page.findFirst({
      where: { slug, locale: 'pt-BR', deletedAt: null },
    });
    if (!page || !page.publishedAt) throw new NotFoundException('Página não encontrada');
    return page;
  }

  async listServices() {
    return this.prisma.service.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async getService(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    return service;
  }

  async listPartners() {
    return this.prisma.partner.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async listStats() {
    return this.prisma.stat.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async listVideos() {
    return this.prisma.video.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async listTeam() {
    return this.prisma.teamMember.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async transparencyYears() {
    return this.prisma.transparencyYear.findMany({
      where: { isPublished: true },
      orderBy: { year: 'desc' },
      include: { _count: { select: { documents: true } } },
    });
  }

  async transparencyDocuments(query: {
    year?: number;
    type?: string;
    q?: string;
    page?: number;
    perPage?: number;
  }) {
    const page = query.page ?? 1;
    const perPage = Math.min(query.perPage ?? 100, 500);

    const where: {
      isPublished: boolean;
      deletedAt: null;
      type?: string;
      year?: { year: number };
      OR?: Array<Record<string, unknown>>;
    } = {
      isPublished: true,
      deletedAt: null,
    };

    if (query.year) {
      where.year = { year: query.year };
    }
    if (query.type) {
      where.type = query.type;
    }
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { organ: { contains: query.q, mode: 'insensitive' } },
        { contractCode: { contains: query.q, mode: 'insensitive' } },
        { objectText: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.transparencyDocument.count({ where: where as never }),
      this.prisma.transparencyDocument.findMany({
        where: where as never,
        include: {
          year: true,
          service: { select: { id: true, name: true, slug: true } },
          file: true,
        },
        orderBy: [{ year: { year: 'desc' } }, { sortOrder: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return {
      data: data.map((d) => ({
        id: d.id,
        title: d.title,
        type: d.type,
        year: d.year.year,
        organ: d.organ,
        contractCode: d.contractCode,
        description: d.description,
        sourceUrl: d.sourceUrl,
        downloadUrl: d.file?.url ?? null,
        filename: d.file?.filename ?? null,
        sizeBytes: d.file?.sizeBytes ?? null,
        mimeType: d.file?.mimeType ?? null,
        service: d.service,
      })),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage) || 1,
      },
    };
  }

  async transparencyDashboard() {
    const [byYear, byType, total] = await Promise.all([
      this.prisma.transparencyDocument.groupBy({
        by: ['yearId'],
        where: { isPublished: true, deletedAt: null },
        _count: true,
      }),
      this.prisma.transparencyDocument.groupBy({
        by: ['type'],
        where: { isPublished: true, deletedAt: null },
        _count: true,
      }),
      this.prisma.transparencyDocument.count({
        where: { isPublished: true, deletedAt: null },
      }),
    ]);

    const years = await this.prisma.transparencyYear.findMany({
      where: { isPublished: true },
      orderBy: { year: 'asc' },
    });
    const yearMap = Object.fromEntries(years.map((y) => [y.id, y.year]));

    return {
      totalDocuments: total,
      byYear: byYear.map((r) => ({
        year: yearMap[r.yearId] ?? null,
        count: r._count,
      })),
      byType: byType.map((r) => ({ type: r.type, count: r._count })),
      note: 'Agregados de metadados de documentos oficiais. Valores financeiros estruturados só com dados validados no CMS.',
    };
  }

  async donationsConfig() {
    const accounts = await this.prisma.donationAccount.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return {
      quickAmounts: [20, 50, 100, 200, 500],
      currency: 'BRL',
      providers: {
        PIX: true,
        MERCADO_PAGO: false,
        STRIPE: false,
      },
      accounts,
      partnerUrl: 'https://larbatistajanelldoyle.paradoar.org/',
    };
  }

  async createDonationIntent(dto: CreateDonationIntentDto) {
    const donation = await this.prisma.donation.create({
      data: {
        type: dto.type ?? 'ONE_TIME',
        status: 'PENDING',
        provider: dto.provider ?? 'PIX',
        amountCents: BigInt(dto.amountCents),
        donorName: dto.donor.name,
        donorEmail: dto.donor.email.toLowerCase(),
        donorDocument: dto.donor.document,
        donorPhone: dto.donor.phone,
        message: dto.message,
        campaignId: dto.campaignId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        providerPayload: {
          note: 'Intent criado. Pagamento online será confirmado via webhook nas próximas fases. Use PIX oficial das contas ativas.',
        },
      },
    });

    const accounts = await this.prisma.donationAccount.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return {
      id: donation.id,
      publicCode: donation.publicCode,
      status: donation.status,
      amountCents: Number(donation.amountCents),
      currency: donation.currency,
      provider: donation.provider,
      expiresAt: donation.expiresAt,
      pixAccounts: accounts,
      message:
        'Doação registrada como PENDING. Conclua via PIX com as chaves oficiais. Confirmação automática em fase de integração de webhooks.',
    };
  }

  async donationStatus(id: string) {
    const donation = await this.prisma.donation.findFirst({
      where: { OR: [{ id }, { publicCode: id }] },
    });
    if (!donation) throw new NotFoundException('Doação não encontrada');
    return {
      id: donation.id,
      publicCode: donation.publicCode,
      status: donation.status,
      amountCents: Number(donation.amountCents),
      provider: donation.provider,
      paidAt: donation.paidAt,
      createdAt: donation.createdAt,
    };
  }

  async createContact(dto: CreateContactDto, ip?: string) {
    const msg = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        subject: dto.subject,
        message: dto.message,
        consentAt: dto.consent ? new Date() : null,
        ipHash: ip ? createHashish(ip) : null,
      },
    });

    if (dto.consent) {
      await this.prisma.consentRecord.create({
        data: {
          email: dto.email.toLowerCase(),
          formType: 'contact',
          policyVersion: '1.0',
          ipHash: ip ? createHashish(ip) : null,
          granted: true,
        },
      });
    }

    return {
      id: msg.id,
      message: 'Mensagem recebida com sucesso. Em breve entraremos em contato.',
    };
  }

  async createVolunteer(dto: CreateVolunteerDto) {
    let birthDate: Date | undefined;
    if (dto.birthDate) {
      const parsed = new Date(dto.birthDate);
      if (!Number.isNaN(parsed.getTime())) birthDate = parsed;
    }

    const app = await this.prisma.volunteerApplication.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        document: dto.document,
        birthDate,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        interestAreas: dto.interestAreas ?? [],
        availability: dto.availability,
        message: dto.message,
        status: 'SUBMITTED',
      },
    });
    return {
      id: app.id,
      status: app.status,
      message: 'Cadastro de voluntário recebido. Nossa equipe entrará em contato.',
    };
  }

  async listTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        authorName: true,
        authorRole: true,
        content: true,
        sortOrder: true,
      },
    });
  }

  async listPosts(query: { page?: number; perPage?: number; q?: string }) {
    const page = query.page ?? 1;
    const perPage = Math.min(query.perPage ?? 12, 50);
    const where = {
      status: 'PUBLISHED' as const,
      deletedAt: null,
      publishedAt: { not: null, lte: new Date() },
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' as const } },
              { excerpt: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage) || 1,
      },
    };
  }

  async getPost(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        locale: 'pt-BR',
        status: 'PUBLISHED',
        deletedAt: null,
        publishedAt: { not: null, lte: new Date() },
      },
    });
    if (!post) throw new NotFoundException('Publicação não encontrada');
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      bodyMd: post.bodyMd,
      bodyHtml: post.bodyHtml,
      publishedAt: post.publishedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
    };
  }

  async padrinhoLookup(email: string) {
    const normalized = email.toLowerCase().trim();
    const donations = await this.prisma.donation.findMany({
      where: { donorEmail: normalized },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        publicCode: true,
        status: true,
        type: true,
        amountCents: true,
        currency: true,
        provider: true,
        message: true,
        paidAt: true,
        createdAt: true,
      },
    });

    if (!donations.length) {
      return {
        found: false,
        email: normalized,
        donorName: null,
        donations: [],
        totals: { paidCents: 0, count: 0 },
        message:
          'Nenhuma doação encontrada com este e-mail. Se você doou, confira o e-mail usado no formulário ou fale conosco.',
      };
    }

    const first = await this.prisma.donation.findFirst({
      where: { donorEmail: normalized },
      orderBy: { createdAt: 'desc' },
      select: { donorName: true },
    });

    const paid = donations.filter((d) => d.status === 'PAID');
    const paidCents = paid.reduce((sum, d) => sum + Number(d.amountCents), 0);

    return {
      found: true,
      email: normalized,
      donorName: first?.donorName ?? null,
      donations: donations.map((d) => ({
        ...d,
        amountCents: Number(d.amountCents),
        amountReais: (Number(d.amountCents) / 100).toFixed(2),
      })),
      totals: {
        paidCents,
        paidReais: (paidCents / 100).toFixed(2),
        count: donations.length,
        paidCount: paid.length,
      },
    };
  }

  async createFosterFamily(dto: {
    name: string;
    email: string;
    phone?: string;
    document?: string;
    address?: string;
    message?: string;
  }) {
    const app = await this.prisma.fosterFamilyApplication.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        document: dto.document,
        address: dto.address,
        message: dto.message,
        city: 'Manaus',
        state: 'AM',
        status: 'SUBMITTED',
      },
    });
    return {
      id: app.id,
      status: app.status,
      message:
        'Inscrição no Serviço Família Acolhedora recebida. A equipe técnica entrará em contato.',
    };
  }
}

function createHashish(value: string) {
  // lightweight non-crypto fingerprint for privacy (not reversible email)
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  return `h${Math.abs(h)}`;
}
