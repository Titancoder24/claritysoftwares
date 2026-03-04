import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';

const walkthroughs = new Hono();

walkthroughs.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const walkthroughStepSchema = z.object({
  orderIndex: z.number().int().min(0),
  stepType: z.enum(['click', 'input', 'scroll', 'navigation', 'wait', 'custom']),
  title: z.string().min(1).max(256),
  description: z.string().max(2000).optional(),
  targetSelector: z.string().min(1).max(500),
  targetUrl: z.string().url().optional(),
  tooltipPosition: z
    .enum(['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'left', 'right'])
    .default('bottom'),
  tooltipContent: z.string().max(2000).optional(),
  highlightPadding: z.number().int().min(0).max(50).default(8),
  advanceOn: z
    .enum(['click', 'input', 'navigation', 'timer', 'manual'])
    .default('click'),
  advanceDelayMs: z.number().int().min(0).max(30000).optional(),
  validation: z
    .object({
      type: z.enum(['element-exists', 'element-visible', 'input-value', 'url-match']),
      value: z.string().optional(),
    })
    .optional(),
  action: z
    .object({
      type: z.enum(['click', 'type', 'focus', 'scroll-to', 'none']),
      value: z.string().optional(),
    })
    .optional(),
});

const updateWalkthroughStepSchema = walkthroughStepSchema.partial();

const walkthroughSettingsSchema = z.object({
  triggerMode: z.enum(['auto', 'manual', 'url-match', 'element-exists']),
  triggerValue: z.string().max(500).optional(),
  showProgress: z.boolean().default(true),
  allowSkip: z.boolean().default(true),
  allowDismiss: z.boolean().default(true),
  overlayColor: z.string().default('rgba(0,0,0,0.5)'),
  overlayClickBehavior: z.enum(['advance', 'dismiss', 'none']).default('none'),
  theme: z
    .object({
      primaryColor: z.string().optional(),
      fontFamily: z.string().optional(),
      borderRadius: z.number().min(0).max(20).optional(),
    })
    .optional(),
});

const reorderStepsSchema = z.object({
  stepIds: z.array(z.string().uuid()),
});

// ── Steps CRUD ─────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/walkthrough-steps
 */
walkthroughs.get(
  '/:workspaceId/projects/:projectId/walkthrough-steps',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      void projectId;
      return c.json({ steps: [], total: 0 });
    } catch (err) {
      console.error('[walkthroughs] List steps error:', err);
      return c.json({ error: 'Failed to list walkthrough steps' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/projects/:projectId/walkthrough-steps
 */
walkthroughs.post(
  '/:workspaceId/projects/:projectId/walkthrough-steps',
  workspaceMiddleware(),
  zValidator('json', walkthroughStepSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const step = c.req.valid('json');

    try {
      // TODO: Check MAX_WALKTHROUGH_STEPS limit
      const id = crypto.randomUUID();
      void projectId;

      return c.json({ step: { id, projectId, ...step } }, 201);
    } catch (err) {
      console.error('[walkthroughs] Create step error:', err);
      return c.json({ error: 'Failed to create walkthrough step' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/projects/:projectId/walkthrough-steps/:stepId
 */
walkthroughs.get(
  '/:workspaceId/projects/:projectId/walkthrough-steps/:stepId',
  workspaceMiddleware(),
  async (c) => {
    const stepId = c.req.param('stepId');

    try {
      void stepId;
      return c.json({ step: null });
    } catch (err) {
      console.error('[walkthroughs] Get step error:', err);
      return c.json({ error: 'Failed to get walkthrough step' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/projects/:projectId/walkthrough-steps/:stepId
 */
walkthroughs.patch(
  '/:workspaceId/projects/:projectId/walkthrough-steps/:stepId',
  workspaceMiddleware(),
  zValidator('json', updateWalkthroughStepSchema),
  async (c) => {
    const stepId = c.req.param('stepId');
    const body = c.req.valid('json');

    try {
      void stepId;
      void body;
      return c.json({ step: null, message: 'Walkthrough step updated' });
    } catch (err) {
      console.error('[walkthroughs] Update step error:', err);
      return c.json({ error: 'Failed to update walkthrough step' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/projects/:projectId/walkthrough-steps/:stepId
 */
walkthroughs.delete(
  '/:workspaceId/projects/:projectId/walkthrough-steps/:stepId',
  workspaceMiddleware(),
  async (c) => {
    const stepId = c.req.param('stepId');

    try {
      void stepId;
      return c.json({ message: 'Walkthrough step deleted' });
    } catch (err) {
      console.error('[walkthroughs] Delete step error:', err);
      return c.json({ error: 'Failed to delete walkthrough step' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/projects/:projectId/walkthrough-steps/reorder
 */
walkthroughs.put(
  '/:workspaceId/projects/:projectId/walkthrough-steps/reorder',
  workspaceMiddleware(),
  zValidator('json', reorderStepsSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const { stepIds } = c.req.valid('json');

    try {
      void projectId;
      void stepIds;
      return c.json({ message: 'Steps reordered', order: stepIds });
    } catch (err) {
      console.error('[walkthroughs] Reorder error:', err);
      return c.json({ error: 'Failed to reorder walkthrough steps' }, 500);
    }
  },
);

// ── Settings ───────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/walkthrough-settings
 */
walkthroughs.get(
  '/:workspaceId/projects/:projectId/walkthrough-settings',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      void projectId;
      return c.json({ settings: null });
    } catch (err) {
      console.error('[walkthroughs] Get settings error:', err);
      return c.json({ error: 'Failed to get walkthrough settings' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/projects/:projectId/walkthrough-settings
 */
walkthroughs.put(
  '/:workspaceId/projects/:projectId/walkthrough-settings',
  workspaceMiddleware(),
  zValidator('json', walkthroughSettingsSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const settings = c.req.valid('json');

    try {
      void projectId;
      return c.json({ settings, message: 'Walkthrough settings saved' });
    } catch (err) {
      console.error('[walkthroughs] Save settings error:', err);
      return c.json({ error: 'Failed to save walkthrough settings' }, 500);
    }
  },
);

export default walkthroughs;
