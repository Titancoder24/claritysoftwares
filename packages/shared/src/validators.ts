import { z } from 'zod';
import {
  RecordingStatus,
  ProjectType,
  ProjectStatus,
  StepType,
  TooltipPosition,
  QuestionType,
  ExportFormat,
  ExportResolution,
  MemberRole,
  MAX_PROJECT_TITLE_LENGTH,
  MAX_WORKSPACE_NAME_LENGTH,
  MAX_GUIDE_STEPS,
  MAX_WALKTHROUGH_STEPS,
  MAX_ANNOTATIONS,
  MAX_ZOOM_KEYFRAMES,
  MAX_TRIM_SEGMENTS,
  MAX_QUIZ_QUESTIONS,
} from './constants';

// ──────────────────────────────────────────────
// Primitive helpers
// ──────────────────────────────────────────────

export const zId = z.string().uuid();
export const zSlug = z.string().min(1).max(128).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const zHexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/);
export const zNormalisedFloat = z.number().min(0).max(1);
export const zPositiveInt = z.number().int().positive();
export const zNonNegativeInt = z.number().int().nonnegative();

// ──────────────────────────────────────────────
// Enum schemas
// ──────────────────────────────────────────────

export const zRecordingStatus = z.nativeEnum(RecordingStatus);
export const zProjectType = z.nativeEnum(ProjectType);
export const zProjectStatus = z.nativeEnum(ProjectStatus);
export const zStepType = z.nativeEnum(StepType);
export const zTooltipPosition = z.nativeEnum(TooltipPosition);
export const zQuestionType = z.nativeEnum(QuestionType);
export const zExportFormat = z.nativeEnum(ExportFormat);
export const zExportResolution = z.nativeEnum(ExportResolution);
export const zMemberRole = z.nativeEnum(MemberRole);

// ──────────────────────────────────────────────
// Workspace
// ──────────────────────────────────────────────

export const zCreateWorkspace = z.object({
  name: z.string().min(1).max(MAX_WORKSPACE_NAME_LENGTH).trim(),
  slug: zSlug,
});

export const zUpdateWorkspace = z.object({
  name: z.string().min(1).max(MAX_WORKSPACE_NAME_LENGTH).trim().optional(),
  slug: zSlug.optional(),
  brandPrimaryColor: zHexColor.nullable().optional(),
  brandLogoUrl: z.string().url().nullable().optional(),
  brandFontFamily: z.string().max(128).nullable().optional(),
  customDomain: z.string().max(253).nullable().optional(),
  kbSubdomain: zSlug.nullable().optional(),
});

export const zInviteMember = z.object({
  email: z.string().email(),
  role: zMemberRole,
});

// ──────────────────────────────────────────────
// Recording
// ──────────────────────────────────────────────

export const zUpdateRecording = z.object({
  title: z.string().min(1).max(MAX_PROJECT_TITLE_LENGTH).trim().optional(),
  status: zRecordingStatus.optional(),
});

// ──────────────────────────────────────────────
// Project
// ──────────────────────────────────────────────

export const zCreateProject = z.object({
  recordingId: zId,
  title: z.string().min(1).max(MAX_PROJECT_TITLE_LENGTH).trim(),
  description: z.string().max(2000).nullable().optional(),
  type: zProjectType,
});

export const zUpdateProject = z.object({
  title: z.string().min(1).max(MAX_PROJECT_TITLE_LENGTH).trim().optional(),
  description: z.string().max(2000).nullable().optional(),
  status: zProjectStatus.optional(),
  data: z.string().optional(), // JSON-serialised project data
});

// ──────────────────────────────────────────────
// Zoom Keyframes
// ──────────────────────────────────────────────

export const zZoomKeyframe = z.object({
  id: zId,
  startMs: zNonNegativeInt,
  endMs: zPositiveInt,
  scale: z.number().min(1).max(10),
  focusX: zNormalisedFloat,
  focusY: zNormalisedFloat,
  easingIn: z.string().max(64),
  easingOut: z.string().max(64),
  transitionInMs: zNonNegativeInt,
  transitionOutMs: zNonNegativeInt,
});

export const zZoomKeyframes = z.array(zZoomKeyframe).max(MAX_ZOOM_KEYFRAMES);

// ──────────────────────────────────────────────
// Annotations
// ──────────────────────────────────────────────

