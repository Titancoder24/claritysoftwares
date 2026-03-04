"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ZoomKeyframe {
  id: string;
  startTime: number;
  endTime: number;
  scale: number;
  x: number;
  y: number;
  easing: "spring" | "smooth" | "linear";
}

export interface CursorEvent {
  id: string;
  time: number;
  x: number;
  y: number;
  type: "move" | "click" | "scroll";
}

export interface Annotation {
  id: string;
  type: "text" | "blur" | "spotlight" | "arrow" | "shape";
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style: Record<string, string | number>;
}

export interface AudioTrack {
  id: string;
  label: string;
  type: "mic" | "system" | "music";
  url: string;
  volume: number;
  muted: boolean;
}

export interface GuideStep {
  id: string;
  order: number;
  title: string;
  description: string;
  screenshotUrl: string;
  highlightSelector?: string;
  highlightRect?: { x: number; y: number; w: number; h: number };
  timestamp: number;
}

export interface WalkthroughStep {
  id: string;
  order: number;
  instruction: string;
  cssSelector: string;
  url: string;
  tooltipPosition: "top" | "bottom" | "left" | "right";
}

export interface BackgroundConfig {
  type: "gradient" | "solid" | "custom";
  color: string;
  gradient: { from: string; to: string; angle: number };
  padding: number;
  borderRadius: number;
  shadow: { x: number; y: number; blur: number; color: string };
}

export interface CursorConfig {
  smoothing: "off" | "gentle" | "smooth" | "cinematic";
  size: number;
  style: "macos" | "windows" | "custom";
  customUrl?: string;
  clickEffects: boolean;
  autoHide: boolean;
}

export interface ZoomConfig {
  enabled: boolean;
  intensity: number;
  easing: "spring" | "smooth" | "linear";
  autoZoom: boolean;
}

export interface ExportConfig {
  resolution: "720p" | "1080p" | "4k";
  format: "mp4" | "webm" | "gif";
}

export interface Project {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
  trimStart: number;
  trimEnd: number;
  zoomKeyframes: ZoomKeyframe[];
  cursorEvents: CursorEvent[];
  annotations: Annotation[];
  audioTracks: AudioTrack[];
  guideSteps: GuideStep[];
  walkthroughSteps: WalkthroughStep[];
  background: BackgroundConfig;
  cursor: CursorConfig;
  zoom: ZoomConfig;
  exportConfig: ExportConfig;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Project>(`/api/projects/${projectId}`);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateProject = useCallback(
    async (patch: Partial<Project>) => {
      if (!project) return;
      const optimistic = { ...project, ...patch, updatedAt: new Date().toISOString() };
      setProject(optimistic);
      try {
        await api.patch<Project>(`/api/projects/${projectId}`, patch);
      } catch (err) {
        console.error("[useProject] update failed, reverting:", err);
        setProject(project);
      }
    },
    [project, projectId],
  );

  return { project, isLoading, error, updateProject, refetch: fetchProject };
}
