import type {
  RecordingStatus,
  ProjectType,
  ProjectStatus,
  StepType,
  TooltipPosition,
  QuestionType,
  ExportFormat,
  ExportResolution,
  AuthMode,
  MemberRole,
} from './constants';

// ──────────────────────────────────────────────
// Utility base types
// ──────────────────────────────────────────────

/** Fields present on every persisted entity. */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Auth & Workspace
// ──────────────────────────────────────────────

/** An authenticated user account. */
export interface User extends BaseEntity {
  /** Primary email address. */
  email: string;
  /** Display name chosen by the user. */
  name: string;
  /** URL to the user's avatar image. */
  avatarUrl: string | null;
  /** How the user originally signed up. */
  authMode: AuthMode;
  /** ISO-8601 timestamp of last sign-in. */
  lastLoginAt: string | null;
  /** Whether the email has been verified. */
  emailVerified: boolean;
}

/** A workspace is the top-level organizational unit (team / company). */
export interface Workspace extends BaseEntity {
  /** Human-readable workspace name. */
  name: string;
  /** URL-safe slug used in routes. */
  slug: string;
  /** ID of the subscription plan. */
  planId: string;
  /** Stripe customer ID for billing. */
  stripeCustomerId: string | null;
  /** Stripe subscription ID. */
  stripeSubscriptionId: string | null;
  /** Optional custom domain for the knowledge base. */
  customDomain: string | null;
  /** Optional subdomain for the knowledge base (team+ plans). */
  kbSubdomain: string | null;
  /** Brand kit: primary colour hex. */
  brandPrimaryColor: string | null;
  /** Brand kit: logo URL. */
  brandLogoUrl: string | null;
  /** Brand kit: custom font family name. */
  brandFontFamily: string | null;
}

/** Junction between User and Workspace. */
export interface WorkspaceMember extends BaseEntity {
  workspaceId: string;
  userId: string;
  /** Role within this workspace. */
  role: MemberRole;
  /** ISO-8601 timestamp when the invitation was accepted. */
  joinedAt: string;
}

// ──────────────────────────────────────────────
// Recording (raw captured data)
// ──────────────────────────────────────────────

/** A raw screen recording captured by the browser extension. */
export interface Recording extends BaseEntity {
  /** Workspace that owns this recording. */
  workspaceId: string;
  /** User who initiated the recording. */
  userId: string;
  /** User-editable title (defaults to page title at time of capture). */
  title: string;
  /** Current lifecycle status. */
  status: RecordingStatus;
  /** Duration of the recording in milliseconds. */
  durationMs: number;
  /** Original width of the captured area in pixels. */
  width: number;
  /** Original height of the captured area in pixels. */
  height: number;
  /** URL of the raw video file in object storage. */
  rawVideoUrl: string | null;
  /** URL of the processed / transcoded video. */
  processedVideoUrl: string | null;
  /** URL of the webcam overlay video, if captured. */
  webcamVideoUrl: string | null;
  /** URL of the recorded audio track, if captured separately. */
  audioUrl: string | null;
  /** URL of the generated thumbnail image. */
  thumbnailUrl: string | null;
  /** URL of the animated preview (e.g. short GIF). */
  previewGifUrl: string | null;
  /** URL of the tab / page that was being recorded. */
  sourceUrl: string | null;
  /** Browser tab title at time of recording. */
  sourceTitle: string | null;
  /** File size of the raw video in bytes. */
  fileSizeBytes: number | null;
  /** MIME type of the raw video. */
  mimeType: string | null;
  /** Frame rate of the capture. */
  fps: number;
  /** Whether a webcam overlay was captured. */
  hasWebcam: boolean;
  /** Whether audio was captured. */
  hasAudio: boolean;
  /** Serialised cursor position data (JSON array of CursorPosition). */
  cursorData: string | null;
  /** Serialised click events (JSON array of ClickEvent). */
  clickData: string | null;
  /** Serialised input events (JSON array of InputEvent). */
  inputData: string | null;
  /** Serialised scroll events (JSON array of ScrollEvent). */
  scrollData: string | null;
  /** Serialised keyboard events (JSON array of KeyboardShortcutEvent). */
  keyboardData: string | null;
  /** Serialised DOM snapshots for walkthrough generation. */
  domSnapshotsData: string | null;
}

// ──────────────────────────────────────────────
// Recording event data types
// ──────────────────────────────────────────────

/** A sampled cursor position at a point in time. */
export interface CursorPosition {
  /** Milliseconds from recording start. */
  t: number;
  /** X coordinate in recording viewport pixels. */
  x: number;
  /** Y coordinate in recording viewport pixels. */
  y: number;
}

