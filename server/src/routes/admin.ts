import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { AdminService } from '../services/admin.service';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requirePermissions } from '../middleware/auth';
import { param } from '../lib/params';

export const adminRouter = Router();
const admin = new AdminService(prisma);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

adminRouter.use(requireAuth);

adminRouter.get(
  '/dashboard',
  requirePermissions('dashboard:read'),
  asyncHandler(async (_req, res) => res.json(await admin.dashboard())),
);

adminRouter.get(
  '/settings',
  requirePermissions('settings:read'),
  asyncHandler(async (_req, res) => res.json(await admin.getSettings())),
);
adminRouter.post(
  '/settings',
  requirePermissions('settings:write'),
  asyncHandler(async (req, res) =>
    res.json(
      await admin.upsertSetting(req.body.key, req.body.value, req.body.isPublic),
    ),
  ),
);

// Pages
adminRouter.get('/pages', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listPages())));
adminRouter.post('/pages', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createPage(req.body))));
adminRouter.patch('/pages/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updatePage(param(req, 'id'), req.body))));
adminRouter.delete('/pages/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deletePage(param(req, 'id')))));

// Services
adminRouter.get('/services', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listServices())));
adminRouter.post('/services', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createService(req.body))));
adminRouter.patch('/services/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updateService(param(req, 'id'), req.body))));
adminRouter.delete('/services/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deleteService(param(req, 'id')))));

// Partners
adminRouter.get('/partners', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listPartners())));
adminRouter.post('/partners', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createPartner(req.body))));
adminRouter.patch('/partners/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updatePartner(param(req, 'id'), req.body))));
adminRouter.delete('/partners/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deletePartner(param(req, 'id')))));

// Stats
adminRouter.get('/stats', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listStats())));
adminRouter.post('/stats', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createStat(req.body))));
adminRouter.patch('/stats/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updateStat(param(req, 'id'), req.body))));
adminRouter.delete('/stats/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deleteStat(param(req, 'id')))));

// Videos
adminRouter.get('/videos', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listVideos())));
adminRouter.post('/videos', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createVideo(req.body))));
adminRouter.patch('/videos/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updateVideo(param(req, 'id'), req.body))));
adminRouter.delete('/videos/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deleteVideo(param(req, 'id')))));

// Team
adminRouter.get('/team', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listTeam())));
adminRouter.post('/team', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createTeamMember(req.body))));
adminRouter.patch('/team/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updateTeamMember(param(req, 'id'), req.body))));
adminRouter.delete('/team/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deleteTeamMember(param(req, 'id')))));

// Transparency
adminRouter.get('/transparency/years', requirePermissions('transparency:read'), asyncHandler(async (_r, res) => res.json(await admin.listTransparencyYears())));
adminRouter.get('/transparency/documents', requirePermissions('transparency:read'), asyncHandler(async (req, res) => {
  const q = req.query;
  res.json(await admin.listTransparencyDocs({
    year: q.year ? Number(q.year) : undefined,
    type: q.type as string | undefined,
    q: q.q as string | undefined,
  }));
}));
adminRouter.patch('/transparency/documents/:id', requirePermissions('transparency:write'), asyncHandler(async (req, res) => res.json(await admin.updateTransparencyDoc(param(req, 'id'), req.body))));
adminRouter.delete('/transparency/documents/:id', requirePermissions('transparency:write'), asyncHandler(async (req, res) => res.json(await admin.deleteTransparencyDoc(param(req, 'id')))));
adminRouter.post(
  '/transparency/documents/upload',
  requirePermissions('transparency:write'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    res.status(201).json(
      await admin.uploadTransparencyDoc({
        file: req.file as Express.Multer.File,
        title: String(req.body.title ?? ''),
        type: String(req.body.type ?? 'OUTRO'),
        year: Number(req.body.year ?? new Date().getFullYear()),
        organ: req.body.organ,
        contractCode: req.body.contractCode,
        description: req.body.description,
      } as any),
    );
  }),
);

// Messages / volunteers / foster / donations
adminRouter.get('/messages', requirePermissions('contact:read'), asyncHandler(async (_r, res) => res.json(await admin.listContacts())));
adminRouter.patch('/messages/:id', requirePermissions('contact:write'), asyncHandler(async (req, res) => res.json(await admin.markContactHandled(param(req, 'id'), !!req.body.handled, req.user?.id))));
adminRouter.get('/volunteers', requirePermissions('volunteers:read'), asyncHandler(async (_r, res) => res.json(await admin.listVolunteers())));
adminRouter.patch('/volunteers/:id/status', requirePermissions('volunteers:write'), asyncHandler(async (req, res) => res.json(await admin.updateVolunteerStatus(param(req, 'id'), req.body.status))));
adminRouter.get('/foster-families', requirePermissions('volunteers:read'), asyncHandler(async (_r, res) => res.json(await admin.listFoster())));
adminRouter.patch('/foster-families/:id/status', requirePermissions('volunteers:write'), asyncHandler(async (req, res) => res.json(await admin.updateFosterStatus(param(req, 'id'), req.body.status))));
adminRouter.get('/donations', requirePermissions('donations:read'), asyncHandler(async (_r, res) => res.json(await admin.listDonations())));
adminRouter.patch('/donations/:id/status', requirePermissions('donations:write'), asyncHandler(async (req, res) => res.json(await admin.updateDonationStatus(param(req, 'id'), req.body.status))));

// Posts / testimonials
adminRouter.get('/posts', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listPosts())));
adminRouter.post('/posts', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createPost(req.body))));
adminRouter.patch('/posts/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updatePost(param(req, 'id'), req.body))));
adminRouter.delete('/posts/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deletePost(param(req, 'id')))));
adminRouter.get('/testimonials', requirePermissions('content:read'), asyncHandler(async (_r, res) => res.json(await admin.listTestimonials())));
adminRouter.post('/testimonials', requirePermissions('content:write'), asyncHandler(async (req, res) => res.status(201).json(await admin.createTestimonial(req.body))));
adminRouter.patch('/testimonials/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.updateTestimonial(param(req, 'id'), req.body))));
adminRouter.delete('/testimonials/:id', requirePermissions('content:write'), asyncHandler(async (req, res) => res.json(await admin.deleteTestimonial(param(req, 'id')))));
