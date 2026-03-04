"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Video,
  BookOpen,
  MousePointerClick,
  ChevronDown,
  Download,
  Check,
  Loader2,
  ZoomIn,
  MousePointer2,
  Palette,
  Sparkles,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { useAutoSave } from "@/hooks/useAutoSave";
import type {
  Annotation,
  AudioTrack,
  GuideStep,
  WalkthroughStep,
  ZoomKeyframe,
  Project,
} from "@/hooks/useProject";

/* -- editor components -- */
import { VideoCanvas } from "@/components/editor/VideoCanvas";
import { Timeline } from "@/components/editor/Timeline";
import { ZoomControls } from "@/components/editor/ZoomControls";
import { CursorControls } from "@/components/editor/CursorControls";
import { BackgroundPicker } from "@/components/editor/BackgroundPicker";
import { AnnotationTools } from "@/components/editor/AnnotationTools";
import { AudioControls } from "@/components/editor/AudioControls";
import { GuideStepList } from "@/components/editor/GuideStepList";
import { GuideStepEditor } from "@/components/editor/GuideStepEditor";
import { WalkthroughEditor } from "@/components/editor/WalkthroughEditor";
import { ExportPanel } from "@/components/editor/ExportPanel";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EditorTab = "video" | "guide" | "walkthrough";
type SidebarPanel = "zoom" | "cursor" | "background" | "annotations" | "audio" | "export";

/* ------------------------------------------------------------------ */
/*  ID helper                                                          */
/* ------------------------------------------------------------------ */