/** A user click captured during recording. */
export interface ClickEvent {
  /** Milliseconds from recording start. */
  t: number;
  /** X coordinate of the click. */
  x: number;
  /** Y coordinate of the click. */
  y: number;
  /** CSS selector of the clicked element. */
  selector: string;
  /** Tag name of the clicked element (e.g. "BUTTON"). */
  tagName: string;
  /** innerText of the clicked element (truncated). */
  innerText: string;
  /** URL of the page at the time of click. */
  pageUrl: string;
  /** Title of the page at the time of click. */
  pageTitle: string;
  /** Screenshot data-URL taken around the click area. */
  screenshotDataUrl: string | null;
}

/** A text input event captured during recording. */
export interface InputEvent {
  /** Milliseconds from recording start. */
  t: number;
  /** CSS selector of the input element. */
  selector: string;
  /** The value entered by the user. */
  value: string;
  /** Placeholder text of the input, if any. */
  placeholder: string | null;
  /** The label associated with the input, if any. */
  label: string | null;
  /** Input type attribute (e.g. "text", "email"). */
  inputType: string;
}

/** A scroll event captured during recording. */
export interface ScrollEvent {
  /** Milliseconds from recording start. */
  t: number;
  /** Horizontal scroll offset in pixels. */
  scrollX: number;
  /** Vertical scroll offset in pixels. */
  scrollY: number;
}

/** A keyboard shortcut captured during recording. */
export interface KeyboardShortcutEvent {
  /** Milliseconds from recording start. */
  t: number;
  /** Key combination string, e.g. "Ctrl+C". */
  combo: string;
}

/** A DOM snapshot used for walkthrough generation. */
export interface DomSnapshot {
  /** Milliseconds from recording start. */
  t: number;
  /** CSS selector of the element that was interacted with. */
  selector: string;
  /** Outer HTML of the target element (truncated). */
  outerHtml: string;
  /** Bounding rect of the element. */
  rect: { x: number; y: number; width: number; height: number };
  /** URL of the page at the time of snapshot. */
  pageUrl: string;
  /** Screenshot data-URL of the area around the element. */
  screenshotDataUrl: string | null;
}

// ──────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────

/** A project wraps one or more recordings with editing / presentation data. */
export interface Project extends BaseEntity {
  workspaceId: string;
  /** The recording this project is derived from. */
  recordingId: string;
  /** User who created the project. */
  userId: string;
  /** User-editable title. */
  title: string;
  /** Optional description / summary. */
  description: string | null;
  /** Project variant. */
  type: ProjectType;
  /** Publication status. */
  status: ProjectStatus;
  /** URL of the project thumbnail. */
  thumbnailUrl: string | null;
  /** Serialised type-specific data (VideoProjectData | GuideStep[] | WalkthroughStep[]). */
  data: string | null;
}

// ──────────────────────────────────────────────
// Video project data
// ──────────────────────────────────────────────

/** All editable data for a video-type project. */
export interface VideoProjectData {
  /** Ordered zoom keyframes applied during playback. */
  zoomKeyframes: ZoomKeyframe[];
  /** Visual annotations overlaid on the video. */
  annotations: Annotation[];
  /** Segments of the video to trim out. */
  trimSegments: TrimSegment[];
  /** Editor settings snapshot. */
  editorSettings: EditorSettings;
}

/** A single keyframe in the zoom timeline. */
export interface ZoomKeyframe {
  /** Unique identifier for the keyframe. */
  id: string;
  /** Start time in milliseconds from video start. */
  startMs: number;
  /** End time in milliseconds from video start. */
  endMs: number;
  /** Zoom level multiplier (1 = no zoom, 2 = 200%). */
  scale: number;
  /** X coordinate of the zoom focus point (0-1 normalised). */
  focusX: number;
  /** Y coordinate of the zoom focus point (0-1 normalised). */
  focusY: number;
  /** Easing function name for the zoom-in transition. */
  easingIn: string;
  /** Easing function name for the zoom-out transition. */
  easingOut: string;
  /** Duration of the zoom-in transition in ms. */
  transitionInMs: number;
  /** Duration of the zoom-out transition in ms. */
  transitionOutMs: number;
}

