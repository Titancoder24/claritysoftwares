"use client";

import {
  Video,
  BookOpen,
  GraduationCap,
  Eye,
  Plus,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  PlayCircle,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Total Recordings",
    value: "128",
    change: "+12%",
    trend: "up" as const,
    icon: Video,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    label: "Published Guides",
    value: "34",
    change: "+8%",
    trend: "up" as const,
    icon: BookOpen,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Active Courses",
    value: "7",
    change: "+2",
    trend: "up" as const,
    icon: GraduationCap,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Total Views",
    value: "24.5K",
    change: "+18%",
    trend: "up" as const,
    icon: Eye,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "recording",
    title: "Onboarding Flow Walkthrough",
    description: "Screen recording completed",
    time: "2 hours ago",
    icon: PlayCircle,
    status: "completed" as const,
  },
  {
    id: 2,
    type: "guide",
    title: "API Integration Guide",
    description: "Published to Knowledge Base",
    time: "5 hours ago",
    icon: FileText,
    status: "published" as const,
  },
  {
    id: 3,
    type: "recording",
    title: "Dashboard Overview Demo",
    description: "Processing video...",
    time: "1 day ago",
    icon: PlayCircle,
    status: "processing" as const,
  },
  {
    id: 4,
    type: "course",
    title: "Product Training Series",
    description: "New module added",
    time: "2 days ago",
    icon: GraduationCap,
    status: "updated" as const,
  },
  {
    id: 5,
    type: "guide",
    title: "Getting Started with Webhooks",
    description: "Draft saved",
    time: "3 days ago",
    icon: FileText,
    status: "draft" as const,
  },
];

const statusBadgeVariant: Record<string, "success" | "default" | "warning" | "secondary"> = {
  completed: "success",
  published: "default",
  processing: "warning",
  updated: "default",
  draft: "secondary",
};

const quickStartTips = [
  {
    icon: Zap,
    title: "Record your first screen",
    description: "Use the desktop app or browser extension to capture your screen.",
  },
  {
    icon: Sparkles,
    title: "Auto-generate guides",
    description: "AI will create step-by-step guides from your recordings.",
  },
  {
    icon: GraduationCap,
    title: "Build a course",
    description: "Combine recordings and guides into structured training courses.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, John
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your content today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-zinc-900/50 border-white/10 hover:bg-zinc-800/80 hover:text-white transition-all shadow-sm">
            <Video className="h-4 w-4 mr-1.5" />
            New Recording
          </Button>
          <Button variant="outline" size="sm" className="bg-zinc-900/50 border-white/10 hover:bg-zinc-800/80 hover:text-white transition-all shadow-sm">
            <BookOpen className="h-4 w-4 mr-1.5" />
            New Guide
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/50 transition-all">
            <Plus className="h-4 w-4 mr-1.5" />
            New Course
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Card className="relative h-full overflow-hidden border-white/[0.08] bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.15] hover:shadow-2xl hover:shadow-indigo-500/[0.05] rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`rounded-xl p-3 ${stat.bgColor} ring-1 ring-inset ring-white/10 shadow-inner`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight text-white shadow-black/10 drop-shadow-sm">
                      {stat.value}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-zinc-400">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-6 py-5">
              <CardTitle className="text-base font-semibold text-white">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white hover:bg-white/5">
                View all
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.05]">
                {recentActivity.map((activity, i) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 ring-1 ring-white/10 group-hover:bg-zinc-800 transition-colors">
                        <Icon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                          {activity.title}
                        </p>
                        <p className="truncate mt-0.5 text-xs text-zinc-500">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 pl-4 shrink-0">
                        <Badge variant={statusBadgeVariant[activity.status]} className="bg-zinc-800/80 border-white/5 font-medium shadow-sm">
                          {activity.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="whitespace-nowrap">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <div className="h-full">
          <Card className="border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-lg rounded-2xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <CardHeader className="border-b border-white/[0.05] bg-white/[0.02] px-6 py-5 relative z-10">
              <CardTitle className="text-base font-semibold text-white">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-1 relative z-10">
              <div className="space-y-6 flex-1">
                {quickStartTips.map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <div key={i} className="group flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/20 transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:ring-indigo-500/40">
                        <Icon className="h-4.5 w-4.5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {tip.title}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t border-white/[0.05]">
                <Button className="w-full bg-white text-black hover:bg-zinc-200 shadow-md font-medium transition-colors">
                  View Documentation
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
