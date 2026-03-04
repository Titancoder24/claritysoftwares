import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { queueExportJob } from '../services/export-worker';

const videoEditor = new Hono();

videoEditor.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const videoSettingsSchema = z.object({
  background: z
    .object({
      type: z.enum(['color', 'gradient', 'image', 'blur']),
      value: z.string(),
    })
    .optional(),
  padding: z.number().int().min(0).max(200).optional(),
  borderRadius: z.number().int().min(0).max(100).optional(),
  shadow: z
    .object({
      enabled: z.boolean(),
      blur: z.number().min(0).max(100),
      spread: z.number().min(0).max(100),
      color: z.string(),
      offsetX: z.number(),
      offsetY: z.number(),
    })
    .optional(),
  cursor: z
    .object({
      visible: z.boolean(),
      size: z.number().min(8).max(64),
      smoothing: z.boolean(),
      highlightClicks: z.boolean(),
      clickEffectRadius: z.number().min(10).max(100).optional(),
      clickEffectDuration: z.number().min(100).max(1000).optional(),
    })
    .optional(),
  webcam: z
    .object({
      visible: z.boolean(),
      position: z.enum([
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ]),
      size: z.number().min(50).max(400),
      shape: z.enum(['circle', 'rounded', 'square']),
      borderColor: z.string().optional(),
      borderWidth: z.number().min(0).max(10).optional(),
    })
    .optional(),
  watermark: z
    .object({
      enabled: z.boolean(),
      imageUrl: z.string().url().optional(),
      position: z.enum([
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ]),
      opacity: z.number().min(0).max(1),
      size: z.number().min(20).max(200),
    })
    .optional(),
});

const zoomKeyframeSchema = z.object({
  timestampMs: z.number().int().min(0),
  zoomLevel: z.number().min(1).max(5),
  centerX: z.number().min(0).max(1), // normalized 0-1
  centerY: z.number().min(0).max(1),
  durationMs: z.number().int().min(100).max(5000),
  easing: z.enum(['linear', 'ease-in', 'ease-out', 'ease-in-out', 'spring']).default('ease-in-out'),
});

const batchZoomKeyframesSchema = z.object({
  keyframes: z.array(zoomKeyframeSchema).max(500),
});

const annotationSchema = z.object({
  type: z.enum(['text', 'arrow', 'rectangle', 'ellipse', 'highlight', 'blur', 'callout']),
  startMs: z.number().int().min(0),
  endMs: z.number().int().min(0),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
  }),
  style: z
    .object({
      color: z.string().optional(),
      backgroundColor: z.string().optional(),
      fontSize: z.number().min(8).max(128).optional(),
      fontWeight: z.enum(['normal', 'bold']).optional(),
      borderWidth: z.number().min(0).max(20).optional(),
      borderColor: z.string().optional(),
      opacity: z.number().min(0).max(1).optional(),
    })
    .optional(),
  content: z.string().max(1000).optional(), // for text/callout annotations
  animation: z
    .object({
      enter: z.enum(['none', 'fade', 'scale', 'slide']).default('fade'),
      exit: z.enum(['none', 'fade', 'scale', 'slide']).default('fade'),
      enterDurationMs: z.number().int().min(0).max(2000).default(300),
      exitDurationMs: z.number().int().min(0).max(2000).default(300),
    })
    .optional(),
});

const trimSegmentSchema = z.object({
  startMs: z.number().int().min(0),
  endMs: z.number().int().min(0),
});

const batchTrimSchema = z.object({
  segments: z.array(trimSegmentSchema).min(1).max(100),
});

const exportSchema = z.object({
  format: z.enum(['mp4', 'webm', 'gif']),
  resolution: z.enum(['720p', '1080p', '1440p', '4k']),
  includeWebcam: z.boolean().default(true),
  includeCursor: z.boolean().default(true),
  includeZoom: z.boolean().default(true),
  includeAnnotations: z.boolean().default(true),
});

// ── Video Settings ─────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/video-settings
 */