/** A visual annotation placed on the video canvas. */
export interface Annotation {
  /** Unique identifier. */
  id: string;
  /** Annotation variant (e.g. "arrow", "rectangle", "text", "blur", "spotlight"). */
  type: 'arrow' | 'rectangle' | 'circle' | 'text' | 'blur' | 'spotlight' | 'callout';
  /** Start time in ms when annotation becomes visible. */
  startMs: number;
  /** End time in ms when annotation disappears. */
  endMs: number;
  /** X position (0-1 normalised). */
  x: number;
  /** Y position (0-1 normalised). */
  y: number;
  /** Width (0-1 normalised). */
  width: number;
  /** Height (0-1 normalised). */
  height: number;
  /** Rotation in degrees. */
  rotation: number;
  /** Fill colour hex. */
  color: string;
  /** Stroke colour hex. */
  strokeColor: string;
  /** Stroke width in pixels. */
  strokeWidth: number;
  /** Opacity (0-1). */
  opacity: number;
  /** Text content for text / callout annotations. */
  text: string | null;
  /** Font size in pixels for text annotations. */
  fontSize: number | null;
}

/** A segment of the video that should be trimmed / cut. */
export interface TrimSegment {
  /** Unique identifier. */
  id: string;
  /** Start time of the trim in ms. */
  startMs: number;
  /** End time of the trim in ms. */
  endMs: number;
}

// ──────────────────────────────────────────────
// Guide project data
// ──────────────────────────────────────────────

/** A single step in a screenshot guide. */
export interface GuideStep {
  /** Unique identifier. */
  id: string;
  /** Zero-based order index. */
  order: number;
  /** Type of user action this step represents. */
  type: StepType;
  /** Auto-generated or user-edited title (e.g. "Click the Save button"). */
  title: string;
  /** Longer description / instruction. */
  description: string;
  /** URL of the screenshot image for this step. */
  screenshotUrl: string | null;
  /** CSS selector of the highlighted element. */
  selector: string | null;
  /** Optional annotation overlays on the screenshot. */
  annotations: Annotation[];
  /** URL of the page when this step was captured. */
  pageUrl: string | null;
}

// ──────────────────────────────────────────────
// Walkthrough project data
// ──────────────────────────────────────────────

/** A single step in an interactive walkthrough. */
export interface WalkthroughStep {
  /** Unique identifier. */
  id: string;
  /** Zero-based order index. */
  order: number;
  /** Type of user action expected. */
  type: StepType;
  /** Tooltip / popover title. */
  title: string;
  /** Tooltip body content (supports Markdown). */
  content: string;
  /** CSS selector of the element to highlight. */
  selector: string;
  /** Where the tooltip is positioned relative to the target element. */
  tooltipPosition: TooltipPosition;
  /** Whether the user must perform the action to advance. */
  required: boolean;
  /** URL pattern the step should activate on. */
  urlPattern: string | null;
  /** Optional action attribute value for validation. */
  expectedAction: string | null;
}

// ──────────────────────────────────────────────
// Knowledge Base
// ──────────────────────────────────────────────

/** A knowledge base site published under a subdomain or custom domain. */
export interface KnowledgeBaseSite extends BaseEntity {
  workspaceId: string;
  /** Display title of the knowledge base. */
  title: string;
  /** URL slug for the site. */
  slug: string;
  /** Optional custom domain (e.g. "help.acme.com"). */
  customDomain: string | null;
  /** Site-level meta description. */
  description: string | null;
  /** URL of the site logo. */
  logoUrl: string | null;
  /** URL of the site favicon. */
  faviconUrl: string | null;
  /** Primary colour hex for the published site theme. */
  primaryColor: string;
  /** Whether the site is publicly accessible. */
  isPublished: boolean;
}

/** A category / section within a knowledge base. */
export interface KBCategory extends BaseEntity {
  siteId: string;
  /** Category title. */
  title: string;
  /** URL slug for the category. */
  slug: string;
  /** Optional description. */
  description: string | null;
  /** Display order. */
  order: number;
  /** Optional icon identifier. */
  icon: string | null;
}

/** A single page / article within a knowledge base category. */
export interface KBPage extends BaseEntity {
  categoryId: string;
  /** The project (video / guide) embedded in this page, if any. */
  projectId: string | null;
  /** Page title. */
  title: string;
  /** URL slug. */
  slug: string;
  /** Rich-text / Markdown body content. */
  body: string;
  /** Display order within the category. */
  order: number;
  /** Whether the page is published. */
  isPublished: boolean;
  /** SEO meta description. */
  metaDescription: string | null;
}

// ──────────────────────────────────────────────
// Academy / Courses
// ──────────────────────────────────────────────

