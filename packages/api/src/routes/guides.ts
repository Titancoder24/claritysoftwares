import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';

const guides = new Hono();

guides.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const guideStepSchema = z.object({
  orderIndex: z.number().int().min(0),
  stepType: z.enum(['click', 'input', 'scroll', 'navigation', 'wait', 'custom']),
  title: z.string().min(1).max(256),
  description: z.string().max(2000).optional(),
  screenshotUrl: z.string().url().optional(),
  selector: z.string().max(500).optional(),
  highlightArea: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  tooltipPosition: z
    .enum(['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'left', 'right'])
    .default('bottom'),
  annotations: z
    .array(
      z.object({
        type: z.enum(['arrow', 'circle', 'rectangle', 'text', 'number']),
        x: z.number(),
        y: z.number(),
        width: z.number().optional(),
        height: z.number().optional(),
        color: z.string().optional(),
        content: z.string().max(500).optional(),
      }),
    )
    .max(20)
    .optional(),
});

const updateGuideStepSchema = guideStepSchema.partial();

const reorderStepsSchema = z.object({
  stepIds: z.array(z.string().uuid()),
});

const exportGuideSchema = z.object({
  format: z.enum(['pdf', 'html', 'markdown']),
  includeAnnotations: z.boolean().default(true),
  includeScreenshots: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'branded']).default('light'),
});

// ── Steps CRUD ─────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/guide-steps
 * List all steps for a guide project.
 */
guides.get(
  '/:workspaceId/projects/:projectId/guide-steps',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      // TODO: Fetch steps ordered by orderIndex
      void projectId;
      return c.json({ steps: [], total: 0 });
    } catch (err) {
      console.error('[guides] List steps error:', err);
      return c.json({ error: 'Failed to list guide steps' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/projects/:projectId/guide-steps
 * Add a new step to the guide.
 */
guides.post(
  '/:workspaceId/projects/:projectId/guide-steps',
  workspaceMiddleware(),
  zValidator('json', guideStepSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const step = c.req.valid('json');

    try {
      // TODO: Check MAX_GUIDE_STEPS limit
      // TODO: Insert step, shift subsequent orderIndex if needed
      const id = crypto.randomUUID();
      void projectId;

      return c.json({ step: { id, projectId, ...step } }, 201);
    } catch (err) {
      console.error('[guides] Create step error:', err);
      return c.json({ error: 'Failed to create guide step' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/projects/:projectId/guide-steps/:stepId
 */
guides.get(
  '/:workspaceId/projects/:projectId/guide-steps/:stepId',
  workspaceMiddleware(),
  async (c) => {
    const stepId = c.req.param('stepId');

    try {
      void stepId;
      return c.json({ step: null });
    } catch (err) {
      console.error('[guides] Get step error:', err);
      return c.json({ error: 'Failed to get guide step' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/projects/:projectId/guide-steps/:stepId
 */
guides.patch(
  '/:workspaceId/projects/:projectId/guide-steps/:stepId',
  workspaceMiddleware(),
  zValidator('json', updateGuideStepSchema),
  async (c) => {
    const stepId = c.req.param('stepId');
    const body = c.req.valid('json');

    try {
      void stepId;
      void body;
      return c.json({ step: null, message: 'Guide step updated' });
    } catch (err) {
      console.error('[guides] Update step error:', err);
      return c.json({ error: 'Failed to update guide step' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/projects/:projectId/guide-steps/:stepId
 */
guides.delete(
  '/:workspaceId/projects/:projectId/guide-steps/:stepId',
  workspaceMiddleware(),
  async (c) => {
    const stepId = c.req.param('stepId');

    try {
      // TODO: Delete step and re-index subsequent steps
      void stepId;
      return c.json({ message: 'Guide step deleted' });
    } catch (err) {
      console.error('[guides] Delete step error:', err);
      return c.json({ error: 'Failed to delete guide step' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/projects/:projectId/guide-steps/reorder
 * Reorder guide steps by providing the new order of step IDs.
 */
guides.put(
  '/:workspaceId/projects/:projectId/guide-steps/reorder',
  workspaceMiddleware(),
  zValidator('json', reorderStepsSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const { stepIds } = c.req.valid('json');

    try {
      // TODO: Update orderIndex for each step in a transaction
      void projectId;
      void stepIds;
      return c.json({ message: 'Steps reordered', order: stepIds });
    } catch (err) {
      console.error('[guides] Reorder error:', err);
      return c.json({ error: 'Failed to reorder guide steps' }, 500);
    }
  },
);

// ── Export ──────────────────────────────────────────────

/**
 * POST /workspaces/:workspaceId/projects/:projectId/guide-export
 * Export a guide in the specified format.
 */
guides.post(
  '/:workspaceId/projects/:projectId/guide-export',
  workspaceMiddleware(),
  zValidator('json', exportGuideSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const body = c.req.valid('json');

    try {
      // TODO: Generate export (PDF/HTML/Markdown)
      // TODO: Upload to storage and return presigned URL
      void projectId;

      return c.json(
        {
          export: {
            format: body.format,
            status: 'queued',
            downloadUrl: null,
          },
          message: 'Guide export queued',
        },
        202,
      );
    } catch (err) {
      console.error('[guides] Export error:', err);
      return c.json({ error: 'Failed to export guide' }, 500);
    }
  },
);

export default guides;
