"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Link2,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Star,
  Award,
  Play,
  Lock,
  GraduationCap,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LessonViewer, type LessonContent, type LessonType } from "@/components/academy/LessonViewer";
import { CertificateCard, type CertificateData } from "@/components/academy/CertificateCard";

interface ModuleData {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    type: LessonType;
    duration: string;
    completed: boolean;
    locked: boolean;
  }[];
}

const MOCK_MODULES: ModuleData[] = [
  {
    id: "mod-1",
    title: "Introduction",
    lessons: [
      { id: "l-1", title: "Welcome to the Course", type: "video", duration: "3:24", completed: true, locked: false },
      { id: "l-2", title: "Course Overview", type: "article", duration: "5 min", completed: true, locked: false },
      { id: "l-3", title: "Setting Up Your Workspace", type: "guide", duration: "8 min", completed: false, locked: false },
    ],
  },
  {
    id: "mod-2",
    title: "Core Concepts",
    lessons: [
      { id: "l-4", title: "Understanding the Interface", type: "video", duration: "12:30", completed: false, locked: false },
      { id: "l-5", title: "Recording Your First Video", type: "guide", duration: "10 min", completed: false, locked: false },
      { id: "l-6", title: "Knowledge Check", type: "quiz", duration: "5 questions", completed: false, locked: false },
    ],
  },
  {
    id: "mod-3",
    title: "Advanced Features",
    lessons: [
      { id: "l-7", title: "Multi-Track Editing", type: "video", duration: "15:45", completed: false, locked: true },
      { id: "l-8", title: "Effects & Animations", type: "video", duration: "18:20", completed: false, locked: true },
      { id: "l-9", title: "External Resources", type: "link", duration: "", completed: false, locked: true },
      { id: "l-10", title: "Final Assessment", type: "quiz", duration: "10 questions", completed: false, locked: true },
    ],
  },
];

const TYPE_CONFIG: Record<LessonType, { icon: React.ElementType; color: string }> = {
  video: { icon: Video, color: "text-blue-400" },
  guide: { icon: BookOpen, color: "text-emerald-400" },
  article: { icon: FileText, color: "text-amber-400" },
  quiz: { icon: HelpCircle, color: "text-violet-400" },
  link: { icon: Link2, color: "text-cyan-400" },
};

function CourseSidebar({
  modules,
  selectedLessonId,
  onSelectLesson,
  progress,
}: {
  modules: ModuleData[];
  selectedLessonId: string;
  onSelectLesson: (id: string) => void;
  progress: number;
}) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-white">
      {/* Course Info */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground">Back to courses</span>
        </div>
        <h2 className="text-sm font-semibold text-foreground">Getting Started with ScreenFlow</h2>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-auto py-2">
        {modules.map((module, moduleIdx) => {
          const isExpanded = expandedModules.has(module.id);
          const completedCount = module.lessons.filter((l) => l.completed).length;
          const totalCount = module.lessons.length;

          return (
            <div key={module.id} className="mb-1">
              <button
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-100/50"
              >
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                    !isExpanded && "-rotate-90"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    <span className="text-xs text-slate-400 mr-1.5">{moduleIdx + 1}.</span>
                    {module.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {completedCount}/{totalCount} completed
                  </p>
                </div>
                {completedCount === totalCount && totalCount > 0 && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                )}
              </button>

              {isExpanded && (
                <div className="pb-1">
                  {module.lessons.map((lesson) => {
                    const config = TYPE_CONFIG[lesson.type];
                    const Icon = config.icon;
                    const isSelected = selectedLessonId === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !lesson.locked && onSelectLesson(lesson.id)}
                        disabled={lesson.locked}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-4 py-2 pl-10 text-left transition-all",
                          isSelected
                            ? "bg-green-500/10 border-l-2 border-green-500"
                            : "border-l-2 border-transparent hover:bg-slate-100/30",
                          lesson.locked && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : lesson.locked ? (
                          <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                        ) : isSelected ? (
                          <Play className="h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm truncate",
                              isSelected
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            )}
                          >
                            {lesson.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Icon className={cn("h-3 w-3", config.color)} />
                          {lesson.duration && (
                            <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certificate CTA */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
          <Award className="mx-auto h-5 w-5 text-green-600" />
          <p className="mt-1.5 text-xs font-medium text-foreground">Earn your certificate</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Complete all lessons to receive a certificate
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; courseSlug: string }>;
}) {
  const resolvedParams = React.use(params);
  const [modules, setModules] = useState<ModuleData[]>(MOCK_MODULES);
  const [selectedLessonId, setSelectedLessonId] = useState("l-3");
  const [showCertificate, setShowCertificate] = useState(false);

  const allLessons = modules.flatMap((m) => m.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const currentLesson = allLessons[currentLessonIndex];
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  const lessonContent: LessonContent | null = currentLesson
    ? {
        id: currentLesson.id,
        title: currentLesson.title,
        type: currentLesson.type,
        duration: currentLesson.duration,
      }
    : null;

  const handleComplete = () => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === selectedLessonId ? { ...l, completed: !l.completed } : l
        ),
      }))
    );
  };

  const handleNavigatePrev = () => {
    if (currentLessonIndex > 0) {
      setSelectedLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNavigateNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const next = allLessons[currentLessonIndex + 1];
      if (!next.locked) {
        setSelectedLessonId(next.id);
      }
    }
  };

  const mockCertificate: CertificateData = {
    id: "cert-1",
    courseName: "Getting Started with ScreenFlow",
    learnerName: "John Doe",
    completionDate: "March 4, 2026",
    certificateNumber: "SF-2026-0304-A1B2",
    verificationUrl: `https://screenflow.app/certificates/SF-2026-0304-A1B2`,
    issuerName: "ScreenFlow Academy",
    score: 92,
    hoursCompleted: 3,
  };

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="mx-auto max-w-xl px-6 py-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => setShowCertificate(false)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
              <Award className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Congratulations!</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You have earned your certificate
            </p>
          </div>
          <CertificateCard certificate={mockCertificate} variant="full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <CourseSidebar
        modules={modules}
        selectedLessonId={selectedLessonId}
        onSelectLesson={setSelectedLessonId}
        progress={progress}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {lessonContent ? (
          <LessonViewer
            lesson={lessonContent}
            isCompleted={currentLesson?.completed ?? false}
            onComplete={handleComplete}
            onNavigatePrev={handleNavigatePrev}
            onNavigateNext={handleNavigateNext}
            hasPrev={currentLessonIndex > 0}
            hasNext={
              currentLessonIndex < allLessons.length - 1 &&
              !allLessons[currentLessonIndex + 1]?.locked
            }
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">Select a lesson</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a lesson from the sidebar to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
