"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Video,
  FileText,
  BookOpen,
  HelpCircle,
  Link2,
  Trash2,
  Image,
  Upload,
  Clock,
  Users,
  Tag,
  ToggleLeft,
  ToggleRight,
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  AlignLeft,
  Heading1,
  Heading2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LessonType = "video" | "guide" | "article" | "quiz" | "link";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  content?: string;
}

interface Module {
  id: string;
  title: string;
  expanded: boolean;
  lessons: Lesson[];
}

const LESSON_TYPE_CONFIG: Record<
  LessonType,
  { icon: React.ElementType; label: string; color: string }
> = {
  video: { icon: Video, label: "Video", color: "text-blue-400" },
  guide: { icon: BookOpen, label: "Guide", color: "text-emerald-400" },
  article: { icon: FileText, label: "Article", color: "text-amber-400" },
  quiz: { icon: HelpCircle, label: "Quiz", color: "text-violet-400" },
  link: { icon: Link2, label: "Link", color: "text-cyan-400" },
};

const INITIAL_MODULES: Module[] = [
  {
    id: "mod-1",
    title: "Introduction",
    expanded: true,
    lessons: [
      { id: "les-1", title: "Welcome to the Course", type: "video", duration: "3:24" },
      { id: "les-2", title: "Course Overview", type: "article", duration: "5 min read" },
      { id: "les-3", title: "Setting Up Your Workspace", type: "guide", duration: "8 min read" },
    ],
  },
  {
    id: "mod-2",
    title: "Core Concepts",
    expanded: false,
    lessons: [
      { id: "les-4", title: "Understanding the Interface", type: "video", duration: "12:30" },
      { id: "les-5", title: "Recording Your First Video", type: "guide", duration: "10 min read" },
      { id: "les-6", title: "Knowledge Check", type: "quiz", duration: "5 questions" },
    ],
  },
  {
    id: "mod-3",
    title: "Advanced Features",
    expanded: false,
    lessons: [
      { id: "les-7", title: "Multi-Track Editing", type: "video", duration: "15:45" },
      { id: "les-8", title: "Effects & Animations", type: "video", duration: "18:20" },
      { id: "les-9", title: "External Resources", type: "link", duration: "" },
      { id: "les-10", title: "Final Assessment", type: "quiz", duration: "10 questions" },
    ],
  },
];