export const zAnnotation = z.object({
  id: zId,
  type: z.enum(['arrow', 'rectangle', 'circle', 'text', 'blur', 'spotlight', 'callout']),
  startMs: zNonNegativeInt,
  endMs: zPositiveInt,
  x: zNormalisedFloat,
  y: zNormalisedFloat,
  width: zNormalisedFloat,
  height: zNormalisedFloat,
  rotation: z.number().min(-360).max(360),
  color: zHexColor,
  strokeColor: zHexColor,
  strokeWidth: z.number().min(0).max(50),
  opacity: zNormalisedFloat,
  text: z.string().max(5000).nullable(),
  fontSize: z.number().min(1).max(500).nullable(),
});

export const zAnnotations = z.array(zAnnotation).max(MAX_ANNOTATIONS);

// ──────────────────────────────────────────────
// Trim Segments
// ──────────────────────────────────────────────

export const zTrimSegment = z.object({
  id: zId,
  startMs: zNonNegativeInt,
  endMs: zPositiveInt,
});

export const zTrimSegments = z.array(zTrimSegment).max(MAX_TRIM_SEGMENTS);

// ──────────────────────────────────────────────
// Guide Steps
// ──────────────────────────────────────────────

export const zGuideStep = z.object({
  id: zId,
  order: zNonNegativeInt,
  type: zStepType,
  title: z.string().min(1).max(512),
  description: z.string().max(5000),
  screenshotUrl: z.string().url().nullable(),
  selector: z.string().max(1024).nullable(),
  annotations: zAnnotations,
  pageUrl: z.string().url().nullable(),
});

export const zGuideSteps = z.array(zGuideStep).max(MAX_GUIDE_STEPS);

// ──────────────────────────────────────────────
// Walkthrough Steps
// ──────────────────────────────────────────────

export const zWalkthroughStep = z.object({
  id: zId,
  order: zNonNegativeInt,
  type: zStepType,
  title: z.string().min(1).max(512),
  content: z.string().max(5000),
  selector: z.string().min(1).max(1024),
  tooltipPosition: zTooltipPosition,
  required: z.boolean(),
  urlPattern: z.string().max(2048).nullable(),
  expectedAction: z.string().max(512).nullable(),
});

export const zWalkthroughSteps = z.array(zWalkthroughStep).max(MAX_WALKTHROUGH_STEPS);

// ──────────────────────────────────────────────
// Knowledge Base
// ──────────────────────────────────────────────

export const zCreateKBSite = z.object({
  title: z.string().min(1).max(256).trim(),
  slug: zSlug,
  description: z.string().max(2000).nullable().optional(),
  primaryColor: zHexColor.optional(),
});

