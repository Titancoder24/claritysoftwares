"use client";

import * as React from "react";
import {
  Video,
  Search,
  Plus,
  Upload,
  MoreVertical,
  Play,
  Clock,
  Eye,
  Calendar,
  Trash2,
  Pencil,
  Copy,
  Download,
  Share2,
  ArrowUpDown,
  ChevronDown,
  Globe,
  Loader2,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RecordingStatus = "processing" | "completed" | "published";

interface Recording {
  id: string;
  title: string;
  thumbnailColor: string;
  duration: string;
  durationSeconds: number;
  views: number;
  status: RecordingStatus;
  createdAt: string;
  size: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockRecordings: Recording[] = [
  {
    id: "rec_01",
    title: "Onboarding Flow Walkthrough",
    thumbnailColor: "from-green-500/40 to-emerald-600/30",
    duration: "4:32",
    durationSeconds: 272,
    views: 1_243,
    status: "published",
    createdAt: "Mar 3, 2026",
    size: "128 MB",
  },
  {
    id: "rec_02",
    title: "Dashboard Overview — Sprint 14 Demo",
    thumbnailColor: "from-cyan-500/40 to-teal-600/30",
    duration: "2:15",
    durationSeconds: 135,
    views: 892,
    status: "completed",
    createdAt: "Mar 2, 2026",
    size: "64 MB",
  },
  {
    id: "rec_03",
    title: "API Integration Tutorial (v2)",
    thumbnailColor: "from-emerald-500/40 to-green-600/30",
    duration: "8:47",
    durationSeconds: 527,
    views: 2_104,
    status: "published",
    createdAt: "Feb 28, 2026",
    size: "256 MB",
  },
  {
    id: "rec_04",
    title: "New Feature Announcement — Dark Mode",
    thumbnailColor: "from-amber-400/40 to-orange-500/30",
    duration: "1:30",
    durationSeconds: 90,
    views: 0,
    status: "processing",
    createdAt: "Feb 27, 2026",
    size: "32 MB",
  },
  {
    id: "rec_05",
    title: "Customer Support Workflow Recording",
    thumbnailColor: "from-rose-400/40 to-pink-500/30",
    duration: "6:12",
    durationSeconds: 372,
    views: 456,
    status: "published",
    createdAt: "Feb 25, 2026",
    size: "180 MB",
  },
  {
    id: "rec_06",
    title: "Settings & Configuration Guide",
    thumbnailColor: "from-teal-500/40 to-emerald-600/30",
    duration: "3:45",
    durationSeconds: 225,
    views: 318,
    status: "completed",
    createdAt: "Feb 22, 2026",
    size: "96 MB",
  },
  {
    id: "rec_07",
    title: "Bug Repro — Table Sorting Issue #482",
    thumbnailColor: "from-red-400/40 to-rose-500/30",
    duration: "0:48",
    durationSeconds: 48,
    views: 37,
    status: "completed",
    createdAt: "Feb 20, 2026",
    size: "12 MB",
  },
  {
    id: "rec_08",
    title: "Team Standup — Feb 18",
    thumbnailColor: "from-sky-400/40 to-green-500/30",
    duration: "12:05",
    durationSeconds: 725,
    views: 0,
    status: "processing",
    createdAt: "Feb 18, 2026",
    size: "340 MB",
  },
  {
    id: "rec_09",
    title: "Product Roadmap Presentation Q1",
    thumbnailColor: "from-lime-500/40 to-green-600/30",
    duration: "15:22",
    durationSeconds: 922,
    views: 1_589,
    status: "published",
    createdAt: "Feb 15, 2026",
    size: "420 MB",
  },
  {
    id: "rec_10",
    title: "Design System Components Overview",
    thumbnailColor: "from-green-400/40 to-emerald-500/30",
    duration: "5:10",
    durationSeconds: 310,
    views: 671,
    status: "completed",
    createdAt: "Feb 12, 2026",
    size: "148 MB",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<
  RecordingStatus,
  { variant: "success" | "warning" | "default" | "secondary"; label: string }
> = {
  published: { variant: "success", label: "Published" },
  processing: { variant: "warning", label: "Processing" },
  completed: { variant: "default", label: "Completed" },
};

type SortOption = "newest" | "oldest" | "most-viewed" | "longest" | "name-az";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "most-viewed", label: "Most viewed" },
  { value: "longest", label: "Longest" },
  { value: "name-az", label: "Name A-Z" },
];

function sortRecordings(recordings: Recording[], sort: SortOption): Recording[] {
  const sorted = [...recordings];
  switch (sort) {
    case "newest":
      return sorted; // already ordered newest-first in mock data
    case "oldest":
      return sorted.reverse();
    case "most-viewed":
      return sorted.sort((a, b) => b.views - a.views);
    case "longest":
      return sorted.sort((a, b) => b.durationSeconds - a.durationSeconds);
    case "name-az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

function formatViewCount(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RecordingCard({ recording }: { recording: Recording }) {
  const status = statusConfig[recording.status];
  const isProcessing = recording.status === "processing";

  return (
    <Card
      className={cn(
        "group overflow-hidden bg-white border-slate-200 transition-colors duration-150",
        "hover:border-green-300 hover:shadow-md cursor-pointer"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            recording.thumbnailColor
          )}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isProcessing ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow-sm">
              <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/90 text-white opacity-0 backdrop-blur-sm shadow-sm transition-opacity duration-150 group-hover:opacity-100">
              <Play className="h-4 w-4 ml-0.5 fill-current" />
            </div>
          )}
        </div>

        {/* Duration pill */}
        <div className="absolute bottom-2 right-2 rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[11px] font-medium text-white tabular-nums backdrop-blur-sm">
          {recording.duration}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={status.variant} className="text-[10px] px-1.5 py-0">
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Card body */}
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13px] font-medium text-slate-900 leading-snug">
              {recording.title}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {recording.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViewCount(recording.views)} views
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Play className="h-3.5 w-3.5" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="h-3.5 w-3.5" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-3.5 w-3.5" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-3.5 w-3.5" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-3.5 w-3.5" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  hasSearch,
  activeTab,
}: {
  hasSearch: boolean;
  activeTab: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <Film className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-slate-800">
        {hasSearch ? "No recordings found" : "No recordings yet"}
      </h3>
      <p className="mt-1.5 max-w-sm text-[13px] text-slate-500">
        {hasSearch
          ? `No recordings match your ${activeTab !== "all" ? "filter and " : ""}search query. Try a different search term.`
          : "Create your first screen recording to get started. It only takes a few seconds."}
      </p>
      {!hasSearch && (
        <Button size="sm" className="mt-5">
          <Plus className="h-3.5 w-3.5" />
          New Recording
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");

  // Filter recordings
  const filtered = React.useMemo(() => {
    let results = mockRecordings;

    // Filter by tab
    if (activeTab !== "all") {
      results = results.filter((r) => r.status === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((r) => r.title.toLowerCase().includes(q));
    }

    // Sort
    results = sortRecordings(results, sortBy);

    return results;
  }, [activeTab, searchQuery, sortBy]);

  // Stats
  const tabCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: mockRecordings.length };
    for (const r of mockRecordings) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, []);

  const totalDuration = React.useMemo(() => {
    const totalSec = filtered.reduce((sum, r) => sum + r.durationSeconds, 0);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }, [filtered]);

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Recordings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Capture, edit, and share screen recordings with your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-3.5 w-3.5" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New Recording
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Filter bar                                                        */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <span className="ml-1.5 text-[10px] text-slate-400">
                {tabCounts.all}
              </span>
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing
              <span className="ml-1.5 text-[10px] text-slate-400">
                {tabCounts.processing ?? 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <span className="ml-1.5 text-[10px] text-slate-400">
                {tabCounts.completed ?? 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="published">
              Published
              <span className="ml-1.5 text-[10px] text-slate-400">
                {tabCounts.published ?? 0}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right: search + sort */}
        <div className="flex items-center gap-2">
          <div className="w-56">
            <Input
              placeholder="Search recordings..."
              icon={<Search className="h-3.5 w-3.5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm" className="gap-1.5 text-slate-500">
                <ArrowUpDown className="h-3 w-3" />
                {currentSortLabel}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                >
                  <span
                    className={cn(
                      sortBy === option.value
                        ? "text-green-700 font-medium"
                        : "text-slate-600"
                    )}
                  >
                    {option.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Recordings grid                                                   */}
      {/* ----------------------------------------------------------------- */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      ) : (
        <EmptyState hasSearch={searchQuery.trim().length > 0} activeTab={activeTab} />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Footer summary                                                    */}
      {/* ----------------------------------------------------------------- */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span>
            {filtered.length}{" "}
            {filtered.length === 1 ? "recording" : "recordings"}
            {activeTab !== "all" && (
              <span className="text-slate-400">
                {" "}
                of {mockRecordings.length} total
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Total duration: {totalDuration}
          </span>
        </div>
      )}
    </div>
  );
}
