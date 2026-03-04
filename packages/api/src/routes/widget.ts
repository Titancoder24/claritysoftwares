import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { optionalAuth } from '../middleware/auth';

const widget = new Hono();

// ── Schemas ────────────────────────────────────────────

const widgetConfigSchema = z.object({
  enabled: z.boolean().default(true),
  position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).default('bottom-right'),
  triggerButton: z
    .object({
      icon: z.enum(['help', 'book', 'play', 'lightbulb', 'custom']).default('help'),
      customIconUrl: z.string().url().optional(),
      label: z.string().max(64).optional(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#6366f1'),
      size: z.number().min(32).max(80).default(56),
    })
    .optional(),
  panel: z
    .object({
      width: z.number().min(280).max(600).default(380),
      height: z.number().min(400).max(800).default(600),
      title: z.string().max(128).default('Help Center'),
      showSearch: z.boolean().default(true),
      showCategories: z.boolean().default(true),
    })
    .optional(),
  content: z
    .object({
      showGuides: z.boolean().default(true),
      showWalkthroughs: z.boolean().default(true),
      showKnowledgeBase: z.boolean().default(true),
      showCourses: z.boolean().default(false),
    })
    .optional(),
  targeting: z
    .object({
      allowedDomains: z.array(z.string().max(256)).max(20).optional(),
      excludedPaths: z.array(z.string().max(256)).max(50).optional(),
      userSegments: z.array(z.string().max(64)).max(20).optional(),
    })
    .optional(),
  branding: z
    .object({
      showPoweredBy: z.boolean().default(true),
      customCss: z.string().max(10000).optional(),
    })
    .optional(),
});

const contextualContentQuerySchema = z.object({
  url: z.string().url().max(2000),
  selector: z.string().max(500).optional(),
  userSegment: z.string().max(64).optional(),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

// ── Admin Routes (authed) ──────────────────────────────

widget.use('/config/*', authMiddleware);

/**
 * GET /workspaces/:workspaceId/widget/config
 * Get widget configuration.
 */
widget.get(
  '/config/:workspaceId',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');

    try {
      void workspaceId;
      return c.json({ config: null });
    } catch (err) {
      console.error('[widget] Get config error:', err);
      return c.json({ error: 'Failed to get widget config' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/widget/config
 * Update widget configuration.
 */
widget.put(
  '/config/:workspaceId',
  workspaceMiddleware(),
  zValidator('json', widgetConfigSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const config = c.req.valid('json');

    try {
      void workspaceId;
      return c.json({ config, message: 'Widget config saved' });
    } catch (err) {
      console.error('[widget] Save config error:', err);
      return c.json({ error: 'Failed to save widget config' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/widget/embed-code
 * Get the embed snippet for the widget.
 */
widget.get(
  '/config/:workspaceId/embed-code',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const baseUrl = process.env.WIDGET_CDN_URL ?? 'https://widget.screenflow.app';

    const embedCode = `<script src="${baseUrl}/widget.js" data-workspace="${workspaceId}" async></script>`;

    return c.json({ embedCode });
  },
);

// ── Public Widget Routes (no auth or optional) ─────────

/**
 * GET /widget/:workspaceId/init
 * Initialize the widget - returns config and initial content.
 * Called by the embedded widget script.
 */
widget.get(
  '/:workspaceId/init',
  optionalAuth,
  async (c) => {
    const workspaceId = c.req.param('workspaceId');

    try {
      // TODO: Fetch widget config
      // TODO: Verify domain is in allowed list
      // TODO: Return config + initial content

      void workspaceId;

      return c.json({
        config: {
          enabled: true,
          position: 'bottom-right',
        },
        content: {
          guides: [],
          walkthroughs: [],
          recentArticles: [],
        },
      });
    } catch (err) {
      console.error('[widget] Init error:', err);
      return c.json({ error: 'Failed to initialize widget' }, 500);
    }
  },
);

/**
 * GET /widget/:workspaceId/contextual
 * Get contextual content based on the current page URL.
 */
widget.get(
  '/:workspaceId/contextual',
  optionalAuth,
  zValidator('query', contextualContentQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      // TODO: Match URL patterns to published content
      // TODO: Factor in user segment
      // TODO: Rank by relevance

      void workspaceId;
      void query;

      return c.json({
        content: [],
        url: query.url,
      });
    } catch (err) {
      console.error('[widget] Contextual error:', err);
      return c.json({ error: 'Failed to get contextual content' }, 500);
    }
  },
);

/**
 * GET /widget/:workspaceId/search
 * Search content from within the widget.
 */
widget.get(
  '/:workspaceId/search',
  optionalAuth,
  zValidator('query', z.object({
    q: z.string().min(1).max(256),
    limit: z.coerce.number().int().min(1).max(20).default(10),
  })),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const { q, limit } = c.req.valid('query');

    try {
      // TODO: Full-text search across guides, KB pages, courses
      void workspaceId;
      void q;
      void limit;

      return c.json({
        results: [],
        query: q,
      });
    } catch (err) {
      console.error('[widget] Search error:', err);
      return c.json({ error: 'Failed to search' }, 500);
    }
  },
);

export default widget;
