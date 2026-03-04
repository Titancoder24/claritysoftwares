import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';

const courses = new Hono();

courses.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const createCourseSchema = z.object({
  title: z.string().min(1).max(256),
  slug: z
    .string()
    .min(2)
    .max(128)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  thumbnailUrl: z.string().url().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  settings: z
    .object({
      requireSequentialProgress: z.boolean().default(true),
      enableCertificate: z.boolean().default(false),
      certificateTemplateId: z.string().uuid().optional(),
      passingScore: z.number().min(0).max(100).default(70),
      estimatedDurationMinutes: z.number().int().positive().optional(),
      maxAttempts: z.number().int().min(0).max(10).default(0), // 0 = unlimited
    })
    .optional(),
  tags: z.array(z.string().max(64)).max(20).optional(),
});

const updateCourseSchema = createCourseSchema.partial();

const createModuleSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().max(2000).optional(),
  orderIndex: z.number().int().min(0),
});

const updateModuleSchema = createModuleSchema.partial();

const createLessonSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().max(2000).optional(),
  orderIndex: z.number().int().min(0),
  type: z.enum(['video', 'guide', 'walkthrough', 'text', 'quiz']),
  projectId: z.string().uuid().optional(), // link to a ScreenFlow project
  content: z.string().max(50000).optional(), // for text lessons
  durationMinutes: z.number().int().positive().optional(),
  quiz: z
    .object({
      questions: z
        .array(
          z.object({
            id: z.string().uuid().optional(),
            type: z.enum(['multiple_choice', 'true_false', 'free_text']),
            question: z.string().min(1).max(1000),
            options: z.array(z.string().max(500)).max(10).optional(),
            correctAnswer: z.union([z.string(), z.number()]).optional(),
            explanation: z.string().max(2000).optional(),
            points: z.number().int().min(0).max(100).default(1),
          }),
        )
        .max(50),
    })
    .optional(),
});

const updateLessonSchema = createLessonSchema.partial();

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  search: z.string().max(256).optional(),
});

// ── Course CRUD ────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/courses
 */
