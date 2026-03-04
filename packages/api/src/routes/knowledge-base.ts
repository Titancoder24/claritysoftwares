import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { MemberRole } from '@screenflow/shared/constants';

const knowledgeBase = new Hono();

knowledgeBase.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const createSiteSchema = z.object({
  name: z.string().min(1).max(128),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  customDomain: z.string().max(256).optional(),
  theme: z
    .object({
      primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      logoUrl: z.string().url().optional(),
      faviconUrl: z.string().url().optional(),
      headerHtml: z.string().max(5000).optional(),
      footerHtml: z.string().max(5000).optional(),
      css: z.string().max(10000).optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().max(128).optional(),
      description: z.string().max(512).optional(),
      ogImageUrl: z.string().url().optional(),
    })
    .optional(),
});

const updateSiteSchema = createSiteSchema.partial();

const createCategorySchema = z.object({
  name: z.string().min(1).max(128),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  parentId: z.string().uuid().nullable().optional(),
  orderIndex: z.number().int().min(0).default(0),
  icon: z.string().max(64).optional(),
});

const updateCategorySchema = createCategorySchema.partial();

const createPageSchema = z.object({
  title: z.string().min(1).max(256),
  slug: z
    .string()
    .min(2)
    .max(128)
    .regex(/^[a-z0-9-]+$/),
  categoryId: z.string().uuid(),
  content: z.string().max(100000), // Rich text / markdown
  excerpt: z.string().max(500).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  orderIndex: z.number().int().min(0).default(0),
  embeddedProjectIds: z.array(z.string().uuid()).max(20).optional(),
  seo: z
    .object({
      title: z.string().max(128).optional(),
      description: z.string().max(512).optional(),
    })
    .optional(),
});

const updatePageSchema = createPageSchema.partial();

const listPagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  search: z.string().max(256).optional(),
});

// ── Sites ──────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/kb/sites
 */
