"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Link2,
  Clock,
  ArrowRight,
  RotateCcw,
  Award,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type LessonType = "video" | "guide" | "article" | "quiz" | "link";

export interface LessonContent {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  videoUrl?: string;
  content?: string;
  externalUrl?: string;
  quizQuestions?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

interface LessonViewerProps {
  lesson: LessonContent;
  isCompleted: boolean;
  onComplete: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function VideoPlayer({ videoUrl }: { videoUrl?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {/* Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105"
            >
              <Play className="h-7 w-7 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
        {/* Progress Bar */}
        <div className="mb-3 group cursor-pointer">
          <div className="h-1 w-full rounded-full bg-white/20 group-hover:h-1.5 transition-all">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/90 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              <SkipBack className="h-4 w-4" />
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              <SkipForward className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="text-xs text-white/60">4:12 / 12:30</span>
          </div>
          <button className="text-white/60 hover:text-white transition-colors">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideRenderer({ content }: { content?: string }) {
  const steps = [
    {
      step: 1,
      title: "Open the Recording Settings",
      description:
        "Navigate to Settings > Recording and configure your capture area, audio sources, and quality settings.",
    },
    {
      step: 2,
      title: "Configure Your Audio",
      description:
        "Select your microphone and system audio sources. Adjust input levels to ensure clear audio capture without clipping.",
    },
    {
      step: 3,
      title: "Set Your Recording Area",
      description:
        "Choose between full screen, window, or custom area capture. For tutorials, a specific window is usually best.",
    },
    {
      step: 4,
      title: "Start Recording",
      description:
        "Click the record button or use the keyboard shortcut (Cmd+Shift+R). A countdown will appear before recording starts.",
    },
    {
      step: 5,
      title: "Edit and Export",
      description:
        "After recording, use the timeline editor to trim, add annotations, and export in your preferred format.",
    },
  ];

  return (
    <div className="space-y-1">
      {steps.map(({ step, title, description }) => (
        <div key={step} className="group flex gap-4 rounded-lg p-4 transition-colors hover:bg-zinc-900/50">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
            {step}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleRenderer({ content }: { content?: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>
          Welcome to ScreenFlow! This article covers everything you need to know about getting started
          with screen recording and video editing. By the end of this article, you will be familiar with
          the core interface elements and ready to create your first recording.
        </p>
        <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">Understanding the Interface</h2>
        <p>
          The ScreenFlow interface is divided into several key areas: the canvas, the timeline, the
          properties panel, and the media library. Each serves a specific purpose in your video
          production workflow.
        </p>
        <div className="my-4 rounded-lg border border-border bg-zinc-900/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-400 mb-1">
            Pro Tip
          </p>
          <p className="text-sm text-muted-foreground">
            Use keyboard shortcuts to speed up your workflow. Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-mono">?</kbd> to
            see all available shortcuts.
          </p>
        </div>
        <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">Working with the Timeline</h2>
        <p>
          The timeline is where you arrange and edit your clips. You can add multiple tracks for
          video, audio, and annotations. Drag clips to rearrange them, and use the trim handles
          to adjust their duration.
        </p>
        <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">Exporting Your Video</h2>
        <p>
          When you are ready to share your video, go to File &gt; Export. Choose from presets
          optimized for different platforms, or customize your output settings for maximum quality.
        </p>
      </div>
    </div>
  );
}

function QuizViewer({ questions }: { questions?: QuizQuestion[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mockQuestions: QuizQuestion[] = questions ?? [
    {
      id: "q1",
      text: "What is the keyboard shortcut to start recording?",
      options: [
        { id: "a", text: "Cmd+R", isCorrect: false },
        { id: "b", text: "Cmd+Shift+R", isCorrect: true },
        { id: "c", text: "Ctrl+R", isCorrect: false },
        { id: "d", text: "Alt+R", isCorrect: false },
      ],
      explanation: "The default shortcut is Cmd+Shift+R (or Ctrl+Shift+R on Windows).",
    },
    {
      id: "q2",
      text: "Which panel allows you to arrange and edit clips?",
      options: [
        { id: "a", text: "Properties Panel", isCorrect: false },
        { id: "b", text: "Media Library", isCorrect: false },
        { id: "c", text: "Timeline", isCorrect: true },
        { id: "d", text: "Canvas", isCorrect: false },
      ],
      explanation: "The Timeline panel is where you arrange, trim, and edit your video clips.",
    },
    {
      id: "q3",
      text: "What export format is recommended for web sharing?",
      options: [
        { id: "a", text: "AVI", isCorrect: false },
        { id: "b", text: "MP4 (H.264)", isCorrect: true },
        { id: "c", text: "MOV (ProRes)", isCorrect: false },
        { id: "d", text: "WMV", isCorrect: false },
      ],
      explanation: "MP4 with H.264 encoding provides the best balance of quality and file size for web.",
    },
  ];

  const currentQuestion = mockQuestions[currentIdx];
  const correctCount = mockQuestions.filter(
    (q) => selectedAnswers[q.id] && q.options.find((o) => o.id === selectedAnswers[q.id])?.isCorrect
  ).length;
  const passed = correctCount >= Math.ceil(mockQuestions.length * 0.7);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center py-8">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full",
            passed ? "bg-emerald-500/15" : "bg-amber-500/15"
          )}
        >
          {passed ? (
            <Award className="h-10 w-10 text-emerald-400" />
          ) : (
            <RotateCcw className="h-10 w-10 text-amber-400" />
          )}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          {passed ? "Congratulations!" : "Not Quite"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You scored {correctCount} out of {mockQuestions.length} (
          {Math.round((correctCount / mockQuestions.length) * 100)}%)
        </p>

        <div className="mt-6 w-full max-w-md space-y-3">
          {mockQuestions.map((q, idx) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = q.options.find((o) => o.id === selected)?.isCorrect;
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-lg border p-3",
                  isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
                )}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{q.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          {!passed && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAnswers({});
                setShowResults(false);
                setSubmitted(false);
                setCurrentIdx(0);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentIdx + 1} of {mockQuestions.length}
        </span>
        <div className="flex gap-1.5">
          {mockQuestions.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all",
                idx === currentIdx
                  ? "bg-indigo-500"
                  : selectedAnswers[mockQuestions[idx].id]
                  ? "bg-indigo-500/40"
                  : "bg-zinc-800"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">{currentQuestion.text}</h3>

        <div className="mt-5 space-y-2.5">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() =>
                setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option.id })
              }
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                selectedAnswers[currentQuestion.id] === option.id
                  ? "border-indigo-500/50 bg-indigo-500/10 text-foreground"
                  : "border-border bg-zinc-900/30 text-muted-foreground hover:border-zinc-600 hover:text-foreground"
              )}
            >
              {selectedAnswers[currentQuestion.id] === option.id ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-zinc-600" />
              )}
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentIdx < mockQuestions.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setCurrentIdx(currentIdx + 1)}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < mockQuestions.length}
          >
            Submit Quiz
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ExternalLinkHandler({ url }: { url?: string }) {
  const displayUrl = url ?? "https://docs.screenflow.example.com/getting-started";

  return (
    <div className="flex flex-col items-center py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
        <ExternalLink className="h-8 w-8 text-cyan-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">External Resource</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        This lesson links to an external resource
      </p>
      <p className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-mono text-zinc-400">
        {displayUrl}
      </p>
      <Button className="mt-4" asChild>
        <a href={displayUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
          Open Resource
        </a>
      </Button>
    </div>
  );
}

export function LessonViewer({
  lesson,
  isCompleted,
  onComplete,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
}: LessonViewerProps) {
  const typeConfig: Record<LessonType, { icon: React.ElementType; color: string }> = {
    video: { icon: Video, color: "text-blue-400" },
    guide: { icon: BookOpen, color: "text-emerald-400" },
    article: { icon: FileText, color: "text-amber-400" },
    quiz: { icon: HelpCircle, color: "text-violet-400" },
    link: { icon: Link2, color: "text-cyan-400" },
  };

  const config = typeConfig[lesson.type];
  const TypeIcon = config.icon;

  return (
    <div className="flex flex-col">
      {/* Lesson Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
              <TypeIcon className={cn("h-4 w-4", config.color)} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{lesson.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px]">
                  {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                </Badge>
                {lesson.duration && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {lesson.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onComplete}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "border border-border text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/5"
            )}
          >
            <CheckCircle2 className={cn("h-4 w-4", isCompleted && "fill-emerald-400/20")} />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1 overflow-auto p-6">
        {lesson.type === "video" && <VideoPlayer videoUrl={lesson.videoUrl} />}
        {lesson.type === "guide" && <GuideRenderer content={lesson.content} />}
        {lesson.type === "article" && <ArticleRenderer content={lesson.content} />}
        {lesson.type === "quiz" && <QuizViewer questions={lesson.quizQuestions} />}
        {lesson.type === "link" && <ExternalLinkHandler url={lesson.externalUrl} />}
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigatePrev}
            disabled={!hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Lesson
          </Button>
          <Button
            size="sm"
            onClick={onNavigateNext}
            disabled={!hasNext}
          >
            Next Lesson
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LessonViewer;