courses.get(
  '/:workspaceId/courses',
  workspaceMiddleware(),
  zValidator('query', listQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      void workspaceId;
      void query;
      return c.json({ courses: [], total: 0, limit: query.limit, offset: query.offset });
    } catch (err) {
      console.error('[courses] List error:', err);
      return c.json({ error: 'Failed to list courses' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/courses
 */
courses.post(
  '/:workspaceId/courses',
  workspaceMiddleware(),
  zValidator('json', createCourseSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const user = c.get('user');
    const body = c.req.valid('json');

    try {
      const id = crypto.randomUUID();

      return c.json(
        {
          course: {
            id,
            workspaceId,
            createdBy: user.sub,
            ...body,
            createdAt: new Date().toISOString(),
          },
        },
        201,
      );
    } catch (err) {
      console.error('[courses] Create error:', err);
      return c.json({ error: 'Failed to create course' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/courses/:courseId
 */
courses.get(
  '/:workspaceId/courses/:courseId',
  workspaceMiddleware(),
  async (c) => {
    const courseId = c.req.param('courseId');

    try {
      // TODO: Fetch course with modules and lessons
      void courseId;
      return c.json({ course: null });
    } catch (err) {
      console.error('[courses] Get error:', err);
      return c.json({ error: 'Failed to get course' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/courses/:courseId
 */
courses.patch(
  '/:workspaceId/courses/:courseId',
  workspaceMiddleware(),
  zValidator('json', updateCourseSchema),
  async (c) => {
    const courseId = c.req.param('courseId');
    const body = c.req.valid('json');

    try {
      void courseId;
      void body;
      return c.json({ course: null, message: 'Course updated' });
    } catch (err) {
      console.error('[courses] Update error:', err);
      return c.json({ error: 'Failed to update course' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/courses/:courseId
 */
courses.delete(
  '/:workspaceId/courses/:courseId',
  workspaceMiddleware(),
  async (c) => {
    const courseId = c.req.param('courseId');

    try {
      // TODO: Cascade delete modules, lessons, enrollments
      void courseId;
      return c.json({ message: 'Course deleted' });
    } catch (err) {
      console.error('[courses] Delete error:', err);
      return c.json({ error: 'Failed to delete course' }, 500);
    }
  },
);

// ── Modules ────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/courses/:courseId/modules
 */
courses.get(
  '/:workspaceId/courses/:courseId/modules',
  workspaceMiddleware(),
  async (c) => {
    const courseId = c.req.param('courseId');

    try {
      void courseId;
      return c.json({ modules: [] });
    } catch (err) {
      console.error('[courses] List modules error:', err);
      return c.json({ error: 'Failed to list modules' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/courses/:courseId/modules
 */
courses.post(
  '/:workspaceId/courses/:courseId/modules',
  workspaceMiddleware(),
  zValidator('json', createModuleSchema),
  async (c) => {
    const courseId = c.req.param('courseId');
    const body = c.req.valid('json');

    try {
      // TODO: Check MAX_COURSE_MODULES limit
      const id = crypto.randomUUID();

      return c.json({ module: { id, courseId, ...body } }, 201);
    } catch (err) {
      console.error('[courses] Create module error:', err);
      return c.json({ error: 'Failed to create module' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/courses/:courseId/modules/:moduleId
 */
courses.patch(
  '/:workspaceId/courses/:courseId/modules/:moduleId',
  workspaceMiddleware(),
  zValidator('json', updateModuleSchema),
  async (c) => {
    const moduleId = c.req.param('moduleId');
    const body = c.req.valid('json');

    try {
      void moduleId;
      void body;
      return c.json({ module: null, message: 'Module updated' });
    } catch (err) {
      console.error('[courses] Update module error:', err);
      return c.json({ error: 'Failed to update module' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/courses/:courseId/modules/:moduleId
 */
courses.delete(
  '/:workspaceId/courses/:courseId/modules/:moduleId',
  workspaceMiddleware(),
  async (c) => {
    const moduleId = c.req.param('moduleId');

    try {
      void moduleId;
      return c.json({ message: 'Module deleted' });
    } catch (err) {
      console.error('[courses] Delete module error:', err);
      return c.json({ error: 'Failed to delete module' }, 500);
    }
  },
);

// ── Lessons ────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/courses/:courseId/modules/:moduleId/lessons
 */
courses.get(
  '/:workspaceId/courses/:courseId/modules/:moduleId/lessons',
  workspaceMiddleware(),
  async (c) => {
    const moduleId = c.req.param('moduleId');

    try {
      void moduleId;
      return c.json({ lessons: [] });
    } catch (err) {
      console.error('[courses] List lessons error:', err);
      return c.json({ error: 'Failed to list lessons' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/courses/:courseId/modules/:moduleId/lessons
 */
courses.post(
  '/:workspaceId/courses/:courseId/modules/:moduleId/lessons',
  workspaceMiddleware(),
  zValidator('json', createLessonSchema),
  async (c) => {
    const moduleId = c.req.param('moduleId');
    const body = c.req.valid('json');

    try {
      const id = crypto.randomUUID();

      return c.json({ lesson: { id, moduleId, ...body } }, 201);
    } catch (err) {
      console.error('[courses] Create lesson error:', err);
      return c.json({ error: 'Failed to create lesson' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/courses/:courseId/modules/:moduleId/lessons/:lessonId
 */
courses.patch(
  '/:workspaceId/courses/:courseId/modules/:moduleId/lessons/:lessonId',
  workspaceMiddleware(),
  zValidator('json', updateLessonSchema),
  async (c) => {
    const lessonId = c.req.param('lessonId');
    const body = c.req.valid('json');

    try {
      void lessonId;
      void body;
      return c.json({ lesson: null, message: 'Lesson updated' });
    } catch (err) {
      console.error('[courses] Update lesson error:', err);
      return c.json({ error: 'Failed to update lesson' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/courses/:courseId/modules/:moduleId/lessons/:lessonId
 */
courses.delete(
  '/:workspaceId/courses/:courseId/modules/:moduleId/lessons/:lessonId',
  workspaceMiddleware(),
  async (c) => {
    const lessonId = c.req.param('lessonId');

    try {
      void lessonId;
      return c.json({ message: 'Lesson deleted' });
    } catch (err) {
      console.error('[courses] Delete lesson error:', err);
      return c.json({ error: 'Failed to delete lesson' }, 500);
    }
  },
);

export default courses;
