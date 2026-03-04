"use client";

import * as React from "react";
import {
  Video,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Play,
  Clock,
  Eye,
  Calendar,
  Trash2,
  Pencil,
  Copy,
  Download,
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

interface Recording {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  status: "ready" | "processing" | "draft";
  createdAt: string;
  size: string;
}

const mockRecordings: Recording[] = [
  {
    id: "1",
    title: "Onboarding Flow Walkthrough",
    thumbnail: "",
    duration: "4:32",
    views: 1240,
    status: "ready",
    createdAt: "Mar 1, 2026",
    size: "128 MB",
  },
  {
    id: "2",
    title: "Dashboard Overview Demo",
    thumbnail: "",
    duration: "2:15",
    views: 890,
    status: "ready",
    createdAt: "Feb 28, 2026",
    size: "64 MB",
  },
  {
    id: "3",
    title: "API Integration Tutorial",
    thumbnail: "",
    duration: "8:47",
    views: 2100,
    status: "ready",
    createdAt: "Feb 25, 2026",
    size: "256 MB",
  },
  {
    id: "4",
    title: "New Feature Announcement",
    thumbnail: "",
    duration: "1:30",
    views: 0,
    status: "processing",
    createdAt: "Feb 24, 2026",
    size: "32 MB",
  },
  {
    id: "5",
    title: "Customer Support Workflow",
    thumbnail: "",
    duration: "6:12",
    views: 456,
    status: "ready",
    createdAt: "Feb 22, 2026",
    size: "180 MB",
  },
  {
    id: "6",
    title: "Settings Configuration Guide",
    thumbnail: "",
    duration: "3:45",
    views: 0,
    status: "draft",
    createdAt: "Feb 20, 2026",
    size: "96 MB",
  },
];

const statusConfig: Record<string, { variant: "success" | "warning" | "secondary"; label: string }> = {
  ready: { variant: "success", label: "Ready" },
  processing: { variant: "warning", label: "Processing" },
  draft: { variant: "secondary", label: "Draft" },
};

function RecordingGridCard({ recording }: { recording: Recording }) {
  const status = statusConfig[recording.status];
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:border-zinc-600">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Play className="h-5 w-5 ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {recording.duration}
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-sm font-medium text-foreground">
              {recording.title}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {recording.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {recording.views.toLocaleString()}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-muted hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil className="h-3.5 w-3.5" />
                Edit
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

function RecordingListRow({ recording }: { recording: Recording }) {
  const status = statusConfig[recording.status];
  return (
    <div className="group flex items-center gap-4 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-muted/30">
      {/* Thumbnail */}
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
          {recording.duration}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-sm font-medium text-foreground">
          {recording.title}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {recording.createdAt}
          </span>
          <span>{recording.size}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Eye className="h-3 w-3" />
        {recording.views.toLocaleString()}
      </div>

      <Badge variant={status.variant}>{status.label}</Badge>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-muted hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Pencil className="h-3.5 w-3.5" />
            Edit
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
  );
}

export default function RecordingsPage() {
  const [view, setView] = React.useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Recordings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and organize your screen recordings.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New Recording
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="max-w-sm flex-1">
            <Input
              placeholder="Search recordings..."
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex items-center rounded-lg border border-border">
            <button
              onClick={() => setView("grid")}
              className={`rounded-l-lg p-2 transition-colors ${view === "grid" ? "bg-muted text-foreground" : "text-zinc-500 hover:text-foreground"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-r-lg p-2 transition-colors ${view === "list" ? "bg-muted text-foreground" : "text-zinc-500 hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockRecordings.map((recording) => (
            <RecordingGridCard key={recording.id} recording={recording} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {mockRecordings.map((recording) => (
            <RecordingListRow key={recording.id} recording={recording} />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
        <span>{mockRecordings.length} recordings</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Total duration: 26:51
        </span>
      </div>
    </div>
  );
}