let _counter = 0;
function uid() {
  return `_${Date.now()}_${++_counter}`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function EditorPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const { project, isLoading, error, updateProject } = useProject(projectId);

  /* ---- local editor state ---- */
  const [tab, setTab] = useState<EditorTab>("video");
  const [sidebarPanel, setSidebarPanel] = useState<SidebarPanel>("zoom");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedGuideStepId, setSelectedGuideStepId] = useState<string | null>(null);

  /* ---- audio settings (local until saved) ---- */
  const [noiseGate, setNoiseGate] = useState(false);
  const [silenceDetection, setSilenceDetection] = useState(false);
  const [autoDucking, setAutoDucking] = useState(false);

  /* ---- auto-save ---- */
  useAutoSave({
    data: project,
    onSave: async (data) => {
      if (data) await updateProject(data);
    },
    debounceMs: 3000,
    enabled: !!project,
  });

  /* ---- playback controls ---- */
  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    setIsPlaying(false);
  }, []);
  const handleTimeUpdate = useCallback((time: number) => setCurrentTime(time), []);

  /* ---- title editing ---- */
  const handleTitleClick = useCallback(() => {
    if (project) {
      setTitleDraft(project.title);
      setEditingTitle(true);
    }
  }, [project]);

  const handleTitleBlur = useCallback(() => {
    setEditingTitle(false);
    if (project && titleDraft.trim() && titleDraft !== project.title) {
      updateProject({ title: titleDraft.trim() });
    }
  }, [project, titleDraft, updateProject]);

  /* ---- zoom helpers ---- */
  const handleZoomKeyframeDelete = useCallback(
    (id: string) => {
      if (!project) return;
      updateProject({
        zoomKeyframes: project.zoomKeyframes.filter((k) => k.id !== id),
      });
    },
    [project, updateProject],
  );

  /* ---- annotation helpers ---- */
  const handleAnnotationAdd = useCallback(
    (type: Annotation["type"]) => {
      if (!project) return;
      const ann: Annotation = {
        id: uid(),
        type,
        startTime: currentTime,
        endTime: Math.min(currentTime + 3, project.duration),
        x: 0.3,
        y: 0.3,
        width: 0.2,
        height: 0.1,
        rotation: 0,
        content: type === "text" ? "Annotation" : "",
        style: { color: "#6366f1", fontSize: 18, lineWidth: 2 },
      };
      updateProject({ annotations: [...project.annotations, ann] });
    },
    [project, currentTime, updateProject],
  );

  const handleAnnotationUpdate = useCallback(
    (id: string, patch: Partial<Annotation>) => {
      if (!project) return;
      updateProject({
        annotations: project.annotations.map((a) =>
          a.id === id ? { ...a, ...patch } : a,
        ),
      });
    },
    [project, updateProject],
  );

  const handleAnnotationDelete = useCallback(
    (id: string) => {
      if (!project) return;
      updateProject({
        annotations: project.annotations.filter((a) => a.id !== id),
      });
    },
    [project, updateProject],
  );

  /* ---- audio helpers ---- */
  const handleTrackUpdate = useCallback(
    (id: string, patch: Partial<AudioTrack>) => {
      if (!project) return;
      updateProject({
        audioTracks: project.audioTracks.map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      });
    },
    [project, updateProject],
  );

  /* ---- guide helpers ---- */
  const handleGuideStepAdd = useCallback(() => {
    if (!project) return;
    const step: GuideStep = {
      id: uid(),
      order: project.guideSteps.length,
      title: "",
      description: "",
      screenshotUrl: "",
      timestamp: currentTime,
    };
    updateProject({ guideSteps: [...project.guideSteps, step] });
    setSelectedGuideStepId(step.id);
  }, [project, currentTime, updateProject]);

  const handleGuideStepUpdate = useCallback(
    (id: string, patch: Partial<GuideStep>) => {
      if (!project) return;
      updateProject({
        guideSteps: project.guideSteps.map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        ),
      });
    },
    [project, updateProject],
  );

  const handleGuideStepDelete = useCallback(
    (id: string) => {
      if (!project) return;
      updateProject({
        guideSteps: project.guideSteps.filter((s) => s.id !== id),
      });
      if (selectedGuideStepId === id) setSelectedGuideStepId(null);
    },
    [project, updateProject, selectedGuideStepId],
  );

  const handleGuideStepReorder = useCallback(
    (from: number, to: number) => {
      if (!project) return;
      const arr = [...project.guideSteps];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      updateProject({ guideSteps: arr.map((s, i) => ({ ...s, order: i })) });
    },
    [project, updateProject],
  );

  /* ---- walkthrough helpers ---- */
  const handleWalkthroughStepAdd = useCallback(() => {
    if (!project) return;
    const step: WalkthroughStep = {
      id: uid(),
      order: project.walkthroughSteps.length,
      instruction: "",
      cssSelector: "",
      url: "/",
      tooltipPosition: "bottom",
    };
    updateProject({ walkthroughSteps: [...project.walkthroughSteps, step] });
  }, [project, updateProject]);

  const handleWalkthroughStepUpdate = useCallback(
    (id: string, patch: Partial<WalkthroughStep>) => {
      if (!project) return;
      updateProject({
        walkthroughSteps: project.walkthroughSteps.map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        ),
      });
    },
    [project, updateProject],
  );

  const handleWalkthroughStepDelete = useCallback(
    (id: string) => {
      if (!project) return;
      updateProject({
        walkthroughSteps: project.walkthroughSteps.filter((s) => s.id !== id),
      });
    },
    [project, updateProject],
  );

  const handleWalkthroughReorder = useCallback(
    (from: number, to: number) => {
      if (!project) return;
      const arr = [...project.walkthroughSteps];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      updateProject({ walkthroughSteps: arr.map((s, i) => ({ ...s, order: i })) });
    },
    [project, updateProject],
  );

  /* ---- derived ---- */
  const selectedGuideStep = useMemo(
    () => project?.guideSteps.find((s) => s.id === selectedGuideStepId) ?? null,
    [project, selectedGuideStepId],
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  /* -- loading / error -- */
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090b]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-[#09090b]">
        <p className="text-sm text-red-400">{error ?? "Project not found"}</p>
        <a
          href="/recordings"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Back to recordings
        </a>
      </div>
    );
  }

  /* -- sidebar panels config -- */
  const SIDEBAR_PANELS: { key: SidebarPanel; icon: React.ElementType; label: string }[] = [
    { key: "zoom", icon: ZoomIn, label: "Zoom" },
    { key: "cursor", icon: MousePointer2, label: "Cursor" },
    { key: "background", icon: Palette, label: "Background" },
    { key: "annotations", icon: Sparkles, label: "Annotations" },
    { key: "audio", icon: Volume2, label: "Audio" },
    { key: "export", icon: Download, label: "Export" },
  ];

  return (
    <div className="flex h-screen w-screen flex-col bg-[#09090b] text-zinc-200 overflow-hidden">
      {/* ============================================================ */}
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0c0c0f] px-4">
        {/* left: back + title */}
        <div className="flex items-center gap-3">
          <a
            href="/recordings"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </a>

          <div className="h-4 w-px bg-white/[0.06]" />

          {editingTitle ? (
            <input
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleBlur();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              className="h-7 rounded-md border border-indigo-500/40 bg-white/[0.03] px-2 text-sm font-medium text-zinc-200 outline-none w-64"
              autoFocus
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              {project.title}
            </button>
          )}
        </div>

        {/* center: tabs */}
        <nav className="flex items-center gap-1">
          {(
            [
              { key: "video", icon: Video, label: "Video" },
              { key: "guide", icon: BookOpen, label: "Guide" },
              { key: "walkthrough", icon: MousePointerClick, label: "Walkthrough" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tab === key
                  ? "bg-white/[0.06] text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* right: export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex h-8 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export
            <ChevronDown className="h-3 w-3" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-white/[0.06] bg-[#111114] p-1 shadow-xl z-50">
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  setTab("video");
                  setSidebarPanel("export");
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.04] transition-colors"
              >
                <Video className="h-3.5 w-3.5 text-zinc-500" />
                Export Video
              </button>
              <button
                onClick={() => setShowExportMenu(false)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.04] transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                Export Guide (PDF)
              </button>
              <button
                onClick={() => setShowExportMenu(false)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.04] transition-colors"
              >
                <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" />
                Publish Walkthrough
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/*  BODY                                                         */}
      {/* ============================================================ */}

      {/* ---- VIDEO TAB ---- */}
      {tab === "video" && (
        <div className="flex flex-1 overflow-hidden">
          {/* canvas + timeline */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* canvas */}
            <div className="flex-1 min-h-0">
              <VideoCanvas
                videoUrl={project.videoUrl}
                videoWidth={project.width}
                videoHeight={project.height}
                isPlaying={isPlaying}
                currentTime={currentTime}
                zoomKeyframes={project.zoomKeyframes}
                cursorEvents={project.cursorEvents}
                annotations={project.annotations}
                background={project.background}
                cursorConfig={project.cursor}
                zoomConfig={project.zoom}
                onPlay={handlePlay}
                onPause={handlePause}
                onTimeUpdate={handleTimeUpdate}
              />
            </div>

            {/* timeline */}
            <Timeline
              duration={project.duration}
              currentTime={currentTime}
              isPlaying={isPlaying}
              trimStart={project.trimStart}
              trimEnd={project.trimEnd}
              zoomKeyframes={project.zoomKeyframes}
              cursorEvents={project.cursorEvents}
              onSeek={handleSeek}
              onPlay={handlePlay}
              onPause={handlePause}
              onTrimChange={(start, end) =>
                updateProject({ trimStart: start, trimEnd: end })
              }
            />
          </div>

          {/* right sidebar */}
          <div className="flex w-[280px] flex-shrink-0 border-l border-white/[0.06] bg-[#0c0c0f]">
            {/* sidebar tab bar */}
            <div className="flex w-11 flex-shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] py-2">
              {SIDEBAR_PANELS.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setSidebarPanel(key)}
                  title={label}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                    sidebarPanel === key
                      ? "bg-white/[0.06] text-indigo-400"
                      : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* sidebar content */}
            <div className="flex-1 overflow-y-auto p-4">
              {sidebarPanel === "zoom" && (
                <ZoomControls
                  config={project.zoom}
                  keyframes={project.zoomKeyframes}
                  onConfigChange={(zoom) => updateProject({ zoom })}
                  onKeyframeDelete={handleZoomKeyframeDelete}
                  onKeyframeEdit={() => {}}
                />
              )}

              {sidebarPanel === "cursor" && (
                <CursorControls
                  config={project.cursor}
                  onChange={(cursor) => updateProject({ cursor })}
                />
              )}

              {sidebarPanel === "background" && (
                <BackgroundPicker
                  config={project.background}
                  onChange={(background) => updateProject({ background })}
                />
              )}

              {sidebarPanel === "annotations" && (
                <AnnotationTools
                  annotations={project.annotations}
                  currentTime={currentTime}
                  duration={project.duration}
                  onAdd={handleAnnotationAdd}
                  onUpdate={handleAnnotationUpdate}
                  onDelete={handleAnnotationDelete}
                />
              )}

              {sidebarPanel === "audio" && (
                <AudioControls
                  tracks={project.audioTracks}
                  noiseGate={noiseGate}
                  silenceDetection={silenceDetection}
                  autoDucking={autoDucking}
                  onTrackUpdate={handleTrackUpdate}
                  onToggleNoiseGate={() => setNoiseGate(!noiseGate)}
                  onToggleSilenceDetection={() => setSilenceDetection(!silenceDetection)}
                  onToggleAutoDucking={() => setAutoDucking(!autoDucking)}
                  onUploadMusic={() => {}}
                />
              )}

              {sidebarPanel === "export" && (
                <ExportPanel
                  config={project.exportConfig}
                  onChange={(exportConfig) => updateProject({ exportConfig })}
                  onExport={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- GUIDE TAB ---- */}
      {tab === "guide" && (
        <div className="flex flex-1 overflow-hidden">
          {/* left: step list */}
          <div className="w-[340px] flex-shrink-0 border-r border-white/[0.06] bg-[#0c0c0f]">
            <GuideStepList
              steps={project.guideSteps}
              selectedId={selectedGuideStepId}
              onSelect={setSelectedGuideStepId}
              onAdd={handleGuideStepAdd}
              onDelete={handleGuideStepDelete}
              onReorder={handleGuideStepReorder}
            />
          </div>

          {/* center: step editor */}
          <div className="flex-1 overflow-hidden">
            <GuideStepEditor
              step={selectedGuideStep}
              onUpdate={handleGuideStepUpdate}
              onLinkToTimestamp={(stepId) => {
                handleGuideStepUpdate(stepId, { timestamp: currentTime });
              }}
            />
          </div>

          {/* right: export options */}
          <div className="w-[220px] flex-shrink-0 border-l border-white/[0.06] bg-[#0c0c0f] p-4">
            <ExportPanel
              config={project.exportConfig}
              onChange={(exportConfig) => updateProject({ exportConfig })}
              onExport={() => {}}
            />
          </div>
        </div>
      )}

      {/* ---- WALKTHROUGH TAB ---- */}
      {tab === "walkthrough" && (
        <div className="flex-1 overflow-y-auto bg-[#09090b]">
          <WalkthroughEditor
            steps={project.walkthroughSteps}
            onAdd={handleWalkthroughStepAdd}
            onUpdate={handleWalkthroughStepUpdate}
            onDelete={handleWalkthroughStepDelete}
            onReorder={handleWalkthroughReorder}
            onPreview={() => {}}
          />
        </div>
      )}
    </div>
  );
}