knowledgeBase.get(
  '/:workspaceId/kb/sites',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');

    try {
      void workspaceId;
      return c.json({ sites: [] });
    } catch (err) {
      console.error('[kb] List sites error:', err);
      return c.json({ error: 'Failed to list knowledge base sites' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/kb/sites
 */
knowledgeBase.post(
  '/:workspaceId/kb/sites',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  zValidator('json', createSiteSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      const id = crypto.randomUUID();
      void workspaceId;

      return c.json(
        { site: { id, workspaceId, ...body, createdAt: new Date().toISOString() } },
        201,
      );
    } catch (err) {
      console.error('[kb] Create site error:', err);
      return c.json({ error: 'Failed to create knowledge base site' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/kb/sites/:siteId
 */
knowledgeBase.get(
  '/:workspaceId/kb/sites/:siteId',
  workspaceMiddleware(),
  async (c) => {
    const siteId = c.req.param('siteId');

    try {
      void siteId;
      return c.json({ site: null });
    } catch (err) {
      console.error('[kb] Get site error:', err);
      return c.json({ error: 'Failed to get knowledge base site' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/kb/sites/:siteId
 */
knowledgeBase.patch(
  '/:workspaceId/kb/sites/:siteId',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  zValidator('json', updateSiteSchema),
  async (c) => {
    const siteId = c.req.param('siteId');
    const body = c.req.valid('json');

    try {
      void siteId;
      void body;
      return c.json({ site: null, message: 'Site updated' });
    } catch (err) {
      console.error('[kb] Update site error:', err);
      return c.json({ error: 'Failed to update knowledge base site' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/kb/sites/:siteId
 */
knowledgeBase.delete(
  '/:workspaceId/kb/sites/:siteId',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  async (c) => {
    const siteId = c.req.param('siteId');

    try {
      void siteId;
      return c.json({ message: 'Knowledge base site deleted' });
    } catch (err) {
      console.error('[kb] Delete site error:', err);
      return c.json({ error: 'Failed to delete knowledge base site' }, 500);
    }
  },
);

// ── Categories ─────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/kb/sites/:siteId/categories
 */
knowledgeBase.get(
  '/:workspaceId/kb/sites/:siteId/categories',
  workspaceMiddleware(),
  async (c) => {
    const siteId = c.req.param('siteId');

    try {
      void siteId;
      return c.json({ categories: [] });
    } catch (err) {
      console.error('[kb] List categories error:', err);
      return c.json({ error: 'Failed to list categories' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/kb/sites/:siteId/categories
 */
knowledgeBase.post(
  '/:workspaceId/kb/sites/:siteId/categories',
  workspaceMiddleware(),
  zValidator('json', createCategorySchema),
  async (c) => {
    const siteId = c.req.param('siteId');
    const body = c.req.valid('json');

    try {
      const id = crypto.randomUUID();
      void siteId;

      return c.json({ category: { id, siteId, ...body } }, 201);
    } catch (err) {
      console.error('[kb] Create category error:', err);
      return c.json({ error: 'Failed to create category' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/kb/sites/:siteId/categories/:categoryId
 */
knowledgeBase.patch(
  '/:workspaceId/kb/sites/:siteId/categories/:categoryId',
  workspaceMiddleware(),
  zValidator('json', updateCategorySchema),
  async (c) => {
    const categoryId = c.req.param('categoryId');
    const body = c.req.valid('json');

    try {
      void categoryId;
      void body;
      return c.json({ category: null, message: 'Category updated' });
    } catch (err) {
      console.error('[kb] Update category error:', err);
      return c.json({ error: 'Failed to update category' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/kb/sites/:siteId/categories/:categoryId
 */
knowledgeBase.delete(
  '/:workspaceId/kb/sites/:siteId/categories/:categoryId',
  workspaceMiddleware(),
  async (c) => {
    const categoryId = c.req.param('categoryId');

    try {
      void categoryId;
      return c.json({ message: 'Category deleted' });
    } catch (err) {
      console.error('[kb] Delete category error:', err);
      return c.json({ error: 'Failed to delete category' }, 500);
    }
  },
);

// ── Pages ──────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/kb/sites/:siteId/pages
 */
knowledgeBase.get(
  '/:workspaceId/kb/sites/:siteId/pages',
  workspaceMiddleware(),
  zValidator('query', listPagesQuerySchema),
  async (c) => {
    const siteId = c.req.param('siteId');
    const query = c.req.valid('query');

    try {
      void siteId;
      void query;

      return c.json({
        pages: [],
        total: 0,
        limit: query.limit,
        offset: query.offset,
      });
    } catch (err) {
      console.error('[kb] List pages error:', err);
      return c.json({ error: 'Failed to list pages' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/kb/sites/:siteId/pages
 */
knowledgeBase.post(
  '/:workspaceId/kb/sites/:siteId/pages',
  workspaceMiddleware(),
  zValidator('json', createPageSchema),
  async (c) => {
    const siteId = c.req.param('siteId');
    const user = c.get('user');
    const body = c.req.valid('json');

    try {
      const id = crypto.randomUUID();
      void siteId;

      return c.json(
        {
          page: {
            id,
            siteId,
            authorId: user.sub,
            ...body,
            createdAt: new Date().toISOString(),
          },
        },
        201,
      );
    } catch (err) {
      console.error('[kb] Create page error:', err);
      return c.json({ error: 'Failed to create page' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/kb/sites/:siteId/pages/:pageId
 */
knowledgeBase.get(
  '/:workspaceId/kb/sites/:siteId/pages/:pageId',
  workspaceMiddleware(),
  async (c) => {
    const pageId = c.req.param('pageId');

    try {
      void pageId;
      return c.json({ page: null });
    } catch (err) {
      console.error('[kb] Get page error:', err);
      return c.json({ error: 'Failed to get page' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/kb/sites/:siteId/pages/:pageId
 */
knowledgeBase.patch(
  '/:workspaceId/kb/sites/:siteId/pages/:pageId',
  workspaceMiddleware(),
  zValidator('json', updatePageSchema),
  async (c) => {
    const pageId = c.req.param('pageId');
    const body = c.req.valid('json');

    try {
      void pageId;
      void body;
      return c.json({ page: null, message: 'Page updated' });
    } catch (err) {
      console.error('[kb] Update page error:', err);
      return c.json({ error: 'Failed to update page' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/kb/sites/:siteId/pages/:pageId
 */
knowledgeBase.delete(
  '/:workspaceId/kb/sites/:siteId/pages/:pageId',
  workspaceMiddleware(),
  async (c) => {
    const pageId = c.req.param('pageId');

    try {
      void pageId;
      return c.json({ message: 'Page deleted' });
    } catch (err) {
      console.error('[kb] Delete page error:', err);
      return c.json({ error: 'Failed to delete page' }, 500);
    }
  },
);

export default knowledgeBase;
