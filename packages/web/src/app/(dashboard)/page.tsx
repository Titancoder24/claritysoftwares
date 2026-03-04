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
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
            New Recording
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4" />
            New Guide
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="group relative overflow-hidden transition-all duration-200 hover:border-zinc-600">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View all
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusBadgeVariant[activity.status]}>
                          {activity.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
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
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickStartTips.map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {tip.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <Button variant="secondary" size="sm" className="w-full">
                  View Documentation
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
