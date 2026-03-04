import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const planEnum = pgEnum("plan", [
  "free",
  "pro",
  "team",
  "business",
  "enterprise",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "admin",
  "editor",
  "viewer",
]);

export const recordingStatusEnum = pgEnum("recording_status", [
  "uploading",
  "processing",
  "ready",
  "failed",
]);

export const projectTypeEnum = pgEnum("project_type", [
  "video",
  "guide",
  "walkthrough",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "review",
  "published",
  "archived",
]);

export const stepTypeEnum = pgEnum("step_type", [
  "action",
  "tip",
  "warning",
  "divider",
]);

export const tooltipPositionEnum = pgEnum("tooltip_position", [
  "top",
  "bottom",
  "left",
  "right",
  "auto",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "multiple_choice_single",
  "multiple_choice_multi",
  "true_false",
  "short_text",
  "matching",
]);

export const authModeEnum = pgEnum("auth_mode", [
  "public",
  "password",
  "email",
  "sso",
  "saml",
]);

export const widgetPositionEnum = pgEnum("widget_position", [
  "bottom_right",
  "bottom_left",
  "custom",
]);

export const exportStatusEnum = pgEnum("export_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "certified",
  "dropped",
]);

export const lessonProgressEnum = pgEnum("lesson_progress", [
  "not_started",
  "in_progress",
  "completed",
]);

export const lessonTypeEnum = pgEnum("lesson_type", [
  "video",
  "guide",
  "article",
  "quiz",
  "external_link",
]);

export const dripTypeEnum = pgEnum("drip_type", [
  "immediate",
  "sequential",
  "scheduled",
]);

export const contentTypeEnum = pgEnum("content_type", [
  "video",
  "guide",
  "article",
  "mixed",
]);

export const zoomSourceEnum = pgEnum("zoom_source", ["auto", "manual"]);

export const annotationTypeEnum = pgEnum("annotation_type", [
  "text",
  "blur",
  "spotlight",
  "arrow",
  "shape",
  "keystroke",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "view",
  "play",
  "pause",
  "seek",
  "complete",
  "guide_step_view",
  "walkthrough_step_view",
  "walkthrough_step_complete",
  "walkthrough_abandon",
  "quiz_submit",
  "search",
  "page_view",
]);

// ---------------------------------------------------------------------------
// Helper: common timestamp columns
// ---------------------------------------------------------------------------

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// ---------------------------------------------------------------------------
// 1. users
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    supabaseAuthId: text("supabase_auth_id").notNull(),
    onboardingCompleted: boolean("onboarding_completed")
      .notNull()
      .default(false),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    uniqueIndex("users_supabase_auth_id_idx").on(t.supabaseAuthId),
  ],
);

// ---------------------------------------------------------------------------
// 2. workspaces
// ---------------------------------------------------------------------------

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    logoUrl: text("logo_url"),
    plan: planEnum("plan").notNull().default("free"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("workspaces_slug_idx").on(t.slug),
    index("workspaces_owner_id_idx").on(t.ownerId),
  ],
);

// ---------------------------------------------------------------------------
// 3. workspaceMembers (composite PK)
// ---------------------------------------------------------------------------

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("viewer"),
    ...timestamps,
  },
  (t) => [
    primaryKey({ columns: [t.workspaceId, t.userId] }),
    index("workspace_members_user_id_idx").on(t.userId),
  ],
);

// ---------------------------------------------------------------------------
// 4. recordings
// ---------------------------------------------------------------------------

export const recordings = pgTable(
  "recordings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: recordingStatusEnum("status").notNull().default("uploading"),
    originalUrl: text("original_url"),
    processedUrl: text("processed_url"),
    thumbnailUrl: text("thumbnail_url"),
    durationMs: integer("duration_ms"),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    mimeType: text("mime_type"),
    metadata: jsonb("metadata"),
    ...timestamps,
  },
  (t) => [
    index("recordings_workspace_id_idx").on(t.workspaceId),
    index("recordings_created_by_id_idx").on(t.createdById),
    index("recordings_status_idx").on(t.status),
  ],
);