/** A course published in the ScreenFlow Academy. */
export interface Course extends BaseEntity {
  workspaceId: string;
  /** Course title. */
  title: string;
  /** URL slug. */
  slug: string;
  /** Course description (Markdown). */
  description: string;
  /** URL of the course cover image. */
  coverImageUrl: string | null;
  /** Whether the course is publicly listed. */
  isPublished: boolean;
  /** Estimated duration in minutes. */
  estimatedDurationMin: number | null;
  /** Difficulty level. */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/** A module (section) within a course. */
export interface CourseModule extends BaseEntity {
  courseId: string;
  /** Module title. */
  title: string;
  /** Display order within the course. */
  order: number;
}

/** A lesson within a module. */
export interface CourseLesson extends BaseEntity {
  moduleId: string;
  /** Lesson title. */
  title: string;
  /** Display order within the module. */
  order: number;
  /** Lesson body content (Markdown). */
  body: string;
  /** Linked project to embed (video / guide). */
  projectId: string | null;
  /** Estimated duration in minutes. */
  estimatedDurationMin: number | null;
}

/** A quiz attached to a lesson or module. */
export interface Quiz extends BaseEntity {
  /** The lesson this quiz belongs to. */
  lessonId: string;
  /** Quiz title. */
  title: string;
  /** Minimum passing score as a percentage (0-100). */
  passingScore: number;
}

/** A single question within a quiz. */
export interface QuizQuestion extends BaseEntity {
  quizId: string;
  /** Display order within the quiz. */
  order: number;
  /** Question type. */
  type: QuestionType;
  /** The question prompt. */
  prompt: string;
  /** Ordered list of answer options (for multiple choice). */
  options: string[];
  /** Index of the correct option, or expected text for free text. */
  correctAnswer: string;
  /** Optional explanation shown after answering. */
  explanation: string | null;
}

/** A user's enrollment in a course. */
export interface Enrollment extends BaseEntity {
  courseId: string;
  userId: string;
  /** Overall completion percentage (0-100). */
  completionPercent: number;
  /** ISO-8601 timestamp of enrollment. */
  enrolledAt: string;
  /** ISO-8601 timestamp of completion, if completed. */
  completedAt: string | null;
}

/** Per-lesson progress for an enrollment. */
export interface EnrollmentProgress extends BaseEntity {
  enrollmentId: string;
  lessonId: string;
  /** Whether the lesson has been completed. */
  completed: boolean;
  /** ISO-8601 timestamp of completion. */
  completedAt: string | null;
  /** Quiz score if a quiz was taken (0-100). */
  quizScore: number | null;
}

// ──────────────────────────────────────────────
// Sharing & Analytics
// ──────────────────────────────────────────────

/** A public or restricted sharing link for a project. */
export interface SharedLink extends BaseEntity {
  projectId: string;
  /** Unique share token used in the URL. */
  token: string;
  /** Whether the link is currently active. */
  isActive: boolean;
  /** Whether a password is required to view. */
  passwordProtected: boolean;
  /** Hashed password, if set. */
  passwordHash: string | null;
  /** Whether viewers must provide their email to watch. */
  requireEmail: boolean;
  /** Optional expiration date (ISO-8601). */
  expiresAt: string | null;
  /** Number of times the link has been viewed. */
  viewCount: number;
  /** Whether downloads are allowed. */
  allowDownload: boolean;
  /** Whether the video should auto-play on load. */
  autoPlay: boolean;
}

/** A single analytics event tracked for a shared project. */
export interface AnalyticsEvent extends BaseEntity {
  sharedLinkId: string;
  /** Event type (e.g. "view", "play", "pause", "complete", "cta_click"). */
  eventType: string;
  /** Viewer email if it was collected. */
  viewerEmail: string | null;
  /** Viewer IP address (anonymised). */
  viewerIp: string | null;
  /** User agent string. */
  userAgent: string | null;
  /** Referrer URL. */
  referrer: string | null;
  /** Country code derived from IP. */
  country: string | null;
  /** Playback position in ms when the event occurred. */
  positionMs: number | null;
  /** Watch duration in ms (for "complete" events). */
  watchDurationMs: number | null;
  /** Arbitrary metadata JSON. */
  metadata: Record<string, unknown> | null;
}

// ──────────────────────────────────────────────
// Widget & Tooltips (in-app embed)
// ──────────────────────────────────────────────

/** Configuration for the embeddable ScreenFlow widget. */
export interface WidgetConfig extends BaseEntity {
  workspaceId: string;
  /** Whether the widget is enabled. */
  enabled: boolean;
  /** Where the launcher button appears on the page. */
  position: 'bottom-right' | 'bottom-left';
  /** Primary colour hex for the widget. */
  primaryColor: string;
  /** Welcome message shown when the widget opens. */
  welcomeMessage: string;
  /** IDs of walkthroughs available in the widget. */
  walkthroughIds: string[];
  /** IDs of guide projects shown in the widget. */
  guideIds: string[];
  /** Allowed origin domains where the widget may be embedded. */
  allowedDomains: string[];
}

/** A tooltip pinned to a specific element on a customer's page. */
export interface PinnedTooltip extends BaseEntity {
  widgetConfigId: string;
  /** CSS selector of the element to attach the tooltip to. */
  selector: string;
  /** Tooltip title. */
  title: string;
  /** Tooltip body (Markdown). */
  content: string;
  /** Position relative to the target element. */
  position: TooltipPosition;
  /** URL pattern where the tooltip should appear. */
  urlPattern: string;
  /** Whether the tooltip is active. */
  isActive: boolean;
}

// ──────────────────────────────────────────────
// Editor Settings
// ──────────────────────────────────────────────

/** Top-level editor settings stored per video project. */
export interface EditorSettings {
  cursor: CursorConfig;
  zoom: ZoomConfig;
  clickEffects: ClickEffectsConfig;
  audio: AudioConfig;
  background: BackgroundConfig;
  deviceFrame: DeviceFrameConfig;
}

/** Cursor appearance configuration. */
export interface CursorConfig {
  /** Whether the cursor is visible. */
  visible: boolean;
  /** Cursor size in pixels. */
  size: number;
  /** Whether to apply smoothing to cursor movement. */
  smoothing: boolean;
  /** Smoothing intensity (0-1). Higher = smoother, more latency. */
  smoothingFactor: number;
  /** Whether to highlight the cursor on click. */
  highlightClicks: boolean;
  /** Custom cursor image URL, if any. */
  customCursorUrl: string | null;
}

/** Auto-zoom configuration. */
export interface ZoomConfig {
  /** Whether auto-zoom is enabled. */
  enabled: boolean;
  /** Default zoom scale for auto-generated keyframes. */
  defaultScale: number;
  /** Default zoom-in duration in ms. */
  defaultTransitionInMs: number;
  /** Default zoom-out duration in ms. */
  defaultTransitionOutMs: number;
  /** Default hold duration in ms. */
  defaultHoldMs: number;
  /** Spring stiffness for zoom easing. */
  springStiffness: number;
  /** Spring damping for zoom easing. */
  springDamping: number;
  /** Spring mass for zoom easing. */
  springMass: number;
}

/** Click visual effects configuration. */
export interface ClickEffectsConfig {
  /** Whether click effects are shown. */
  enabled: boolean;
  /** Effect style. */
  style: 'ripple' | 'pulse' | 'ring' | 'glow';
  /** Effect colour hex. */
  color: string;
  /** Effect radius in pixels. */
  radius: number;
  /** Effect duration in ms. */
  durationMs: number;
}

/** Audio track configuration. */
export interface AudioConfig {
  /** Whether the recorded audio track is included. */
  includeRecordedAudio: boolean;
  /** Volume of the recorded audio (0-1). */
  recordedAudioVolume: number;
  /** URL of background music track, if any. */
  backgroundMusicUrl: string | null;
  /** Volume of background music (0-1). */
  backgroundMusicVolume: number;
  /** Whether to enable click sound effects. */
  clickSoundEnabled: boolean;
  /** Volume of click sounds (0-1). */
  clickSoundVolume: number;
}

/** Background / padding configuration behind the recording. */
export interface BackgroundConfig {
  /** Background type. */
  type: 'color' | 'gradient' | 'image' | 'transparent';
  /** Solid colour hex (for "color" type). */
  color: string;
  /** CSS gradient string (for "gradient" type). */
  gradient: string | null;
  /** Image URL (for "image" type). */
  imageUrl: string | null;
  /** Padding around the recording in pixels. */
  padding: number;
  /** Border radius on the recording viewport in pixels. */
  borderRadius: number;
  /** Whether to add a subtle shadow to the recording viewport. */
  shadow: boolean;
}

/** Device frame overlay configuration. */
export interface DeviceFrameConfig {
  /** Whether a device frame is shown around the recording. */
  enabled: boolean;
  /** Device type. */
  device: 'browser' | 'desktop' | 'phone' | 'tablet' | 'none';
  /** Theme of the device frame. */
  theme: 'light' | 'dark';
  /** Whether to show the browser address bar (for "browser" device). */
  showAddressBar: boolean;
}