function ModuleSidebar({
  modules,
  setModules,
  selectedLesson,
  onSelectLesson,
}: {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  selectedLesson: string | null;
  onSelectLesson: (lessonId: string) => void;
}) {
  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, expanded: !m.expanded } : m))
    );
  };

  const addModule = () => {
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: "New Module",
      expanded: true,
      lessons: [],
    };
    setModules((prev) => [...prev, newModule]);
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: "New Lesson",
      type: "article",
      duration: "",
    };
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  };

  const deleteModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-zinc-950/50">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Course Structure</h3>
        <button
          onClick={addModule}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-1">
            {/* Module Header */}
            <div className="group flex items-center gap-1 px-2">
              <button className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-zinc-600 hover:text-zinc-400">
                <GripVertical className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => toggleModule(module.id)}
                className="flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-800"
              >
                {module.expanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="mr-1.5 text-xs text-muted-foreground">
                  {moduleIndex + 1}.
                </span>
                <span className="truncate">{module.title}</span>
              </button>
              <button
                onClick={() => deleteModule(module.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            {/* Lessons */}
            {module.expanded && (
              <div className="ml-5 mt-0.5 space-y-0.5 pl-4 border-l border-zinc-800">
                {module.lessons.map((lesson) => {
                  const config = LESSON_TYPE_CONFIG[lesson.type];
                  const Icon = config.icon;
                  const isSelected = selectedLesson === lesson.id;

                  return (
                    <div key={lesson.id} className="group/lesson flex items-center gap-1 pr-2">
                      <button className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center text-zinc-700 hover:text-zinc-500">
                        <GripVertical className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onSelectLesson(lesson.id)}
                        className={cn(
                          "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all",
                          isSelected
                            ? "bg-indigo-500/10 text-foreground"
                            : "text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5 shrink-0", config.color)} />
                        <span className="truncate">{lesson.title}</span>
                      </button>
                      <button
                        onClick={() => deleteLesson(module.id, lesson.id)}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-zinc-700 opacity-0 transition-all hover:text-red-400 group-hover/lesson:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={() => addLesson(module.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-800/50 hover:text-zinc-400"
                >
                  <Plus className="h-3 w-3" />
                  Add Lesson
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <button
          onClick={addModule}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-2 text-sm text-muted-foreground transition-colors hover:border-zinc-500 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Module
        </button>
      </div>
    </div>
  );
}

function LessonEditor({
  lesson,
  onUpdate,
}: {
  lesson: Lesson | null;
  onUpdate: (lessonId: string, updates: Partial<Lesson>) => void;
}) {
  if (!lesson) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-medium text-foreground">Select a lesson</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a lesson from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  const config = LESSON_TYPE_CONFIG[lesson.type];

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      {/* Lesson Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800")}>
            <config.icon className={cn("h-4 w-4", config.color)} />
          </div>
          <div className="flex-1">
            <input
              className="w-full bg-transparent text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              value={lesson.title}
              onChange={(e) => onUpdate(lesson.id, { title: e.target.value })}
              placeholder="Lesson title..."
            />
          </div>
          <div className="flex items-center gap-2">
            {(Object.keys(LESSON_TYPE_CONFIG) as LessonType[]).map((type) => {
              const tc = LESSON_TYPE_CONFIG[type];
              const TypeIcon = tc.icon;
              return (
                <button
                  key={type}
                  onClick={() => onUpdate(lesson.id, { type })}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                    lesson.type === type
                      ? "bg-zinc-800 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
                  )}
                  title={tc.label}
                >
                  <TypeIcon className={cn("h-3.5 w-3.5", lesson.type === type ? tc.color : "")} />
                  {lesson.type === type && tc.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6">
        {lesson.type === "video" && (
          <div className="space-y-4">
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-zinc-500">
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">Upload video</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drag and drop or click to browse. MP4, MOV, WebM supported.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Choose File
                </Button>
              </div>
            </div>
            <Input placeholder="Or paste a video URL (YouTube, Vimeo, Loom)..." />
          </div>
        )}

        {(lesson.type === "article" || lesson.type === "guide") && (
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-zinc-900/50 p-1">
              {[
                { icon: Heading1, title: "Heading 1" },
                { icon: Heading2, title: "Heading 2" },
                { icon: Bold, title: "Bold" },
                { icon: Italic, title: "Italic" },
                { icon: List, title: "Bullet List" },
                { icon: ListOrdered, title: "Numbered List" },
                { icon: Code, title: "Code" },
                { icon: AlignLeft, title: "Paragraph" },
                { icon: Image, title: "Image" },
                { icon: Link2, title: "Link" },
              ].map(({ icon: ToolIcon, title }) => (
                <button
                  key={title}
                  title={title}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-foreground"
                >
                  <ToolIcon className="h-4 w-4" />
                </button>
              ))}
            </div>
            {/* Editor Area */}
            <textarea
              className="min-h-[400px] w-full resize-none rounded-xl border border-border bg-zinc-900/30 p-6 text-sm text-foreground leading-relaxed outline-none placeholder:text-muted-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              placeholder={
                lesson.type === "article"
                  ? "Write your article content here..."
                  : "Write your step-by-step guide here..."
              }
            />
          </div>
        )}

        {lesson.type === "quiz" && (
          <div className="rounded-xl border border-border bg-zinc-900/30 p-8 text-center">
            <HelpCircle className="mx-auto h-10 w-10 text-violet-400" />
            <h3 className="mt-4 text-base font-medium text-foreground">Quiz Builder</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure questions, answers, and grading for this quiz
            </p>
            <Button className="mt-4" size="md">
              Open Quiz Builder
            </Button>
          </div>
        )}

        {lesson.type === "link" && (
          <div className="space-y-4">
            <Input placeholder="Enter external URL..." />
            <div className="rounded-xl border border-border bg-zinc-900/30 p-6">
              <p className="text-sm text-muted-foreground">
                Learners will be directed to the external resource. The link will open in a new tab.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseSettings() {
  const [isPublished, setIsPublished] = useState(false);

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-zinc-950/50">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Course Settings</h3>
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-4">
        {/* Publish Toggle */}
        <div className="rounded-lg border border-border bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Publish Course</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Make this course available to learners
              </p>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {isPublished ? (
                <ToggleRight className="h-8 w-8 text-indigo-400" />
              ) : (
                <ToggleLeft className="h-8 w-8" />
              )}
            </button>
          </div>
          <Badge
            variant={isPublished ? "success" : "secondary"}
            className="mt-2"
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Course Title
          </label>
          <Input
            defaultValue="Getting Started with ScreenFlow"
            placeholder="Enter course title..."
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Description
          </label>
          <textarea
            className="w-full resize-none rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
            rows={3}
            defaultValue="Learn the fundamentals of screen recording, editing, and sharing with ScreenFlow."
            placeholder="Course description..."
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Thumbnail
          </label>
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-zinc-500 cursor-pointer">
            <div className="text-center">
              <Image className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-1.5 text-xs text-muted-foreground">Upload thumbnail</p>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {["Onboarding", "Advanced", "Teams", "Production", "Templates"].map((cat) => (
              <button
                key={cat}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-indigo-500/50 hover:text-foreground"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Prerequisites
          </label>
          <Input placeholder="Search courses..." />
          <p className="text-xs text-muted-foreground">
            Select courses that must be completed before this one
          </p>
        </div>

        {/* Estimated Duration */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Estimated Duration
          </label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">2h 45m</span>
            <span className="text-xs text-muted-foreground">(auto-calculated)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="gap-1">
              beginner
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="secondary" className="gap-1">
              screenflow
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          </div>
          <Input placeholder="Add tag..." icon={<Tag className="h-3.5 w-3.5" />} />
        </div>

        {/* Enrollment */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Access
          </label>
          <div className="space-y-2">
            {["Public - Anyone can enroll", "Team - Team members only", "Invite - By invitation only"].map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-zinc-600 hover:text-foreground"
              >
                <div className="h-4 w-4 rounded-full border border-zinc-600" />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 space-y-2">
        <Button className="w-full" size="md">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        <Button variant="outline" className="w-full" size="md">
          <Eye className="h-4 w-4" />
          Preview Course
        </Button>
      </div>
    </div>
  );
}

export default function CourseBuilderPage() {
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>("les-1");

  const selectedLesson = modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === selectedLessonId) ?? null;

  const handleUpdateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
      }))
    );
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="/academy">
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
          </Button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <BookOpen className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Getting Started with ScreenFlow
            </span>
            <Badge variant="secondary" className="text-[10px]">
              Draft
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last saved 2 min ago</span>
          <Button variant="outline" size="sm">
            <Globe className="h-3.5 w-3.5" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <ModuleSidebar
          modules={modules}
          setModules={setModules}
          selectedLesson={selectedLessonId}
          onSelectLesson={setSelectedLessonId}
        />
        <LessonEditor lesson={selectedLesson} onUpdate={handleUpdateLesson} />
        <CourseSettings />
      </div>
    </div>
  );
}