// ---------------------------------------------------------------------------
// 5. projects
// ---------------------------------------------------------------------------

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    type: projectTypeEnum("type").notNull(),
    status: projectStatusEnum("status").notNull().default("draft"),
    recordingId: uuid("recording_id").references(() => recordings.id, {
      onDelete: "set null",
    }),
    thumbnailUrl: text("thumbnail_url"),
    settings: jsonb("settings"),
    ...timestamps,
  },
  (t) => [
    index("projects_workspace_id_idx").on(t.workspaceId),
    index("projects_created_by_id_idx").on(t.createdById),
    index("projects_type_idx").on(t.type),
    index("projects_status_idx").on(t.status),
    index("projects_recording_id_idx").on(t.recordingId),
  ],
);

// ---------------------------------------------------------------------------
// 6. videoProjectData
// ---------------------------------------------------------------------------

export const videoProjectData = pgTable(
  "video_project_data",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    exportStatus: exportStatusEnum("export_status")
      .notNull()
      .default("pending"),
    exportUrl: text("export_url"),
    exportFormat: text("export_format").default("mp4"),
    exportResolution: text("export_resolution").default("1080p"),
    captions: jsonb("captions"),
    chapters: jsonb("chapters"),
    backgroundMusic: jsonb("background_music"),
    intro: jsonb("intro"),
    outro: jsonb("outro"),
    watermark: jsonb("watermark"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("video_project_data_project_id_idx").on(t.projectId),
    index("video_project_data_export_status_idx").on(t.exportStatus),
  ],
);

// ---------------------------------------------------------------------------
// 7. zoomKeyframes
// ---------------------------------------------------------------------------

export const zoomKeyframes = pgTable(
  "zoom_keyframes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoProjectDataId: uuid("video_project_data_id")
      .notNull()
      .references(() => videoProjectData.id, { onDelete: "cascade" }),
    timeMs: integer("time_ms").notNull(),
    scale: real("scale").notNull().default(1),
    x: real("x").notNull().default(0),
    y: real("y").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(300),
    easing: text("easing").default("easeInOut"),
    source: zoomSourceEnum("source").notNull().default("auto"),
    ...timestamps,
  },
  (t) => [
    index("zoom_keyframes_video_project_data_id_idx").on(t.videoProjectDataId),
    index("zoom_keyframes_time_ms_idx").on(t.timeMs),
  ],
);

// ---------------------------------------------------------------------------
// 8. annotations
// ---------------------------------------------------------------------------

export const annotations = pgTable(
  "annotations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoProjectDataId: uuid("video_project_data_id")
      .notNull()
      .references(() => videoProjectData.id, { onDelete: "cascade" }),
    type: annotationTypeEnum("type").notNull(),
    startTimeMs: integer("start_time_ms").notNull(),
    endTimeMs: integer("end_time_ms").notNull(),
    x: real("x").notNull(),
    y: real("y").notNull(),
    width: real("width"),
    height: real("height"),
    rotation: real("rotation").default(0),
    content: text("content"),
    style: jsonb("style"),
    ...timestamps,
  },
  (t) => [
    index("annotations_video_project_data_id_idx").on(t.videoProjectDataId),
    index("annotations_type_idx").on(t.type),
    index("annotations_start_time_ms_idx").on(t.startTimeMs),
  ],
);

// ---------------------------------------------------------------------------
// 9. trimSegments
// ---------------------------------------------------------------------------

export const trimSegments = pgTable(
  "trim_segments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoProjectDataId: uuid("video_project_data_id")
      .notNull()
      .references(() => videoProjectData.id, { onDelete: "cascade" }),
    startTimeMs: integer("start_time_ms").notNull(),
    endTimeMs: integer("end_time_ms").notNull(),
    isMuted: boolean("is_muted").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    index("trim_segments_video_project_data_id_idx").on(t.videoProjectDataId),
  ],
);

// ---------------------------------------------------------------------------
// 10. guideSteps
// ---------------------------------------------------------------------------

export const guideSteps = pgTable(
  "guide_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    type: stepTypeEnum("type").notNull().default("action"),
    title: text("title"),
    description: text("description"),
    screenshotUrl: text("screenshot_url"),
    screenshotRegion: jsonb("screenshot_region"),
    tooltipPosition: tooltipPositionEnum("tooltip_position").default("auto"),
    annotation: jsonb("annotation"),
    ...timestamps,
  },
  (t) => [
    index("guide_steps_project_id_idx").on(t.projectId),
    index("guide_steps_step_number_idx").on(t.stepNumber),
  ],
);

