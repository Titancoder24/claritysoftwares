import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { planGuard } from '../middleware/plan-guard';
import {
  createPresignedUpload,
  createPresignedDownload,
  recordingKey,
  deleteByPrefix,
} from '../services/storage';

const recordings = new Hono();

recordings.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const presignUploadSchema = z.object({
  filename: z.string().min(1).max(256),
  contentType: z.string().regex(/^video\//, 'Must be a video content type'),
  sizeBytes: z.number().int().positive().max(5 * 1024 * 1024 * 1024), // 5 GB
});

const completeUploadSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  durationMs: z.number().int().positive(),
  resolution: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  hasWebcam: z.boolean().default(false),
  metadata: z
    .object({
      browserName: z.string().optional(),
      browserVersion: z.string().optional(),
      osName: z.string().optional(),
      tabTitle: z.string().optional(),
      tabUrl: z.string().url().optional(),
    })
    .optional(),
});

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(['recording', 'uploading', 'processing', 'ready', 'failed']).optional(),
  search: z.string().max(256).optional(),
});

// ── Routes ─────────────────────────────────────────────

/**
 * POST /workspaces/:workspaceId/recordings/presign
 * Generate a presigned upload URL for a new recording.
 */
recordings.post(
  '/:workspaceId/recordings/presign',
  workspaceMiddleware(),
  planGuard('maxRecordings'),
  zValidator('json', presignUploadSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');
    const planLimits = c.get('planLimits');

    try {
      // Check recording duration limit from plan
      if (planLimits && body.sizeBytes > planLimits.maxStorageBytes && planLimits.maxStorageBytes !== -1) {
        return c.json({ error: 'File size exceeds plan storage limit' }, 403);
      }

      const recordingId = crypto.randomUUID();
      const key = recordingKey(workspaceId, recordingId, body.filename);

      const presigned = await createPresignedUpload({
        key,
        contentType: body.contentType,
        maxSizeBytes: body.sizeBytes,
      });

      // TODO: Insert recording record with status='uploading'

      return c.json(
        {
          recordingId,
          upload: presigned,
        },
        201,
      );
    } catch (err) {
      console.error('[recordings/presign] Error:', err);
      return c.json({ error: 'Failed to generate upload URL' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/recordings/:recordingId/complete
 * Mark an upload as complete and trigger processing.
 */
recordings.post(
  '/:workspaceId/recordings/:recordingId/complete',
  workspaceMiddleware(),
  zValidator('json', completeUploadSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const recordingId = c.req.param('recordingId');
    const body = c.req.valid('json');

    try {
      // TODO: Verify the object exists in storage
      // TODO: Update recording record: status='processing', set metadata
      // TODO: Trigger processing pipeline (transcoding, thumbnail gen, etc.)

      void workspaceId;

      return c.json({
        recording: {
          id: recordingId,
          status: 'processing',
          title: body.title ?? 'Untitled Recording',
          durationMs: body.durationMs,
          resolution: body.resolution,
        },
        message: 'Upload complete, processing started',
      });
    } catch (err) {
      console.error('[recordings/complete] Error:', err);
      return c.json({ error: 'Failed to complete upload' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/recordings
 * List recordings in a workspace.
 */
recordings.get(
  '/:workspaceId/recordings',
  workspaceMiddleware(),
  zValidator('query', listQuerySchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const query = c.req.valid('query');

    try {
      // TODO: Query recordings from DB with filters
      void workspaceId;
      void query;

      return c.json({
        recordings: [],
        total: 0,
        limit: query.limit,
        offset: query.offset,
      });
    } catch (err) {
      console.error('[recordings] List error:', err);
      return c.json({ error: 'Failed to list recordings' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/recordings/:recordingId
 * Get a single recording with a presigned playback URL.
 */
recordings.get(
  '/:workspaceId/recordings/:recordingId',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const recordingId = c.req.param('recordingId');

    try {
      // TODO: Fetch recording from DB
      // TODO: Generate presigned download URL for playback

      void workspaceId;
      void recordingId;

      return c.json({ recording: null });
    } catch (err) {
      console.error('[recordings] Get error:', err);
      return c.json({ error: 'Failed to get recording' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/recordings/:recordingId
 * Soft-delete a recording and remove its storage objects.
 */
recordings.delete(
  '/:workspaceId/recordings/:recordingId',
  workspaceMiddleware(),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const recordingId = c.req.param('recordingId');

    try {
      // TODO: Verify recording exists and belongs to workspace
      // TODO: Soft-delete in DB

      // Clean up storage objects
      const prefix = `workspaces/${workspaceId}/recordings/${recordingId}/`;
      const deleted = await deleteByPrefix(prefix);

      return c.json({
        message: 'Recording deleted',
        storageObjectsRemoved: deleted,
      });
    } catch (err) {
      console.error('[recordings] Delete error:', err);
      return c.json({ error: 'Failed to delete recording' }, 500);
    }
  },
);

export default recordings;
