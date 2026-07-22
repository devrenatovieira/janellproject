import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { PublicService } from '../services/public.service';
import { asyncHandler } from '../lib/async-handler';
import { param } from '../lib/params';

export const publicRouter = Router();
const svc = new PublicService(prisma);

publicRouter.get(
  '/site',
  asyncHandler(async (_req, res) => res.json(await svc.getSite())),
);
publicRouter.get(
  '/home',
  asyncHandler(async (_req, res) => res.json(await svc.getHome())),
);
publicRouter.get(
  '/pages/:slug',
  asyncHandler(async (req, res) => res.json(await svc.getPage(param(req, 'slug')))),
);
publicRouter.get(
  '/services',
  asyncHandler(async (_req, res) => res.json(await svc.listServices())),
);
publicRouter.get(
  '/services/:slug',
  asyncHandler(async (req, res) =>
    res.json(await svc.getService(param(req, 'slug'))),
  ),
);
publicRouter.get(
  '/partners',
  asyncHandler(async (_req, res) => res.json(await svc.listPartners())),
);
publicRouter.get(
  '/stats',
  asyncHandler(async (_req, res) => res.json(await svc.listStats())),
);
publicRouter.get(
  '/videos',
  asyncHandler(async (_req, res) => res.json(await svc.listVideos())),
);
publicRouter.get(
  '/team',
  asyncHandler(async (_req, res) => res.json(await svc.listTeam())),
);
publicRouter.get(
  '/transparency/years',
  asyncHandler(async (_req, res) => res.json(await svc.transparencyYears())),
);
publicRouter.get(
  '/transparency/documents',
  asyncHandler(async (req, res) => {
    const q = req.query;
    res.json(
      await svc.transparencyDocuments({
        year: q.year ? Number(q.year) : undefined,
        type: q.type as string | undefined,
        q: q.q as string | undefined,
        page: q.page ? Number(q.page) : 1,
        perPage: q.perPage ? Number(q.perPage) : 20,
      }),
    );
  }),
);
publicRouter.get(
  '/transparency/dashboard',
  asyncHandler(async (_req, res) =>
    res.json(await svc.transparencyDashboard()),
  ),
);
publicRouter.get(
  '/donations/config',
  asyncHandler(async (_req, res) => res.json(await svc.donationsConfig())),
);
publicRouter.post(
  '/donations/intent',
  asyncHandler(async (req, res) =>
    res.status(201).json(await svc.createDonationIntent(req.body)),
  ),
);
publicRouter.get(
  '/donations/:id/status',
  asyncHandler(async (req, res) =>
    res.json(await svc.donationStatus(param(req, 'id'))),
  ),
);
publicRouter.post(
  '/contact',
  asyncHandler(async (req, res) =>
    res.status(201).json(await svc.createContact(req.body, req.ip)),
  ),
);
publicRouter.post(
  '/volunteers',
  asyncHandler(async (req, res) =>
    res.status(201).json(await svc.createVolunteer(req.body)),
  ),
);
publicRouter.post(
  '/foster-families',
  asyncHandler(async (req, res) =>
    res.status(201).json(await svc.createFosterFamily(req.body)),
  ),
);
publicRouter.get(
  '/testimonials',
  asyncHandler(async (_req, res) => res.json(await svc.listTestimonials())),
);
publicRouter.get(
  '/posts',
  asyncHandler(async (req, res) => {
    const q = req.query;
    res.json(
      await svc.listPosts({
        page: q.page ? Number(q.page) : 1,
        perPage: q.perPage ? Number(q.perPage) : 10,
        q: q.q as string | undefined,
      }),
    );
  }),
);
publicRouter.get(
  '/posts/:slug',
  asyncHandler(async (req, res) => res.json(await svc.getPost(param(req, 'slug')))),
);
publicRouter.post(
  '/padrinho/lookup',
  asyncHandler(async (req, res) => {
    const email = String(req.body?.email ?? '');
    res.json(await svc.padrinhoLookup(email));
  }),
);

// analytics under public
publicRouter.post(
  '/analytics/pageview',
  asyncHandler(async (req, res) => {
    const path = String(req.body?.path ?? '/');
    const key = 'pageviews';
    const current = await prisma.siteSetting.findUnique({ where: { key } });
    const value = (current?.value as Record<string, number> | null) ?? {};
    value[path] = (value[path] ?? 0) + 1;
    value.__total = (value.__total ?? 0) + 1;
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value, isPublic: false },
      update: { value },
    });
    res.json({ ok: true });
  }),
);

publicRouter.get(
  '/analytics/summary',
  asyncHandler(async (_req, res) => {
    const [pageviews, adminAccess] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'pageviews' } }),
      prisma.siteSetting.findUnique({ where: { key: 'admin_access_count' } }),
    ]);
    res.json({
      pageviews: pageviews?.value ?? {},
      adminAccess: adminAccess?.value ?? { count: 0 },
    });
  }),
);