// ---------------------------------------------------------------------------
// 11. walkthroughSteps
// ---------------------------------------------------------------------------

export const walkthroughSteps = pgTable(
  "walkthrough_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    type: stepTypeEnum("type").notNull().default("action"),
    title: text("title"),
    description: text("description"),
    targetSelector: text("target_selector"),
    targetUrl: text("target_url"),
    tooltipPosition: tooltipPositionEnum("tooltip_position").default("auto"),
    advanceOn: text("advance_on").default("click"),
    requiredInteraction: boolean("required_interaction")
      .notNull()
      .default(true),
    highlightPadding: integer("highlight_padding").default(8),
    ...timestamps,
  },
  (t) => [
    index("walkthrough_steps_project_id_idx").on(t.projectId),
    index("walkthrough_steps_step_number_idx").on(t.stepNumber),
  ],
);

// ---------------------------------------------------------------------------
// 12. knowledgeBaseSites
// ---------------------------------------------------------------------------

export const knowledgeBaseSites = pgTable(
  "knowledge_base_sites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    customDomain: text("custom_domain"),
    logoUrl: text("logo_url"),
    faviconUrl: text("favicon_url"),
    primaryColor: text("primary_color").default("#6366f1"),
    headerHtml: text("header_html"),
    footerHtml: text("footer_html"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    isPublished: boolean("is_published").notNull().default(false),
    authMode: authModeEnum("auth_mode").notNull().default("public"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("kb_sites_slug_idx").on(t.slug),
    index("kb_sites_workspace_id_idx").on(t.workspaceId),
    uniqueIndex("kb_sites_custom_domain_idx").on(t.customDomain),
  ],
);

// ---------------------------------------------------------------------------
// 13. kbCategories
// ---------------------------------------------------------------------------

export const kbCategories = pgTable(
  "kb_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => knowledgeBaseSites.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    icon: text("icon"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("kb_categories_site_id_idx").on(t.siteId),
    index("kb_categories_parent_id_idx").on(t.parentId),
    uniqueIndex("kb_categories_site_slug_idx").on(t.siteId, t.slug),
  ],
);

// ---------------------------------------------------------------------------
// 14. kbPages
// ---------------------------------------------------------------------------

export const kbPages = pgTable(
  "kb_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => knowledgeBaseSites.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => kbCategories.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    contentType: contentTypeEnum("content_type").notNull().default("article"),
    body: text("body"),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(false),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ...timestamps,
  },
  (t) => [
    index("kb_pages_site_id_idx").on(t.siteId),
    index("kb_pages_category_id_idx").on(t.categoryId),
    uniqueIndex("kb_pages_site_slug_idx").on(t.siteId, t.slug),
    index("kb_pages_project_id_idx").on(t.projectId),
  ],
);

// ---------------------------------------------------------------------------
// 15. courses
// ---------------------------------------------------------------------------

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    isPublished: boolean("is_published").notNull().default(false),
    authMode: authModeEnum("auth_mode").notNull().default("public"),
    password: text("password"),
    certificateEnabled: boolean("certificate_enabled")
      .notNull()
      .default(false),
    certificateTemplate: jsonb("certificate_template"),
    dripType: dripTypeEnum("drip_type").notNull().default("immediate"),
    estimatedMinutes: integer("estimated_minutes"),
    ...timestamps,
  },
  (t) => [
    index("courses_workspace_id_idx").on(t.workspaceId),
    index("courses_created_by_id_idx").on(t.createdById),
    uniqueIndex("courses_slug_idx").on(t.slug),
  ],
);

// ---------------------------------------------------------------------------
// 16. courseModules
// ---------------------------------------------------------------------------

export const courseModules = pgTable(
  "course_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    dripDelayDays: integer("drip_delay_days"),
    dripDate: timestamp("drip_date", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("course_modules_course_id_idx").on(t.courseId),
    index("course_modules_sort_order_idx").on(t.sortOrder),
  ],
);

