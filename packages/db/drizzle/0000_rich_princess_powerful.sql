CREATE TYPE "public"."annotation_type" AS ENUM('text', 'blur', 'spotlight', 'arrow', 'shape', 'keystroke');--> statement-breakpoint
CREATE TYPE "public"."auth_mode" AS ENUM('public', 'password', 'email', 'sso', 'saml');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('video', 'guide', 'article', 'mixed');--> statement-breakpoint
CREATE TYPE "public"."drip_type" AS ENUM('immediate', 'sequential', 'scheduled');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('active', 'completed', 'certified', 'dropped');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('view', 'play', 'pause', 'seek', 'complete', 'guide_step_view', 'walkthrough_step_view', 'walkthrough_step_complete', 'walkthrough_abandon', 'quiz_submit', 'search', 'page_view');--> statement-breakpoint
CREATE TYPE "public"."export_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."lesson_progress" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('video', 'guide', 'article', 'quiz', 'external_link');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'pro', 'team', 'business', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'review', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('video', 'guide', 'walkthrough');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple_choice_single', 'multiple_choice_multi', 'true_false', 'short_text', 'matching');--> statement-breakpoint
CREATE TYPE "public"."recording_status" AS ENUM('uploading', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."step_type" AS ENUM('action', 'tip', 'warning', 'divider');--> statement-breakpoint
CREATE TYPE "public"."tooltip_position" AS ENUM('top', 'bottom', 'left', 'right', 'auto');--> statement-breakpoint
CREATE TYPE "public"."widget_position" AS ENUM('bottom_right', 'bottom_left', 'custom');--> statement-breakpoint
CREATE TYPE "public"."zoom_source" AS ENUM('auto', 'manual');--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"project_id" uuid,
	"shared_link_id" uuid,
	"event_type" "event_type" NOT NULL,
	"session_id" text,
	"visitor_id" text,
	"user_id" uuid,
	"url" text,
	"referrer" text,
	"user_agent" text,
	"ip" text,
	"country" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "annotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_project_data_id" uuid NOT NULL,
	"type" "annotation_type" NOT NULL,
	"start_time_ms" integer NOT NULL,
	"end_time_ms" integer NOT NULL,
	"x" real NOT NULL,
	"y" real NOT NULL,
	"width" real,
	"height" real,
	"rotation" real DEFAULT 0,
	"content" text,
	"style" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"lesson_type" "lesson_type" NOT NULL,
	"project_id" uuid,
	"quiz_id" uuid,
	"external_url" text,
	"article_body" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"duration_minutes" integer,
	"is_mandatory" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"drip_delay_days" integer,
	"drip_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"thumbnail_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"auth_mode" "auth_mode" DEFAULT 'public' NOT NULL,
	"password" text,
	"certificate_enabled" boolean DEFAULT false NOT NULL,
	"certificate_template" jsonb,
	"drip_type" "drip_type" DEFAULT 'immediate' NOT NULL,
	"estimated_minutes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollment_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"status" "lesson_progress" DEFAULT 'not_started' NOT NULL,
	"score" real,
	"attempts" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "enrollment_status" DEFAULT 'active' NOT NULL,
	"progress_percent" real DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"certificate_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"step_number" integer NOT NULL,
	"type" "step_type" DEFAULT 'action' NOT NULL,
	"title" text,
	"description" text,
	"screenshot_url" text,
	"screenshot_region" jsonb,
	"tooltip_position" "tooltip_position" DEFAULT 'auto',
	"annotation" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kb_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kb_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"category_id" uuid,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content_type" "content_type" DEFAULT 'article' NOT NULL,
	"body" text,
	"project_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_base_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"custom_domain" text,
	"logo_url" text,
	"favicon_url" text,
	"primary_color" text DEFAULT '#6366f1',
	"header_html" text,
	"footer_html" text,
	"meta_title" text,
	"meta_description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"auth_mode" "auth_mode" DEFAULT 'public' NOT NULL,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pinned_tooltips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"widget_config_id" uuid NOT NULL,
	"project_id" uuid,
	"target_selector" text NOT NULL,
	"target_url" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"position" "tooltip_position" DEFAULT 'auto' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"show_once" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "project_type" NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"recording_id" uuid,
	"thumbnail_url" text,
	"settings" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"type" "question_type" NOT NULL,
	"question_text" text NOT NULL,
	"explanation" text,
	"options" jsonb,
	"correct_answer" jsonb NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"passing_score_percent" integer DEFAULT 70 NOT NULL,
	"max_attempts" integer,
	"time_limit_minutes" integer,
	"shuffle_questions" boolean DEFAULT false NOT NULL,
	"show_results" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "recording_status" DEFAULT 'uploading' NOT NULL,
	"original_url" text,
	"processed_url" text,
	"thumbnail_url" text,
	"duration_ms" integer,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"mime_type" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"token" text NOT NULL,
	"auth_mode" "auth_mode" DEFAULT 'public' NOT NULL,
	"password" text,
	"allowed_emails" jsonb,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"custom_slug" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trim_segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_project_data_id" uuid NOT NULL,
	"start_time_ms" integer NOT NULL,
	"end_time_ms" integer NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"supabase_auth_id" text NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_project_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"export_status" "export_status" DEFAULT 'pending' NOT NULL,
	"export_url" text,
	"export_format" text DEFAULT 'mp4',
	"export_resolution" text DEFAULT '1080p',
	"captions" jsonb,
	"chapters" jsonb,
	"background_music" jsonb,
	"intro" jsonb,
	"outro" jsonb,
	"watermark" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "walkthrough_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"step_number" integer NOT NULL,
	"type" "step_type" DEFAULT 'action' NOT NULL,
	"title" text,
	"description" text,
	"target_selector" text,
	"target_url" text,
	"tooltip_position" "tooltip_position" DEFAULT 'auto',
	"advance_on" text DEFAULT 'click',
	"required_interaction" boolean DEFAULT true NOT NULL,
	"highlight_padding" integer DEFAULT 8,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "widget_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"position" "widget_position" DEFAULT 'bottom_right' NOT NULL,
	"trigger_selector" text,
	"trigger_text" text DEFAULT 'Help',
	"trigger_icon_url" text,
	"primary_color" text DEFAULT '#6366f1',
	"allowed_origins" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"custom_css" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zoom_keyframes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_project_data_id" uuid NOT NULL,
	"time_ms" integer NOT NULL,
	"scale" real DEFAULT 1 NOT NULL,
	"x" real DEFAULT 0 NOT NULL,
	"y" real DEFAULT 0 NOT NULL,
	"duration_ms" integer DEFAULT 300 NOT NULL,
	"easing" text DEFAULT 'easeInOut',
	"source" "zoom_source" DEFAULT 'auto' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_shared_link_id_shared_links_id_fk" FOREIGN KEY ("shared_link_id") REFERENCES "public"."shared_links"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annotations" ADD CONSTRAINT "annotations_video_project_data_id_video_project_data_id_fk" FOREIGN KEY ("video_project_data_id") REFERENCES "public"."video_project_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_progress" ADD CONSTRAINT "enrollment_progress_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_progress" ADD CONSTRAINT "enrollment_progress_lesson_id_course_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."course_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_steps" ADD CONSTRAINT "guide_steps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kb_categories" ADD CONSTRAINT "kb_categories_site_id_knowledge_base_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."knowledge_base_sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kb_pages" ADD CONSTRAINT "kb_pages_site_id_knowledge_base_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."knowledge_base_sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kb_pages" ADD CONSTRAINT "kb_pages_category_id_kb_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."kb_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kb_pages" ADD CONSTRAINT "kb_pages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_sites" ADD CONSTRAINT "knowledge_base_sites_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinned_tooltips" ADD CONSTRAINT "pinned_tooltips_widget_config_id_widget_configs_id_fk" FOREIGN KEY ("widget_config_id") REFERENCES "public"."widget_configs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinned_tooltips" ADD CONSTRAINT "pinned_tooltips_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_recording_id_recordings_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recordings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_links" ADD CONSTRAINT "shared_links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trim_segments" ADD CONSTRAINT "trim_segments_video_project_data_id_video_project_data_id_fk" FOREIGN KEY ("video_project_data_id") REFERENCES "public"."video_project_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_project_data" ADD CONSTRAINT "video_project_data_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "walkthrough_steps" ADD CONSTRAINT "walkthrough_steps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget_configs" ADD CONSTRAINT "widget_configs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zoom_keyframes" ADD CONSTRAINT "zoom_keyframes_video_project_data_id_video_project_data_id_fk" FOREIGN KEY ("video_project_data_id") REFERENCES "public"."video_project_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_events_workspace_id_idx" ON "analytics_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "analytics_events_project_id_idx" ON "analytics_events" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_visitor_id_idx" ON "analytics_events" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "annotations_video_project_data_id_idx" ON "annotations" USING btree ("video_project_data_id");--> statement-breakpoint
CREATE INDEX "annotations_type_idx" ON "annotations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "annotations_start_time_ms_idx" ON "annotations" USING btree ("start_time_ms");--> statement-breakpoint
CREATE INDEX "course_lessons_module_id_idx" ON "course_lessons" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "course_lessons_project_id_idx" ON "course_lessons" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "course_lessons_sort_order_idx" ON "course_lessons" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "course_modules_course_id_idx" ON "course_modules" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_modules_sort_order_idx" ON "course_modules" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "courses_workspace_id_idx" ON "courses" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "courses_created_by_id_idx" ON "courses" USING btree ("created_by_id");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_progress_enrollment_lesson_idx" ON "enrollment_progress" USING btree ("enrollment_id","lesson_id");--> statement-breakpoint
CREATE INDEX "enrollment_progress_lesson_id_idx" ON "enrollment_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "enrollment_progress_status_idx" ON "enrollment_progress" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_course_user_idx" ON "enrollments" USING btree ("course_id","user_id");--> statement-breakpoint
CREATE INDEX "enrollments_user_id_idx" ON "enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "enrollments_status_idx" ON "enrollments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "guide_steps_project_id_idx" ON "guide_steps" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "guide_steps_step_number_idx" ON "guide_steps" USING btree ("step_number");--> statement-breakpoint
CREATE INDEX "kb_categories_site_id_idx" ON "kb_categories" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "kb_categories_parent_id_idx" ON "kb_categories" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kb_categories_site_slug_idx" ON "kb_categories" USING btree ("site_id","slug");--> statement-breakpoint
CREATE INDEX "kb_pages_site_id_idx" ON "kb_pages" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "kb_pages_category_id_idx" ON "kb_pages" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kb_pages_site_slug_idx" ON "kb_pages" USING btree ("site_id","slug");--> statement-breakpoint
CREATE INDEX "kb_pages_project_id_idx" ON "kb_pages" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kb_sites_slug_idx" ON "knowledge_base_sites" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "kb_sites_workspace_id_idx" ON "knowledge_base_sites" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kb_sites_custom_domain_idx" ON "knowledge_base_sites" USING btree ("custom_domain");--> statement-breakpoint
CREATE INDEX "pinned_tooltips_widget_config_id_idx" ON "pinned_tooltips" USING btree ("widget_config_id");--> statement-breakpoint
CREATE INDEX "pinned_tooltips_target_url_idx" ON "pinned_tooltips" USING btree ("target_url");--> statement-breakpoint
CREATE INDEX "pinned_tooltips_is_active_idx" ON "pinned_tooltips" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "projects_workspace_id_idx" ON "projects" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "projects_created_by_id_idx" ON "projects" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "projects_type_idx" ON "projects" USING btree ("type");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_recording_id_idx" ON "projects" USING btree ("recording_id");--> statement-breakpoint
CREATE INDEX "quiz_questions_quiz_id_idx" ON "quiz_questions" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_questions_sort_order_idx" ON "quiz_questions" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "quizzes_workspace_id_idx" ON "quizzes" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "recordings_workspace_id_idx" ON "recordings" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "recordings_created_by_id_idx" ON "recordings" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "recordings_status_idx" ON "recordings" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "shared_links_token_idx" ON "shared_links" USING btree ("token");--> statement-breakpoint
CREATE INDEX "shared_links_project_id_idx" ON "shared_links" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shared_links_custom_slug_idx" ON "shared_links" USING btree ("custom_slug");--> statement-breakpoint
CREATE INDEX "trim_segments_video_project_data_id_idx" ON "trim_segments" USING btree ("video_project_data_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_supabase_auth_id_idx" ON "users" USING btree ("supabase_auth_id");--> statement-breakpoint
CREATE UNIQUE INDEX "video_project_data_project_id_idx" ON "video_project_data" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "video_project_data_export_status_idx" ON "video_project_data" USING btree ("export_status");--> statement-breakpoint
CREATE INDEX "walkthrough_steps_project_id_idx" ON "walkthrough_steps" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "walkthrough_steps_step_number_idx" ON "walkthrough_steps" USING btree ("step_number");--> statement-breakpoint
CREATE INDEX "widget_configs_workspace_id_idx" ON "widget_configs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "widget_configs_is_active_idx" ON "widget_configs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_slug_idx" ON "workspaces" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "workspaces_owner_id_idx" ON "workspaces" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "zoom_keyframes_video_project_data_id_idx" ON "zoom_keyframes" USING btree ("video_project_data_id");--> statement-breakpoint
CREATE INDEX "zoom_keyframes_time_ms_idx" ON "zoom_keyframes" USING btree ("time_ms");