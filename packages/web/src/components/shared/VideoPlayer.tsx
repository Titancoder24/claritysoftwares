"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  className,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [buffered, setBuffered] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverX, setHoverX] = useState(0);

  const hideControlsTimer = useRef<NodeJS.Timeout>();

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (playing) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) setShowControls(true);
    else resetHideTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [playing, resetHideTimer]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = fraction * duration;
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    setHoverTime(fraction * duration);
    setHoverX(e.clientX - rect.left);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Demo placeholder when no src
  if (!src) {
    return (
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-200",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 to-emerald-50/40" />
        <div className="relative z-10 text-center">
          <button
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10 ring-1 ring-green-600/20 transition-all hover:bg-green-600/20 hover:ring-green-600/40 hover:scale-105"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8 text-green-600 ml-1" />
          </button>
          {title && (
            <p className="mt-4 text-sm font-medium text-slate-700">{title}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">4:32</p>
        </div>

        {/* Mock Controls */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12">
          {/* Progress */}
          <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-green-600 to-emerald-500" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-slate-700 transition-colors hover:text-slate-900">
                <Play className="h-5 w-5" />
              </button>
              <button className="text-slate-500 transition-colors hover:text-slate-900">
                <SkipBack className="h-4 w-4" />
              </button>
              <button className="text-slate-500 transition-colors hover:text-slate-900">
                <SkipForward className="h-4 w-4" />
              </button>
              <span className="text-xs tabular-nums text-slate-500">
                1:35 / 4:32
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-slate-500 transition-colors hover:text-slate-900">
                <Volume2 className="h-4 w-4" />
              </button>
              <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                1x
              </span>
              <button className="text-slate-500 transition-colors hover:text-slate-900">
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-black",
        className
      )}
      onMouseMove={resetHideTimer}
      onMouseEnter={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="h-full w-full cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (!videoRef.current) return;
          setCurrentTime(videoRef.current.currentTime);
          onTimeUpdate?.(videoRef.current.currentTime);

          if (videoRef.current.buffered.length > 0) {
            setBuffered(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
      />

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-16 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="group/progress relative mb-3 h-1.5 cursor-pointer rounded-full bg-slate-300/50"
          onClick={handleProgressClick}
          onMouseMove={handleProgressHover}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Buffered */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-slate-400/50"
            style={{ width: `${(buffered / duration) * 100}%` }}
          />
          {/* Progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-500"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white opacity-0 shadow-lg transition-opacity group-hover/progress:opacity-100" />
          </div>

          {/* Hover Time Tooltip */}
          {hovering && (
            <div
              className="absolute bottom-5 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white shadow-lg"
              style={{ left: `${hoverX}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="rounded-lg p-1.5 text-white transition-colors hover:bg-white/10"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={() => skip(-10)}
              className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={() => skip(10)}
              className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </button>
            <span className="ml-1 text-xs tabular-nums text-zinc-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Volume */}
            <div className="group/vol flex items-center">
              <button
                onClick={toggleMute}
                className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setMuted(val === 0);
                  if (videoRef.current) videoRef.current.volume = val;
                }}
                className="ml-1 w-0 origin-left scale-x-0 transition-all group-hover/vol:w-20 group-hover/vol:scale-x-100 accent-green-600"
              />
            </div>

            {/* Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Gauge className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">{playbackSpeed}x</span>
              </button>
              {showSpeedMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSpeedMenu(false)} />
                  <div className="absolute bottom-10 right-0 z-50 min-w-[100px] rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
                    {playbackSpeeds.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => changeSpeed(speed)}
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-slate-100",
                          playbackSpeed === speed ? "text-green-600" : "text-slate-700"
                        )}
                      >
                        {speed}x
                        {playbackSpeed === speed && (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 ring-1 ring-green-600/30 transition-all hover:bg-green-600/30 hover:scale-105"
          >
            <Play className="h-7 w-7 text-white ml-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}