// ---------------------------------------------------------------------------
// 17. courseLessons
// ---------------------------------------------------------------------------

export const courseLessons = pgTable(
  "course_lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => courseModules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    lessonType: lessonTypeEnum("lesson_type").notNull(),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    quizId: uuid("quiz_id"),
    externalUrl: text("external_url"),
    articleBody: text("article_body"),
    sortOrder: integer("sort_order").notNull().default(0),
    durationMinutes: integer("duration_minutes"),
    isMandatory: boolean("is_mandatory").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("course_lessons_module_id_idx").on(t.moduleId),
    index("course_lessons_project_id_idx").on(t.projectId),
    index("course_lessons_sort_order_idx").on(t.sortOrder),
  ],
);

// ---------------------------------------------------------------------------
// 18. quizzes
// ---------------------------------------------------------------------------

export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    passingScorePercent: integer("passing_score_percent")
      .notNull()
      .default(70),
    maxAttempts: integer("max_attempts"),
    timeLimitMinutes: integer("time_limit_minutes"),
    shuffleQuestions: boolean("shuffle_questions").notNull().default(false),
    showResults: boolean("show_results").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("quizzes_workspace_id_idx").on(t.workspaceId)],
);

// ---------------------------------------------------------------------------
// 19. quizQuestions
// ---------------------------------------------------------------------------

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    type: questionTypeEnum("type").notNull(),
    questionText: text("question_text").notNull(),
    explanation: text("explanation"),
    options: jsonb("options"),
    correctAnswer: jsonb("correct_answer").notNull(),
    points: integer("points").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("quiz_questions_quiz_id_idx").on(t.quizId),
    index("quiz_questions_sort_order_idx").on(t.sortOrder),
  ],
);

// ---------------------------------------------------------------------------
// 20. enrollments
// ---------------------------------------------------------------------------

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: enrollmentStatusEnum("status").notNull().default("active"),
    progressPercent: real("progress_percent").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    certificateUrl: text("certificate_url"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("enrollments_course_user_idx").on(t.courseId, t.userId),
    index("enrollments_user_id_idx").on(t.userId),
    index("enrollments_status_idx").on(t.status),
  ],
);

// ---------------------------------------------------------------------------
// 21. enrollmentProgress
// ---------------------------------------------------------------------------

export const enrollmentProgress = pgTable(
  "enrollment_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => courseLessons.id, { onDelete: "cascade" }),
    status: lessonProgressEnum("status").notNull().default("not_started"),
    score: real("score"),
    attempts: integer("attempts").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("enrollment_progress_enrollment_lesson_idx").on(
      t.enrollmentId,
      t.lessonId,
    ),
    index("enrollment_progress_lesson_id_idx").on(t.lessonId),
    index("enrollment_progress_status_idx").on(t.status),
  ],
);

// ---------------------------------------------------------------------------
// 22. sharedLinks
// ---------------------------------------------------------------------------

export const sharedLinks = pgTable(
  "shared_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    authMode: authModeEnum("auth_mode").notNull().default("public"),
    password: text("password"),
    allowedEmails: jsonb("allowed_emails"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    viewCount: integer("view_count").notNull().default(0),
    customSlug: text("custom_slug"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("shared_links_token_idx").on(t.token),
    index("shared_links_project_id_idx").on(t.projectId),
    uniqueIndex("shared_links_custom_slug_idx").on(t.customSlug),
  ],
);

// ---------------------------------------------------------------------------
// 23. analyticsEvents
// ---------------------------------------------------------------------------

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    sharedLinkId: uuid("shared_link_id").references(() => sharedLinks.id, {
      onDelete: "set null",
    }),
    eventType: eventTypeEnum("event_type").notNull(),
    sessionId: text("session_id"),
    visitorId: text("visitor_id"),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    url: text("url"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ip: text("ip"),
    country: text("country"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("analytics_events_workspace_id_idx").on(t.workspaceId),
    index("analytics_events_project_id_idx").on(t.projectId),
    index("analytics_events_event_type_idx").on(t.eventType),
    index("analytics_events_session_id_idx").on(t.sessionId),
    index("analytics_events_created_at_idx").on(t.createdAt),
    index("analytics_events_visitor_id_idx").on(t.visitorId),
  ],
);

// ---------------------------------------------------------------------------
// 24. widgetConfigs
// ---------------------------------------------------------------------------

export const widgetConfigs = pgTable(
  "widget_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: widgetPositionEnum("position").notNull().default("bottom_right"),
    triggerSelector: text("trigger_selector"),
    triggerText: text("trigger_text").default("Help"),
    triggerIconUrl: text("trigger_icon_url"),
    primaryColor: text("primary_color").default("#6366f1"),
    allowedOrigins: jsonb("allowed_origins"),
    isActive: boolean("is_active").notNull().default(true),
    customCss: text("custom_css"),
    ...timestamps,
  },
  (t) => [
    index("widget_configs_workspace_id_idx").on(t.workspaceId),
    index("widget_configs_is_active_idx").on(t.isActive),
  ],
);

