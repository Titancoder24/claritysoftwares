import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { optionalAuth } from '../middleware/auth';

const publicRoutes = new Hono();

// All public routes use optional auth (some features may be enhanced for logged-in users)
publicRoutes.use('*', optionalAuth);

// ── Schemas ────────────────────────────────────────────

const shareTokenQuerySchema = z.object({
  token: z.string().min(1).max(256),
});

const kbListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().max(256).optional(),
  categorySlug: z.string().max(64).optional(),
});

// ── Shared Links ───────────────────────────────────────

/**
 * GET /public/share/:shareId
 * Access a shared project/recording via share link.
 */
publicRoutes.get('/share/:shareId', async (c) => {
  const shareId = c.req.param('shareId');

  try {
    // TODO: Look up share link record
    // TODO: Verify not expired, not revoked
    // TODO: Increment view count
    // TODO: Return project data with presigned playback URL

    void shareId;

    return c.json({ share: null });
  } catch (err) {
    console.error('[public] Share error:', err);
    return c.json({ error: 'Failed to load shared content' }, 500);
  }
});

/**
 * GET /public/share/:shareId/embed
 * Get embed-friendly data for an iframe/oEmbed.
 */
publicRoutes.get('/share/:shareId/embed', async (c) => {
  const shareId = c.req.param('shareId');

  try {
    // TODO: Return minimal data optimized for embed rendering
    void shareId;

    return c.json({
      embed: null,
      oEmbed: {
        version: '1.0',
        type: 'video',
        provider_name: 'ScreenFlow',
        provider_url: 'https://screenflow.app',
      },
    });
  } catch (err) {
    console.error('[public] Embed error:', err);
    return c.json({ error: 'Failed to load embed' }, 500);
  }
});

/**
 * POST /public/share/:shareId/view
 * Track a view event for a shared link.
 */
publicRoutes.post('/share/:shareId/view', async (c) => {
  const shareId = c.req.param('shareId');

  try {
    // TODO: Record view event with visitor info
    void shareId;

    return c.json({ tracked: true }, 202);
  } catch (err) {
    console.error('[public] View tracking error:', err);
    // Don't fail the user experience for analytics
    return c.json({ tracked: false }, 202);
  }
});

// ── Knowledge Base (Public) ────────────────────────────

/**
 * GET /public/kb/:siteSlug
 * Get a public knowledge base site by its slug.
 */
publicRoutes.get('/kb/:siteSlug', async (c) => {
  const siteSlug = c.req.param('siteSlug');

  try {
    // TODO: Look up site by slug, verify it's published
    // TODO: Return site with categories
    void siteSlug;

    return c.json({ site: null });
  } catch (err) {
    console.error('[public] KB site error:', err);
    return c.json({ error: 'Knowledge base not found' }, 404);
  }
});

/**
 * GET /public/kb/:siteSlug/categories
 * List categories for a public KB site.
 */
publicRoutes.get('/kb/:siteSlug/categories', async (c) => {
  const siteSlug = c.req.param('siteSlug');

  try {
    void siteSlug;
    return c.json({ categories: [] });
  } catch (err) {
    console.error('[public] KB categories error:', err);
    return c.json({ error: 'Failed to load categories' }, 500);
  }
});

/**
 * GET /public/kb/:siteSlug/pages
 * List published pages for a KB site.
 */
publicRoutes.get(
  '/kb/:siteSlug/pages',
  zValidator('query', kbListQuerySchema),
  async (c) => {
    const siteSlug = c.req.param('siteSlug');
    const query = c.req.valid('query');

    try {
      // TODO: Fetch published pages only
      void siteSlug;
      void query;

      return c.json({
        pages: [],
        total: 0,
        limit: query.limit,
        offset: query.offset,
      });
    } catch (err) {
      console.error('[public] KB pages error:', err);
      return c.json({ error: 'Failed to load pages' }, 500);
    }
  },
);

/**
 * GET /public/kb/:siteSlug/pages/:pageSlug
 * Get a single published KB page.
 */
publicRoutes.get('/kb/:siteSlug/pages/:pageSlug', async (c) => {
  const siteSlug = c.req.param('siteSlug');
  const pageSlug = c.req.param('pageSlug');

  try {
    // TODO: Look up published page
    // TODO: Track page view
    void siteSlug;
    void pageSlug;

    return c.json({ page: null });
  } catch (err) {
    console.error('[public] KB page error:', err);
    return c.json({ error: 'Page not found' }, 404);
  }
});

/**
 * GET /public/kb/:siteSlug/search
 * Search published KB content.
 */
publicRoutes.get(
  '/kb/:siteSlug/search',
  zValidator('query', z.object({
    q: z.string().min(1).max(256),
    limit: z.coerce.number().int().min(1).max(20).default(10),
  })),
  async (c) => {
    const siteSlug = c.req.param('siteSlug');
    const { q, limit } = c.req.valid('query');

    try {
      // TODO: Full-text search on published pages
      void siteSlug;
      void q;
      void limit;

      return c.json({ results: [], query: q });
    } catch (err) {
      console.error('[public] KB search error:', err);
      return c.json({ error: 'Search failed' }, 500);
    }
  },
);

// ── Certificates (Public) ──────────────────────────────

/**
 * GET /public/certificates/:certificateId
 * Verify and view a course completion certificate.
 */
publicRoutes.get('/certificates/:certificateId', async (c) => {
  const certificateId = c.req.param('certificateId');

  try {
    // TODO: Look up certificate
    // TODO: Verify authenticity
    void certificateId;

    return c.json({
      certificate: null,
      verified: false,
    });
  } catch (err) {
    console.error('[public] Certificate error:', err);
    return c.json({ error: 'Certificate not found' }, 404);
  }
});

/**
 * GET /public/certificates/:certificateId/verify
 * Machine-readable certificate verification endpoint.
 */
publicRoutes.get('/certificates/:certificateId/verify', async (c) => {
  const certificateId = c.req.param('certificateId');

  try {
    // TODO: Cryptographic verification of certificate
    void certificateId;

    return c.json({
      valid: false,
      certificateId,
      issuedAt: null,
      learnerName: null,
      courseName: null,
      issuerWorkspace: null,
    });
  } catch (err) {
    console.error('[public] Certificate verify error:', err);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// ── oEmbed ─────────────────────────────────────────────

/**
 * GET /public/oembed
 * oEmbed discovery endpoint for shared content.
 */
publicRoutes.get(
  '/oembed',
  zValidator('query', z.object({
    url: z.string().url(),
    format: z.enum(['json', 'xml']).default('json'),
    maxwidth: z.coerce.number().int().positive().optional(),
    maxheight: z.coerce.number().int().positive().optional(),
  })),
  async (c) => {
    const query = c.req.valid('query');

    try {
      // TODO: Parse share URL, look up project
      void query;

      return c.json({
        version: '1.0',
        type: 'video',
        provider_name: 'ScreenFlow',
        provider_url: 'https://screenflow.app',
        title: null,
        html: null,
        width: query.maxwidth ?? 640,
        height: query.maxheight ?? 360,
        thumbnail_url: null,
      });
    } catch (err) {
      console.error('[public] oEmbed error:', err);
      return c.json({ error: 'Failed to generate oEmbed' }, 404);
    }
  },
);

export default publicRoutes;
