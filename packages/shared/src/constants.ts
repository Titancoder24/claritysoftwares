// ──────────────────────────────────────────────
// Recording
// ──────────────────────────────────────────────

/** Lifecycle status of a screen recording. */
export enum RecordingStatus {
  /** Extension is actively capturing the screen. */
  Recording = 'recording',
  /** Raw capture is being uploaded to object storage. */
  Uploading = 'uploading',
  /** Server-side processing / transcoding in progress. */
  Processing = 'processing',
  /** Recording is ready for viewing or editing. */
  Ready = 'ready',
  /** Processing or upload failed. */
  Failed = 'failed',
  /** Soft-deleted by the user. */
  Deleted = 'deleted',
}

// ──────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────

/** The three primary project types the editor supports. */
export enum ProjectType {
  /** Standard screen recording with optional webcam overlay. */
  Video = 'video',
  /** Step-by-step screenshot guide auto-generated from a recording. */
  Guide = 'guide',
  /** Interactive in-app walkthrough overlay. */
  Walkthrough = 'walkthrough',
}

/** Publication status of a project. */
export enum ProjectStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

// ──────────────────────────────────────────────
// Guides & Walkthroughs
// ──────────────────────────────────────────────

/** The kind of action a guide / walkthrough step represents. */
export enum StepType {
  Click = 'click',
  Input = 'input',
  Scroll = 'scroll',
  Navigation = 'navigation',
  Wait = 'wait',
  Custom = 'custom',
}

/** Where a tooltip is anchored relative to its target element. */
export enum TooltipPosition {
  Top = 'top',
  TopLeft = 'top-left',
  TopRight = 'top-right',
  Bottom = 'bottom',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  Left = 'left',
  Right = 'right',
}

// ──────────────────────────────────────────────
// Academy / Courses
// ──────────────────────────────────────────────

/** Type of question in a quiz. */
export enum QuestionType {
  MultipleChoice = 'multiple_choice',
  TrueFalse = 'true_false',
  FreeText = 'free_text',
}

// ──────────────────────────────────────────────
// Export
// ──────────────────────────────────────────────

/** Supported video / image export formats. */
export enum ExportFormat {
  MP4 = 'mp4',
  WebM = 'webm',
  GIF = 'gif',
  PNG = 'png',
  PDF = 'pdf',
}

/** Supported export resolutions. */
export enum ExportResolution {
  HD_720 = '720p',
  FHD_1080 = '1080p',
  QHD_1440 = '1440p',
  UHD_4K = '4k',
}

// ──────────────────────────────────────────────
// Auth & Roles
// ──────────────────────────────────────────────

/** How the user authenticated. */
export enum AuthMode {
  Email = 'email',
  Google = 'google',
  GitHub = 'github',
  SAML = 'saml',
}

/** Role within a workspace. */
export enum MemberRole {
  Owner = 'owner',
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

// ──────────────────────────────────────────────
// Limits & Defaults
// ──────────────────────────────────────────────

/** Hard limits enforced across the application. */
export const MAX_RECORDING_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB
export const MAX_GUIDE_STEPS = 200;
export const MAX_WALKTHROUGH_STEPS = 100;
export const MAX_COURSE_MODULES = 50;
export const MAX_QUIZ_QUESTIONS = 50;
export const MAX_ANNOTATIONS = 500;
export const MAX_TRIM_SEGMENTS = 100;
export const MAX_ZOOM_KEYFRAMES = 500;
export const MAX_WORKSPACE_NAME_LENGTH = 64;
export const MAX_PROJECT_TITLE_LENGTH = 256;

/** Default values used when creating new resources. */
export const DEFAULT_EXPORT_FORMAT = ExportFormat.MP4;
export const DEFAULT_EXPORT_RESOLUTION = ExportResolution.FHD_1080;
export const DEFAULT_TOOLTIP_POSITION = TooltipPosition.Bottom;
export const DEFAULT_ZOOM_LEVEL = 1.5;
export const DEFAULT_ZOOM_DURATION_MS = 600;
export const DEFAULT_CURSOR_SIZE = 20;
export const DEFAULT_CLICK_EFFECT_RADIUS = 30;
export const DEFAULT_CLICK_EFFECT_DURATION_MS = 400;
export const DEFAULT_SPRING_STIFFNESS = 170;
export const DEFAULT_SPRING_DAMPING = 26;
export const DEFAULT_SPRING_MASS = 1;
export const DEFAULT_CATMULL_ROM_ALPHA = 0.5;
export const DEFAULT_EMA_SMOOTHING_FACTOR = 0.3;

/** Timing constants. */
export const RECORDING_HEARTBEAT_INTERVAL_MS = 5_000;
export const CURSOR_SAMPLE_RATE_MS = 16; // ~60 fps
export const MIN_CLICK_INTERVAL_MS = 100;