videoEditor.get(
  '/:workspaceId/projects/:projectId/video-settings',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      // TODO: Fetch video settings from DB
      void projectId;
      return c.json({ settings: null });
    } catch (err) {
      console.error('[video-editor] Get settings error:', err);
      return c.json({ error: 'Failed to get video settings' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/projects/:projectId/video-settings
 */
videoEditor.put(
  '/:workspaceId/projects/:projectId/video-settings',
  workspaceMiddleware(),
  zValidator('json', videoSettingsSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const body = c.req.valid('json');

    try {
      // TODO: Upsert video settings in DB
      void projectId;
      void body;
      return c.json({ settings: body, message: 'Video settings saved' });
    } catch (err) {
      console.error('[video-editor] Save settings error:', err);
      return c.json({ error: 'Failed to save video settings' }, 500);
    }
  },
);

// ── Zoom Keyframes ─────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/zoom-keyframes
 */
videoEditor.get(
  '/:workspaceId/projects/:projectId/zoom-keyframes',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      void projectId;
      return c.json({ keyframes: [] });
    } catch (err) {
      console.error('[video-editor] List keyframes error:', err);
      return c.json({ error: 'Failed to list zoom keyframes' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/projects/:projectId/zoom-keyframes
 * Replace all zoom keyframes (batch update).
 */
videoEditor.put(
  '/:workspaceId/projects/:projectId/zoom-keyframes',
  workspaceMiddleware(),
  zValidator('json', batchZoomKeyframesSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const { keyframes } = c.req.valid('json');

    try {
      // TODO: Validate no overlapping timestamps
      // TODO: Delete existing + insert new in a transaction
      void projectId;

      return c.json({
        keyframes,
        count: keyframes.length,
        message: 'Zoom keyframes updated',
      });
    } catch (err) {
      console.error('[video-editor] Update keyframes error:', err);
      return c.json({ error: 'Failed to update zoom keyframes' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/projects/:projectId/zoom-keyframes
 * Add a single zoom keyframe.
 */
videoEditor.post(
  '/:workspaceId/projects/:projectId/zoom-keyframes',
  workspaceMiddleware(),
  zValidator('json', zoomKeyframeSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const keyframe = c.req.valid('json');

    try {
      const id = crypto.randomUUID();
      void projectId;

      return c.json({ keyframe: { id, ...keyframe } }, 201);
    } catch (err) {
      console.error('[video-editor] Add keyframe error:', err);
      return c.json({ error: 'Failed to add zoom keyframe' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/projects/:projectId/zoom-keyframes/:keyframeId
 */
videoEditor.delete(
  '/:workspaceId/projects/:projectId/zoom-keyframes/:keyframeId',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');
    const keyframeId = c.req.param('keyframeId');

    try {
      void projectId;
      void keyframeId;
      return c.json({ message: 'Zoom keyframe deleted' });
    } catch (err) {
      console.error('[video-editor] Delete keyframe error:', err);
      return c.json({ error: 'Failed to delete zoom keyframe' }, 500);
    }
  },
);

// ── Annotations ────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/annotations
 */
videoEditor.get(
  '/:workspaceId/projects/:projectId/annotations',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      void projectId;
      return c.json({ annotations: [] });
    } catch (err) {
      console.error('[video-editor] List annotations error:', err);
      return c.json({ error: 'Failed to list annotations' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/projects/:projectId/annotations
 */
videoEditor.post(
  '/:workspaceId/projects/:projectId/annotations',
  workspaceMiddleware(),
  zValidator('json', annotationSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const annotation = c.req.valid('json');

    try {
      const id = crypto.randomUUID();
      void projectId;

      return c.json({ annotation: { id, ...annotation } }, 201);
    } catch (err) {
      console.error('[video-editor] Add annotation error:', err);
      return c.json({ error: 'Failed to add annotation' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/projects/:projectId/annotations/:annotationId
 */
videoEditor.patch(
  '/:workspaceId/projects/:projectId/annotations/:annotationId',
  workspaceMiddleware(),
  zValidator('json', annotationSchema.partial()),
  async (c) => {
    const annotationId = c.req.param('annotationId');
    const body = c.req.valid('json');

    try {
      void annotationId;
      void body;
      return c.json({ annotation: null, message: 'Annotation updated' });
    } catch (err) {
      console.error('[video-editor] Update annotation error:', err);
      return c.json({ error: 'Failed to update annotation' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/projects/:projectId/annotations/:annotationId
 */
videoEditor.delete(
  '/:workspaceId/projects/:projectId/annotations/:annotationId',
  workspaceMiddleware(),
  async (c) => {
    const annotationId = c.req.param('annotationId');

    try {
      void annotationId;
      return c.json({ message: 'Annotation deleted' });
    } catch (err) {
      console.error('[video-editor] Delete annotation error:', err);
      return c.json({ error: 'Failed to delete annotation' }, 500);
    }
  },
);

// ── Trim Segments ──────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/projects/:projectId/trim-segments
 */
videoEditor.get(
  '/:workspaceId/projects/:projectId/trim-segments',
  workspaceMiddleware(),
  async (c) => {
    const projectId = c.req.param('projectId');

    try {
      void projectId;
      return c.json({ segments: [] });
    } catch (err) {
      console.error('[video-editor] List trim segments error:', err);
      return c.json({ error: 'Failed to list trim segments' }, 500);
    }
  },
);

/**
 * PUT /workspaces/:workspaceId/projects/:projectId/trim-segments
 * Replace all trim segments (batch update).
 */
videoEditor.put(
  '/:workspaceId/projects/:projectId/trim-segments',
  workspaceMiddleware(),
  zValidator('json', batchTrimSchema),
  async (c) => {
    const projectId = c.req.param('projectId');
    const { segments } = c.req.valid('json');

    try {
      // Validate no overlapping segments
      const sorted = [...segments].sort((a, b) => a.startMs - b.startMs);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].startMs < sorted[i - 1].endMs) {
          return c.json({ error: 'Trim segments must not overlap' }, 400);
        }
      }

      // Validate startMs < endMs
      for (const seg of segments) {
        if (seg.startMs >= seg.endMs) {
          return c.json({ error: 'startMs must be less than endMs' }, 400);
        }
      }

      void projectId;

      return c.json({
        segments: sorted,
        count: sorted.length,
        message: 'Trim segments updated',
      });
    } catch (err) {
      console.error('[video-editor] Update trim segments error:', err);
      return c.json({ error: 'Failed to update trim segments' }, 500);
    }
  },
);

// ── Export ──────────────────────────────────────────────

/**
 * POST /workspaces/:workspaceId/projects/:projectId/export
 * Queue a video export job.
 */
videoEditor.post(
  '/:workspaceId/projects/:projectId/export',
  workspaceMiddleware(),
  zValidator('json', exportSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const projectId = c.req.param('projectId');
    const user = c.get('user');
    const body = c.req.valid('json');

    try {
      const job = await queueExportJob({
        projectId,
        workspaceId,
        userId: user.sub,
        format: body.format,
        resolution: body.resolution,
        includeWebcam: body.includeWebcam,
        includeCursor: body.includeCursor,
        includeZoom: body.includeZoom,
        includeAnnotations: body.includeAnnotations,
      });

      return c.json({ job }, 202);
    } catch (err) {
      console.error('[video-editor] Export error:', err);
      return c.json({ error: 'Failed to queue export' }, 500);
    }
  },
);

/**
 * GET /workspaces/:workspaceId/projects/:projectId/export/:jobId
 * Check export job status.
 */
videoEditor.get(
  '/:workspaceId/projects/:projectId/export/:jobId',
  workspaceMiddleware(),
  async (c) => {
    const jobId = c.req.param('jobId');

    try {
      // TODO: Look up job status
      void jobId;
      return c.json({ job: null });
    } catch (err) {
      console.error('[video-editor] Export status error:', err);
      return c.json({ error: 'Failed to get export status' }, 500);
    }
  },
);

export default videoEditor;
