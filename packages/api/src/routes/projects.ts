import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';

const projects = new Hono();

projects.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const createProjectSchema = z.object({
  recordingId: z.string().uuid(),
  title: z.string().min(1).max(256),
  type: z.enum(['video', 'guide', 'walkthrough']),
  autoGenerate: z.boolean().default(true),
});

const updateProjectSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  description: z.string().max(2000).optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  tags: z.array(z.string().max(64)).max(20).optional(),
});

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  type: z.enum(['video', 'guide', 'walkthrough']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  search: z.string().max(256).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const duplicateProjectSchema = z.object({
  title: z.string().min(1).max(256).optional(),
});

// ── Routes ─────────────────────────────────────────────

/**
 * POST /workspaces/:workspaceId/projects
 * Create a new project from a recording.
 * If autoGenerate is true, triggers automatic content generation
 * (e.g. guide steps from click events, video settings from recording).
 */
projects.post(
  '/:workspaceId/projects',
  workspaceMiddleware(),
  zValidator('json', createProjectSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const user = c.get('user');
    const body = c.req.valid('json');

    try {
      // TODO: Verify recording exists
      // TODO: Insert project record
      // TODO: If autoGenerate, dispatch generation job based on type:
      //   - video: create default video_settings, detect zoom keyframes
      //   - guide: extract steps from click/navigation events
      //   - walkthrough: create steps from DOM interaction events

      const projectId = crypto.randomUUID();

      return c.json(
        {
          project: {
            id: projectId,
            workspaceId,
            recordingId: body.recordingId,
            title: body.title,
            type: body.type,
            status: 'draft',
            createdBy: user.sub,
            createdAt: new Date().toISOString(),
          },
          autoGenerate: body.autoGenerate,
          message: body.autoGenerate
            ? 'Project created, auto-generation started'
            : 'Project created',
        },
        201,
      );
    } catch (err) {
      console.error('[projects] Create error:', err);
      return c.json({ error: 'Failed to create project' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/projects
 * List projects in a workspace with filtering and pagination.
 */
projects.get(
  '/:workspaceId/projects',
  workspaceMiddleware(),
  zValidator('query', listQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      // TODO: Query projects from DB
      void workspaceId;
      void query;

      return c.json({
        projects: [],
        total: 0,
        limit: query.limit,
        offset: query.offset,
      });
    } catch (err) {
      console.error('[projects] List error:', err);
      return c.json({ error: 'Failed to list projects' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/projects/:projectId
 * Get a single project with its associated data.
 */
projects.get(
  '/:workspaceId/projects/:projectId',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const projectId = c.req.param('projectId');

    try {
      // TODO: Fetch project with related data
      void workspaceId;
      void projectId;

      return c.json({ project: null });
    } catch (err) {
      console.error('[projects] Get error:', err);
      return c.json({ error: 'Failed to get project' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/projects/:projectId
 * Update project metadata.
 */
projects.patch(
  '/:workspaceId/projects/:projectId',
  workspaceMiddleware(),
  zValidator('json', updateProjectSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const projectId = c.req.param('projectId');
    const body = c.req.valid('json');

    try {
      // TODO: Update project in DB
      void workspaceId;
      void projectId;
      void body;

      return c.json({ project: null, message: 'Project updated' });
    } catch (err) {
      console.error('[projects] Update error:', err);
      return c.json({ error: 'Failed to update project' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/projects/:projectId
 * Delete a project and its associated content.
 */
projects.delete(
  '/:workspaceId/projects/:projectId',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const projectId = c.req.param('projectId');

    try {
      // TODO: Cascade delete (video settings, steps, annotations, etc.)
      // TODO: Delete associated storage objects
      void workspaceId;
      void projectId;

      return c.json({ message: 'Project deleted' });
    } catch (err) {
      console.error('[projects] Delete error:', err);
      return c.json({ error: 'Failed to delete project' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/projects/:projectId/duplicate
 * Duplicate a project with all its content.
 */
projects.post(
  '/:workspaceId/projects/:projectId/duplicate',
  workspaceMiddleware(),
  zValidator('json', duplicateProjectSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const projectId = c.req.param('projectId');
    const body = c.req.valid('json');
    const user = c.get('user');

    try {
      // TODO: Deep-copy project and all related records
      const newProjectId = crypto.randomUUID();

      void workspaceId;
      void projectId;

      return c.json(
        {
          project: {
            id: newProjectId,
            title: body.title ?? 'Copy of project',
            status: 'draft',
            createdBy: user.sub,
            createdAt: new Date().toISOString(),
          },
          message: 'Project duplicated',
        },
        201,
      );
    } catch (err) {
      console.error('[projects] Duplicate error:', err);
      return c.json({ error: 'Failed to duplicate project' }, 500);
    }
  },
);

export default projects;