// ---------------------------------------------------------------------------
// 25. pinnedTooltips
// ---------------------------------------------------------------------------

export const pinnedTooltips = pgTable(
  "pinned_tooltips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    widgetConfigId: uuid("widget_config_id")
      .notNull()
      .references(() => widgetConfigs.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    targetSelector: text("target_selector").notNull(),
    targetUrl: text("target_url").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    position: tooltipPositionEnum("position").notNull().default("auto"),
    isActive: boolean("is_active").notNull().default(true),
    showOnce: boolean("show_once").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("pinned_tooltips_widget_config_id_idx").on(t.widgetConfigId),
    index("pinned_tooltips_target_url_idx").on(t.targetUrl),
    index("pinned_tooltips_is_active_idx").on(t.isActive),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  workspaceMembers: many(workspaceMembers),
  recordings: many(recordings),
  projects: many(projects),
  enrollments: many(enrollments),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  recordings: many(recordings),
  projects: many(projects),
  knowledgeBaseSites: many(knowledgeBaseSites),
  courses: many(courses),
  quizzes: many(quizzes),
  analyticsEvents: many(analyticsEvents),
  widgetConfigs: many(widgetConfigs),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  }),
);

export const recordingsRelations = relations(recordings, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [recordings.workspaceId],
    references: [workspaces.id],
  }),
  createdBy: one(users, {
    fields: [recordings.createdById],
    references: [users.id],
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  createdBy: one(users, {
    fields: [projects.createdById],
    references: [users.id],
  }),
  recording: one(recordings, {
    fields: [projects.recordingId],
    references: [recordings.id],
  }),
  videoProjectData: one(videoProjectData),
  guideSteps: many(guideSteps),
  walkthroughSteps: many(walkthroughSteps),
  sharedLinks: many(sharedLinks),
  kbPages: many(kbPages),
  courseLessons: many(courseLessons),
  analyticsEvents: many(analyticsEvents),
  pinnedTooltips: many(pinnedTooltips),
}));

export const videoProjectDataRelations = relations(
  videoProjectData,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [videoProjectData.projectId],
      references: [projects.id],
    }),
    zoomKeyframes: many(zoomKeyframes),
    annotations: many(annotations),
    trimSegments: many(trimSegments),
  }),
);

export const zoomKeyframesRelations = relations(zoomKeyframes, ({ one }) => ({
  videoProjectData: one(videoProjectData, {
    fields: [zoomKeyframes.videoProjectDataId],
    references: [videoProjectData.id],
  }),
}));

export const annotationsRelations = relations(annotations, ({ one }) => ({
  videoProjectData: one(videoProjectData, {
    fields: [annotations.videoProjectDataId],
    references: [videoProjectData.id],
  }),
}));

export const trimSegmentsRelations = relations(trimSegments, ({ one }) => ({
  videoProjectData: one(videoProjectData, {
    fields: [trimSegments.videoProjectDataId],
    references: [videoProjectData.id],
  }),
}));

export const guideStepsRelations = relations(guideSteps, ({ one }) => ({
  project: one(projects, {
    fields: [guideSteps.projectId],
    references: [projects.id],
  }),
}));

