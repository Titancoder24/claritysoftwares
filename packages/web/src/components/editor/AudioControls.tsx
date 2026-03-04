"use client";

import { useCallback, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Mic,
  Monitor,
  Music,
  Upload,
  Waves,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudioTrack } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AudioControlsProps {
  tracks: AudioTrack[];
  noiseGate: boolean;
  silenceDetection: boolean;
  autoDucking: boolean;
  onTrackUpdate: (id: string, patch: Partial<AudioTrack>) => void;
  onToggleNoiseGate: () => void;
  onToggleSilenceDetection: () => void;
  onToggleAutoDucking: () => void;
  onUploadMusic: (file: File) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TRACK_ICON: Record<string, React.ElementType> = {
  mic: Mic,
  system: Monitor,
  music: Music,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AudioControls({
  tracks,
  noiseGate,
  silenceDetection,
  autoDucking,
  onTrackUpdate,
  onToggleNoiseGate,
  onToggleSilenceDetection,
  onToggleAutoDucking,
  onUploadMusic,
}: AudioControlsProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUploadMusic(file);
    },
    [onUploadMusic],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Audio</h3>
      </div>

      {/* per-track volume */}
      <div className="flex flex-col gap-3">
        {tracks.map((track) => {
          const Icon = TRACK_ICON[track.type] ?? Volume2;
          return (
            <div key={track.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs text-zinc-400">{track.label}</span>
                </div>
                <button
                  onClick={() => onTrackUpdate(track.id, { muted: !track.muted })}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded transition-colors",
                    track.muted
                      ? "text-red-400 bg-red-500/10"
                      : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04]",
                  )}
                >
                  {track.muted ? (
                    <VolumeX className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={track.muted ? 0 : track.volume}
                  onChange={(e) =>
                    onTrackUpdate(track.id, { volume: parseFloat(e.target.value) })
                  }
                  className={cn(
                    "flex-1 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer",
                    track.muted
                      ? "accent-zinc-600 [&::-webkit-slider-thumb]:bg-zinc-600"
                      : "accent-indigo-500 [&::-webkit-slider-thumb]:bg-indigo-500",
                  )}
                />
                <span className="w-8 text-right text-[10px] font-mono text-zinc-600">
                  {Math.round((track.muted ? 0 : track.volume) * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* divider */}
      <div className="h-px bg-white/[0.04]" />

      {/* noise gate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-400">Noise gate</span>
        </div>
        <button
          onClick={onToggleNoiseGate}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            noiseGate ? "bg-indigo-600" : "bg-zinc-700",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              noiseGate ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {/* silence detection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-400">Silence detection</span>
        </div>
        <button
          onClick={onToggleSilenceDetection}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            silenceDetection ? "bg-indigo-600" : "bg-zinc-700",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              silenceDetection ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {/* auto-ducking */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-400">Auto-ducking</span>
        </div>
        <button
          onClick={onToggleAutoDucking}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            autoDucking ? "bg-indigo-600" : "bg-zinc-700",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              autoDucking ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {/* upload music */}
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.08] py-3 text-xs text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/20 hover:bg-indigo-600/5 transition-colors"
      >
        <Upload className="h-3.5 w-3.5" />
        <span>Upload background music</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
