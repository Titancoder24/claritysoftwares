"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  Share2,
  Code2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data based on slug                                            */
/* ------------------------------------------------------------------ */

interface SharedProject {
  title: string;
  type: "video" | "guide" | "walkthrough";
  author: string;
  createdAt: string;
  duration?: string;
  steps?: { title: string; description: string }[];
}

function getProject(slug: string): SharedProject {
  // In production, this would fetch from an API
  const projects: Record<string, SharedProject> = {
    demo: {
      title: "Getting Started with ScreenFlow",
      type: "video",
      author: "ScreenFlow Team",
      createdAt: "2024-12-15",
      duration: "4:32",
    },
  };

  return (
    projects[slug] || {
      title: "Product Walkthrough",
      type: "guide",
      author: "Demo User",
      createdAt: "2024-12-20",
      steps: [
        { title: "Open the dashboard", description: "Navigate to your project dashboard by clicking the sidebar icon." },
        { title: "Create a new project", description: "Click the \"New Project\" button in the top-right corner of the dashboard." },
        { title: "Configure settings", description: "Set your project name, resolution, and recording preferences." },
        { title: "Start recording", description: "Click the red record button to begin capturing your screen." },
        { title: "Stop and review", description: "Press the stop button or use the keyboard shortcut to end recording, then review your capture." },
      ],
    }
  );
}

/* ------------------------------------------------------------------ */
/*  Video player component                                             */
/* ------------------------------------------------------------------ */

function VideoPlayer({ project }: { project: SharedProject }) {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 100;
        }
        return p + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Video area */}
      <div
        className="relative flex aspect-video items-center justify-center bg-slate-50 cursor-pointer"
        onClick={() => setPlaying(!playing)}
      >
        {/* Fake video content */}
        <div className="absolute inset-8 rounded-xl bg-slate-100" />
        <div className="absolute left-12 top-12 h-4 w-32 rounded bg-slate-200/50" />
        <div className="absolute left-12 top-20 h-3 w-24 rounded bg-slate-200/30" />

        {/* Play/pause overlay */}
        {!playing && (
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/90 shadow-2xl shadow-green-500/30 transition-transform hover:scale-105">
            <Play className="h-7 w-7 text-white ml-0.5" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-slate-200 px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-1 flex-1 cursor-pointer rounded-full bg-slate-100" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - rect.left) / rect.width) * 100);
          }}>
            <div
              className="h-1 rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying(!playing)}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:text-slate-900"
            >
              {playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <Volume2 className="h-4 w-4 text-slate-400" />
            <span className="text-xs tabular-nums text-slate-400">
              {Math.floor(progress * 0.0432)}:{String(Math.floor((progress * 2.72) % 60)).padStart(2, "0")} / {project.duration || "4:32"}
            </span>
          </div>
          <button className="rounded-lg p-1.5 text-slate-500 transition-colors hover:text-slate-900">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guide renderer component                                           */
/* ------------------------------------------------------------------ */

function GuideRenderer({ project }: { project: SharedProject }) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = project.steps || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Step navigation header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <span className="text-sm text-slate-500">
          Step {currentStep + 1} of {steps.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
            }
            disabled={currentStep === steps.length - 1}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div className="p-8">
        {steps[currentStep] && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-sm font-bold text-green-600">
                {currentStep + 1}
              </div>
              <h3 className="text-lg font-semibold">
                {steps[currentStep].title}
              </h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              {steps[currentStep].description}
            </p>
            {/* Placeholder screenshot */}
            <div className="aspect-video rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400">Screenshot placeholder</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-1.5 border-t border-slate-200 px-6 py-4">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentStep
                ? "w-6 bg-green-500"
                : i < currentStep
                  ? "bg-green-500/40"
                  : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Share / Embed dialog                                               */
/* ------------------------------------------------------------------ */

function ShareButtons({ slug }: { slug: string }) {
  const [copied, setCopied] = React.useState<"link" | "embed" | null>(null);
  const shareUrl = `https://app.screenflow.dev/share/${slug}`;
  const embedCode = `<iframe src="${shareUrl}/embed" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`;

  const copy = (text: string, type: "link" | "embed") => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => copy(shareUrl, "link")}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
      >
        {copied === "link" ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied === "link" ? "Copied!" : "Copy Link"}
      </button>
      <button
        onClick={() => copy(embedCode, "embed")}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
      >
        {copied === "embed" ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Code2 className="h-4 w-4" />
        )}
        {copied === "embed" ? "Copied!" : "Embed Code"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SharedPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "demo";
  const project = getProject(slug);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Minimal header */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 3h4v4H3V3Zm6 0h4v4H9V3ZM3 9h4v4H3V9Zm6 2.5L15 9v4l-6 2.5V11Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              ScreenFlow
            </span>
          </a>
          <a
            href="/auth/signup"
            className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:from-green-500 hover:to-emerald-500"
          >
            Try ScreenFlow Free
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Title area */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/50 px-2 py-0.5 text-xs font-medium text-slate-500">
            {project.type === "video"
              ? "Video"
              : project.type === "guide"
                ? "Step-by-Step Guide"
                : "Interactive Walkthrough"}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {project.title}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
            <span>By {project.author}</span>
            <span className="text-slate-300">|</span>
            <span>{new Date(project.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        {/* Renderer */}
        {project.type === "video" ? (
          <VideoPlayer project={project} />
        ) : (
          <GuideRenderer project={project} />
        )}

        {/* Share actions */}
        <div className="mt-6 flex items-center justify-between">
          <ShareButtons slug={slug} />
        </div>

        {/* Powered by */}
        <div className="mt-16 border-t border-slate-200 pt-8 text-center">
          <p className="text-xs text-slate-400">
            Created with{" "}
            <a
              href="/"
              className="font-medium text-slate-500 transition-colors hover:text-green-600"
            >
              ScreenFlow
            </a>{" "}
            -- Record once, create everything.
          </p>
        </div>
      </main>
    </div>
  );
}