export const zUpdateKBSite = z.object({
  title: z.string().min(1).max(256).trim().optional(),
  slug: zSlug.optional(),
  description: z.string().max(2000).nullable().optional(),
  primaryColor: zHexColor.optional(),
  customDomain: z.string().max(253).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const zCreateKBCategory = z.object({
  title: z.string().min(1).max(256).trim(),
  slug: zSlug,
  description: z.string().max(2000).nullable().optional(),
  icon: z.string().max(64).nullable().optional(),
  order: zNonNegativeInt,
});

export const zCreateKBPage = z.object({
  categoryId: zId,
  title: z.string().min(1).max(256).trim(),
  slug: zSlug,
  body: z.string().max(100_000),
  order: zNonNegativeInt,
  projectId: zId.nullable().optional(),
  isPublished: z.boolean().optional(),
  metaDescription: z.string().max(320).nullable().optional(),
});

// ──────────────────────────────────────────────
// Courses / Academy
// ──────────────────────────────────────────────

export const zCreateCourse = z.object({
  title: z.string().min(1).max(256).trim(),
  slug: zSlug,
  description: z.string().max(10_000),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  coverImageUrl: z.string().url().nullable().optional(),
  estimatedDurationMin: zPositiveInt.nullable().optional(),
});

export const zCreateCourseModule = z.object({
  title: z.string().min(1).max(256).trim(),
  order: zNonNegativeInt,
});

export const zCreateCourseLesson = z.object({
  title: z.string().min(1).max(256).trim(),
  order: zNonNegativeInt,
  body: z.string().max(100_000),
  projectId: zId.nullable().optional(),
  estimatedDurationMin: zPositiveInt.nullable().optional(),
});

export const zCreateQuiz = z.object({
  title: z.string().min(1).max(256).trim(),
  passingScore: z.number().min(0).max(100),
});

export const zCreateQuizQuestion = z.object({
  order: zNonNegativeInt,
  type: zQuestionType,
  prompt: z.string().min(1).max(5000),
  options: z.array(z.string().max(1000)).max(20),
  correctAnswer: z.string().max(5000),
  explanation: z.string().max(5000).nullable().optional(),
});

export const zQuizQuestions = z.array(zCreateQuizQuestion).max(MAX_QUIZ_QUESTIONS);

// ──────────────────────────────────────────────
// Shared Link
// ──────────────────────────────────────────────

export const zCreateSharedLink = z.object({
  projectId: zId,
  passwordProtected: z.boolean().optional(),
  password: z.string().min(4).max(128).optional(),
  requireEmail: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  allowDownload: z.boolean().optional(),
  autoPlay: z.boolean().optional(),
});

export const zUpdateSharedLink = z.object({
  isActive: z.boolean().optional(),
  passwordProtected: z.boolean().optional(),
  password: z.string().min(4).max(128).optional(),
  requireEmail: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  allowDownload: z.boolean().optional(),
  autoPlay: z.boolean().optional(),
});

// ──────────────────────────────────────────────
// Widget
// ──────────────────────────────────────────────

export const zUpdateWidgetConfig = z.object({
  enabled: z.boolean().optional(),
  position: z.enum(['bottom-right', 'bottom-left']).optional(),
  primaryColor: zHexColor.optional(),
  welcomeMessage: z.string().max(1000).optional(),
  walkthroughIds: z.array(zId).max(50).optional(),
  guideIds: z.array(zId).max(50).optional(),
  allowedDomains: z.array(z.string().max(253)).max(50).optional(),
});

export const zCreatePinnedTooltip = z.object({
  selector: z.string().min(1).max(1024),
  title: z.string().min(1).max(256),
  content: z.string().max(5000),
  position: zTooltipPosition,
  urlPattern: z.string().max(2048),
  isActive: z.boolean().optional(),
});

// ──────────────────────────────────────────────
// Export
// ──────────────────────────────────────────────

export const zExportRequest = z.object({
  projectId: zId,
  format: zExportFormat,
  resolution: zExportResolution,
});

// ──────────────────────────────────────────────
// Editor Settings
// ──────────────────────────────────────────────

export const zCursorConfig = z.object({
  visible: z.boolean(),
  size: z.number().min(1).max(200),
  smoothing: z.boolean(),
  smoothingFactor: zNormalisedFloat,
  highlightClicks: z.boolean(),
  customCursorUrl: z.string().url().nullable(),
});

export const zZoomConfig = z.object({
  enabled: z.boolean(),
  defaultScale: z.number().min(1).max(10),
  defaultTransitionInMs: zNonNegativeInt,
  defaultTransitionOutMs: zNonNegativeInt,
  defaultHoldMs: zNonNegativeInt,
  springStiffness: z.number().min(1).max(1000),
  springDamping: z.number().min(0.1).max(100),
  springMass: z.number().min(0.01).max(100),
});

export const zClickEffectsConfig = z.object({
  enabled: z.boolean(),
  style: z.enum(['ripple', 'pulse', 'ring', 'glow']),
  color: zHexColor,
  radius: z.number().min(1).max(200),
  durationMs: zPositiveInt,
});

export const zAudioConfig = z.object({
  includeRecordedAudio: z.boolean(),
  recordedAudioVolume: zNormalisedFloat,
  backgroundMusicUrl: z.string().url().nullable(),
  backgroundMusicVolume: zNormalisedFloat,
  clickSoundEnabled: z.boolean(),
  clickSoundVolume: zNormalisedFloat,
});

export const zBackgroundConfig = z.object({
  type: z.enum(['color', 'gradient', 'image', 'transparent']),
  color: zHexColor,
  gradient: z.string().max(1024).nullable(),
  imageUrl: z.string().url().nullable(),
  padding: z.number().min(0).max(500),
  borderRadius: z.number().min(0).max(200),
  shadow: z.boolean(),
});

export const zDeviceFrameConfig = z.object({
  enabled: z.boolean(),
  device: z.enum(['browser', 'desktop', 'phone', 'tablet', 'none']),
  theme: z.enum(['light', 'dark']),
  showAddressBar: z.boolean(),
});

export const zEditorSettings = z.object({
  cursor: zCursorConfig,
  zoom: zZoomConfig,
  clickEffects: zClickEffectsConfig,
  audio: zAudioConfig,
  background: zBackgroundConfig,
  deviceFrame: zDeviceFrameConfig,
});
