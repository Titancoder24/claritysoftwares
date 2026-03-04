import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';

const enrollments = new Hono();

enrollments.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const enrollSchema = z.object({
  courseId: z.string().uuid(),
  learnerId: z.string().uuid().optional(), // If omitted, enroll the requesting user
  learnerEmail: z.string().email().optional(),
});

const batchEnrollSchema = z.object({
  courseId: z.string().uuid(),
  learnerEmails: z.array(z.string().email()).min(1).max(100),
});

const updateProgressSchema = z.object({
  lessonId: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  score: z.number().min(0).max(100).optional(),
  timeSpentMs: z.number().int().min(0).optional(),
  quizAnswers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        answer: z.union([z.string(), z.number()]),
      }),
    )
    .optional(),
});

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  courseId: z.string().uuid().optional(),
  status: z.enum(['active', 'completed', 'dropped']).optional(),
});

// ── Routes ─────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/enrollments
 * List enrollments. Admins see all; learners see their own.
 */
enrollments.get(
  '/:workspaceId/enrollments',
  workspaceMiddleware(),
  zValidator('query', listQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      void workspaceId;
      void query;
      return c.json({
        enrollments: [],
        total: 0,
        limit: query.limit,
        offset: query.offset,
      });
    } catch (err) {
      console.error('[enrollments] List error:', err);
      return c.json({ error: 'Failed to list enrollments' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/enrollments
 * Enroll a user in a course.
 */
enrollments.post(
  '/:workspaceId/enrollments',
  workspaceMiddleware(),
  zValidator('json', enrollSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const user = c.get('user');
    const body = c.req.valid('json');

    try {
      const enrollmentId = crypto.randomUUID();
      const learnerId = body.learnerId ?? user.sub;

      // TODO: Verify course exists and is published
      // TODO: Check for existing enrollment
      // TODO: Send enrollment confirmation email

      return c.json(
        {
          enrollment: {
            id: enrollmentId,
            courseId: body.courseId,
            learnerId,
            workspaceId,
            status: 'active',
            progress: 0,
            enrolledAt: new Date().toISOString(),
          },
          message: 'Enrolled successfully',
        },
        201,
      );
    } catch (err) {
      console.error('[enrollments] Enroll error:', err);
      return c.json({ error: 'Failed to enroll' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/enrollments/batch
 * Batch enroll multiple users by email.
 */
enrollments.post(
  '/:workspaceId/enrollments/batch',
  workspaceMiddleware(),
  zValidator('json', batchEnrollSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      // TODO: Look up users by email, create invites for non-users
      // TODO: Create enrollment records
      // TODO: Send batch emails

      void workspaceId;

      return c.json(
        {
          enrolled: body.learnerEmails.length,
          courseId: body.courseId,
          message: `${body.learnerEmails.length} learners enrolled`,
        },
        201,
      );
    } catch (err) {
      console.error('[enrollments] Batch enroll error:', err);
      return c.json({ error: 'Failed to batch enroll' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/enrollments/:enrollmentId
 * Get enrollment details with progress.
 */
enrollments.get(
  '/:workspaceId/enrollments/:enrollmentId',
  workspaceMiddleware(),
  async (c) => {
    const enrollmentId = c.req.param('enrollmentId');

    try {
      // TODO: Fetch enrollment with lesson progress
      void enrollmentId;
      return c.json({ enrollment: null });
    } catch (err) {
      console.error('[enrollments] Get error:', err);
      return c.json({ error: 'Failed to get enrollment' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/enrollments/:enrollmentId/progress
 * Update lesson progress for an enrollment.
 */
enrollments.post(
  '/:workspaceId/enrollments/:enrollmentId/progress',
  workspaceMiddleware(),
  zValidator('json', updateProgressSchema),
  async (c) => {
    const enrollmentId = c.req.param('enrollmentId');
    const body = c.req.valid('json');

    try {
      // TODO: Verify enrollment belongs to user
      // TODO: Validate lesson belongs to the enrolled course
      // TODO: Grade quiz if quizAnswers provided
      // TODO: Update lesson progress record
      // TODO: Recalculate overall course progress
      // TODO: Check if course is complete -> issue certificate

      void enrollmentId;

      return c.json({
        progress: {
          lessonId: body.lessonId,
          status: body.status,
          score: body.score,
        },
        message: 'Progress updated',
      });
    } catch (err) {
      console.error('[enrollments] Update progress error:', err);
      return c.json({ error: 'Failed to update progress' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/enrollments/:enrollmentId
 * Drop / unenroll from a course.
 */
enrollments.delete(
  '/:workspaceId/enrollments/:enrollmentId',
  workspaceMiddleware(),
  async (c) => {
    const enrollmentId = c.req.param('enrollmentId');

    try {
      // TODO: Soft-delete / mark as dropped
      void enrollmentId;
      return c.json({ message: 'Enrollment cancelled' });
    } catch (err) {
      console.error('[enrollments] Delete error:', err);
      return c.json({ error: 'Failed to cancel enrollment' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/enrollments/:enrollmentId/certificate
 * Get the completion certificate if the course is passed.
 */
enrollments.get(
  '/:workspaceId/enrollments/:enrollmentId/certificate',
  workspaceMiddleware(),
  async (c) => {
    const enrollmentId = c.req.param('enrollmentId');

    try {
      // TODO: Verify enrollment is completed and course has certificates enabled
      // TODO: Generate or retrieve certificate URL
      void enrollmentId;

      return c.json({ certificate: null });
    } catch (err) {
      console.error('[enrollments] Certificate error:', err);
      return c.json({ error: 'Failed to get certificate' }, 500);
    }
  },
);

export default enrollments;