export const walkthroughStepsRelations = relations(
  walkthroughSteps,
  ({ one }) => ({
    project: one(projects, {
      fields: [walkthroughSteps.projectId],
      references: [projects.id],
    }),
  }),
);

export const knowledgeBaseSitesRelations = relations(
  knowledgeBaseSites,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [knowledgeBaseSites.workspaceId],
      references: [workspaces.id],
    }),
    categories: many(kbCategories),
    pages: many(kbPages),
  }),
);

export const kbCategoriesRelations = relations(
  kbCategories,
  ({ one, many }) => ({
    site: one(knowledgeBaseSites, {
      fields: [kbCategories.siteId],
      references: [knowledgeBaseSites.id],
    }),
    parent: one(kbCategories, {
      fields: [kbCategories.parentId],
      references: [kbCategories.id],
    }),
    pages: many(kbPages),
  }),
);

export const kbPagesRelations = relations(kbPages, ({ one }) => ({
  site: one(knowledgeBaseSites, {
    fields: [kbPages.siteId],
    references: [knowledgeBaseSites.id],
  }),
  category: one(kbCategories, {
    fields: [kbPages.categoryId],
    references: [kbCategories.id],
  }),
  project: one(projects, {
    fields: [kbPages.projectId],
    references: [projects.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [courses.workspaceId],
    references: [workspaces.id],
  }),
  createdBy: one(users, {
    fields: [courses.createdById],
    references: [users.id],
  }),
  modules: many(courseModules),
  enrollments: many(enrollments),
}));

export const courseModulesRelations = relations(
  courseModules,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseModules.courseId],
      references: [courses.id],
    }),
    lessons: many(courseLessons),
  }),
);

export const courseLessonsRelations = relations(
  courseLessons,
  ({ one, many }) => ({
    module: one(courseModules, {
      fields: [courseLessons.moduleId],
      references: [courseModules.id],
    }),
    project: one(projects, {
      fields: [courseLessons.projectId],
      references: [projects.id],
    }),
    quiz: one(quizzes, {
      fields: [courseLessons.quizId],
      references: [quizzes.id],
    }),
    progress: many(enrollmentProgress),
  }),
);

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [quizzes.workspaceId],
    references: [workspaces.id],
  }),
  questions: many(quizQuestions),
  lessons: many(courseLessons),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const enrollmentsRelations = relations(
  enrollments,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [enrollments.courseId],
      references: [courses.id],
    }),
    user: one(users, {
      fields: [enrollments.userId],
      references: [users.id],
    }),
    progress: many(enrollmentProgress),
  }),
);

export const enrollmentProgressRelations = relations(
  enrollmentProgress,
  ({ one }) => ({
    enrollment: one(enrollments, {
      fields: [enrollmentProgress.enrollmentId],
      references: [enrollments.id],
    }),
    lesson: one(courseLessons, {
      fields: [enrollmentProgress.lessonId],
      references: [courseLessons.id],
    }),
  }),
);

export const sharedLinksRelations = relations(
  sharedLinks,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [sharedLinks.projectId],
      references: [projects.id],
    }),
    analyticsEvents: many(analyticsEvents),
  }),
);

export const analyticsEventsRelations = relations(
  analyticsEvents,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [analyticsEvents.workspaceId],
      references: [workspaces.id],
    }),
    project: one(projects, {
      fields: [analyticsEvents.projectId],
      references: [projects.id],
    }),
    sharedLink: one(sharedLinks, {
      fields: [analyticsEvents.sharedLinkId],
      references: [sharedLinks.id],
    }),
    user: one(users, {
      fields: [analyticsEvents.userId],
      references: [users.id],
    }),
  }),
);

export const widgetConfigsRelations = relations(
  widgetConfigs,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [widgetConfigs.workspaceId],
      references: [workspaces.id],
    }),
    pinnedTooltips: many(pinnedTooltips),
  }),
);

export const pinnedTooltipsRelations = relations(
  pinnedTooltips,
  ({ one }) => ({
    widgetConfig: one(widgetConfigs, {
      fields: [pinnedTooltips.widgetConfigId],
      references: [widgetConfigs.id],
    }),
    project: one(projects, {
      fields: [pinnedTooltips.projectId],
      references: [projects.id],
    }),
  }),
);
