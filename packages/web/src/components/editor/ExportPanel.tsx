"use client";

import { useState, useCallback } from "react";
import {
  Download,
  Monitor,
  Film,
  Image,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExportConfig } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ExportPanelProps {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
  onExport: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const RESOLUTIONS: { value: ExportConfig["resolution"]; label: string; detail: string }[] = [
  { value: "720p", label: "720p", detail: "1280 x 720" },
  { value: "1080p", label: "1080p", detail: "1920 x 1080" },
  { value: "4k", label: "4K", detail: "3840 x 2160" },
];

const FORMATS: { value: ExportConfig["format"]; label: string; icon: React.ElementType; detail: string }[] = [
  { value: "mp4", label: "MP4", icon: Film, detail: "Best compatibility" },
  { value: "webm", label: "WebM", icon: Monitor, detail: "Smaller file size" },
  { value: "gif", label: "GIF", icon: Image, detail: "Animated image" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ExportPanel({ config, onChange, onExport }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const update = useCallback(
    (patch: Partial<ExportConfig>) => onChange({ ...config, ...patch }),
    [config, onChange],
  );

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setProgress(0);
    setCompleted(false);

    // Simulate export progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setCompleted(true);
          return 100;
        }
        return p + Math.random() * 8;
      });
    }, 200);

    onExport();
  }, [onExport]);

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center gap-2">
        <Download className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Export</h3>
      </div>

      {/* resolution */}
      <div>
        <span className="mb-2 block text-xs text-zinc-500">Resolution</span>
        <div className="grid grid-cols-3 gap-1.5">
          {RESOLUTIONS.map((res) => (
            <button
              key={res.value}
              onClick={() => update({ resolution: res.value })}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border py-2.5 transition-colors",
                config.resolution === res.value
                  ? "border-indigo-500/40 bg-indigo-600/10"
                  : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold",
                  config.resolution === res.value ? "text-indigo-400" : "text-zinc-400",
                )}
              >
                {res.label}
              </span>
              <span className="text-[9px] text-zinc-600">{res.detail}</span>
            </button>
          ))}
        </div>
      </div>

      {/* format */}
      <div>
        <span className="mb-2 block text-xs text-zinc-500">Format</span>
        <div className="flex flex-col gap-1.5">
          {FORMATS.map(({ value, label, icon: Icon, detail }) => (
            <button
              key={value}
              onClick={() => update({ format: value })}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors text-left",
                config.format === value
                  ? "border-indigo-500/40 bg-indigo-600/10"
                  : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  config.format === value ? "text-indigo-400" : "text-zinc-600",
                )}
              />
              <div className="flex-1">
                <span
                  className={cn(
                    "block text-xs font-medium",
                    config.format === value ? "text-indigo-400" : "text-zinc-300",
                  )}
                >
                  {label}
                </span>
                <span className="text-[10px] text-zinc-600">{detail}</span>
              </div>
              {config.format === value && (
                <Check className="h-3.5 w-3.5 text-indigo-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* divider */}
      <div className="h-px bg-white/[0.04]" />

      {/* export button */}
      {!isExporting && !completed && (
        <button
          onClick={handleExport}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export Video
        </button>
      )}

      {/* progress */}
      {isExporting && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
              <span className="text-xs text-zinc-400">Exporting...</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      )}

      {/* completed */}
      {completed && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">Export complete</span>
          </div>
          <button className="flex h-9 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs font-medium text-zinc-300 hover:bg-white/[0.04] transition-colors">
            <Download className="h-3.5 w-3.5" />
            Download File
          </button>
        </div>
      )}
    </div>
  );
}
