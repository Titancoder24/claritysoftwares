import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { planGuard } from '../middleware/plan-guard';

const analytics = new Hono();

analytics.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const ingestEventSchema = z.object({
  events: z
    .array(
      z.object({
        type: z.enum([
          'view',
          'play',
          'pause',
          'seek',
          'complete',
          'step_view',
          'step_complete',
          'guide_complete',
          'walkthrough_start',
          'walkthrough_complete',
          'walkthrough_dismiss',
          'kb_page_view',
          'widget_open',
          'widget_click',
          'enrollment_start',
          'lesson_complete',
          'course_complete',
          'share_click',
          'download',
          'cta_click',
        ]),
        projectId: z.string().uuid().optional(),
        resourceId: z.string().uuid().optional(),
        resourceType: z
          .enum(['recording', 'project', 'guide', 'walkthrough', 'kb_page', 'course', 'lesson'])
          .optional(),
        metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
        timestamp: z.string().datetime().optional(),
        sessionId: z.string().max(128).optional(),
        visitorId: z.string().max(128).optional(),
        userAgent: z.string().max(500).optional(),
        referrer: z.string().url().max(2000).optional(),
      }),
    )
    .min(1)
    .max(100),
});

const dashboardQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  projectId: z.string().uuid().optional(),
  resourceType: z
    .enum(['recording', 'project', 'guide', 'walkthrough', 'kb_page', 'course'])
    .optional(),
});

const exportQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  eventTypes: z.array(z.string()).optional(),
  format: z.enum(['csv', 'json']).default('csv'),
});

// ── Routes ─────────────────────────────────────────────

/**
 * POST /workspaces/:workspaceId/analytics/events
 * Ingest analytics events (batch).
 */
analytics.post(
  '/:workspaceId/analytics/events',
  workspaceMiddleware(),
  zValidator('json', ingestEventSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const { events } = c.req.valid('json');

    try {
      // TODO: Write events to analytics store (ClickHouse, BigQuery, etc.)
      // TODO: Enrich with workspace context

      void workspaceId;

      return c.json(
        {
          ingested: events.length,
          message: `${events.length} events ingested`,
        },
        202,
      );
    } catch (err) {
      console.error('[analytics] Ingest error:', err);
      return c.json({ error: 'Failed to ingest events' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/analytics/dashboard
 * Get dashboard metrics for a workspace.
 */
analytics.get(
  '/:workspaceId/analytics/dashboard',
  workspaceMiddleware(),
  zValidator('query', dashboardQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      // TODO: Aggregate from analytics store
      void workspaceId;
      void query;

      return c.json({
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
          granularity: query.granularity,
        },
        summary: {
          totalViews: 0,
          uniqueVisitors: 0,
          totalPlayTime: 0,
          completionRate: 0,
          averageWatchTime: 0,
        },
        timeSeries: [],
        topContent: [],
        topReferrers: [],
      });
    } catch (err) {
      console.error('[analytics] Dashboard error:', err);
      return c.json({ error: 'Failed to fetch dashboard metrics' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/analytics/projects/:projectId
 * Get analytics for a specific project.
 */
analytics.get(
  '/:workspaceId/analytics/projects/:projectId',
  workspaceMiddleware(),
  zValidator('query', dashboardQuerySchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const query = c.req.valid('query');

    try {
      void projectId;
      void query;

      return c.json({
        projectId,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        metrics: {
          totalViews: 0,
          uniqueVisitors: 0,
          averageWatchTime: 0,
          completionRate: 0,
          engagementScore: 0,
        },
        timeSeries: [],
        dropOffPoints: [],
      });
    } catch (err) {
      console.error('[analytics] Project analytics error:', err);
      return c.json({ error: 'Failed to fetch project analytics' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/analytics/advanced
 * Advanced analytics (requires pro/enterprise plan).
 */
analytics.get(
  '/:workspaceId/analytics/advanced',
  workspaceMiddleware(),
  planGuard('advancedAnalytics'),
  zValidator('query', dashboardQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      void workspaceId;
      void query;

      return c.json({
        funnels: [],
        cohorts: [],
        retention: [],
        heatmaps: [],
        userFlows: [],
      });
    } catch (err) {
      console.error('[analytics] Advanced error:', err);
      return c.json({ error: 'Failed to fetch advanced analytics' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/analytics/export
 * Export raw analytics data.
 */
analytics.post(
  '/:workspaceId/analytics/export',
  workspaceMiddleware(),
  zValidator('json', exportQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      // TODO: Queue export job, return presigned download URL when ready
      void workspaceId;

      return c.json(
        {
          export: {
            id: crypto.randomUUID(),
            format: body.format,
            status: 'queued',
            downloadUrl: null,
          },
          message: 'Analytics export queued',
        },
        202,
      );
    } catch (err) {
      console.error('[analytics] Export error:', err);
      return c.json({ error: 'Failed to export analytics' }, 500);
    }
  },
);

export default analytics;
