"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Eye,
  DollarSign,
  Video,
  BookOpen,
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  FileText,
  Share2,
  Settings,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const monthlyViewsData = [
  { month: "Sep", views: 4200 },
  { month: "Oct", views: 5800 },
  { month: "Nov", views: 4900 },
  { month: "Dec", views: 7200 },
  { month: "Jan", views: 8100 },
  { month: "Feb", views: 9400 },
  { month: "Mar", views: 11200 },
];

const contentBreakdown = [
  { name: "Screen Recordings", value: 48, color: "#166534" },
  { name: "Product Demos", value: 24, color: "#22c55e" },
  { name: "Tutorials", value: 18, color: "#86efac" },
  { name: "Bug Reports", value: 10, color: "#bbf7d0" },
];

const recentActivity = [
  {
    id: 1,
    title: "Onboarding Flow v2.1",
    description: "Screen recording - 4m 32s",
    time: "12 min ago",
    status: "published" as const,
    icon: PlayCircle,
  },
  {
    id: 2,
    title: "Checkout Bug #4821",
    description: "Bug report recording - 1m 18s",
    time: "1 hr ago",
    status: "processing" as const,
    icon: AlertCircle,
  },
  {
    id: 3,
    title: "Q1 Product Walkthrough",
    description: "Product demo - 8m 05s",
    time: "3 hrs ago",
    status: "published" as const,
    icon: Video,
  },
  {
    id: 4,
    title: "API Integration Guide",
    description: "Tutorial recording - 12m 44s",
    time: "5 hrs ago",
    status: "published" as const,
    icon: BookOpen,
  },
  {
    id: 5,
    title: "Dashboard Redesign Review",
    description: "Screen recording - 6m 11s",
    time: "Yesterday",
    status: "draft" as const,
    icon: PlayCircle,
  },
];

const statusConfig = {
  published: { label: "Published", variant: "success" as const },
  processing: { label: "Processing", variant: "warning" as const },
  draft: { label: "Draft", variant: "secondary" as const },
};

// ---------------------------------------------------------------------------
// Small sparkline component (pure SVG, no extra deps)
// ---------------------------------------------------------------------------

function Sparkline({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("w-20 h-7", className)}
      fill="none"
    >
      <polyline
        points={points}
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* ----------------------------------------------------------------- */}
      {/* Row 1 - Welcome + Stat cards                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome card */}
        <Card className="bg-green-900 border-green-800 text-white overflow-hidden relative">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[180px]">
            <div className="relative z-10">
              <p className="text-green-300 text-sm font-medium mb-1">
                Welcome back
              </p>
              <h2 className="text-2xl font-bold mb-2">Good morning!</h2>
              <p className="text-green-200 text-sm leading-relaxed max-w-[240px]">
                You have <span className="font-semibold text-white">3 new recordings</span> processed
                since yesterday. Your content reached 1.2K viewers this week.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 relative z-10">
              <Badge className="bg-green-700/60 text-green-100 border-green-600 hover:bg-green-700/80">
                <Sparkles className="w-3 h-3 mr-1" />
                New: AI summaries
              </Badge>
            </div>
            {/* Decorative circle */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-green-800/50" />
            <div className="absolute -right-2 -bottom-2 w-24 h-24 rounded-full bg-green-700/40" />
          </CardContent>
        </Card>

        {/* Net Income card */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">
                Net Income
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">$24,560</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3" />
                    18.2%
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
              <Sparkline data={[12, 14, 11, 15, 18, 16, 21, 24]} />
            </div>
          </CardContent>
        </Card>

        {/* Total Views card */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">
                Total Views
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">128.4K</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3" />
                    12.4%
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
              <Sparkline data={[80, 95, 88, 102, 110, 108, 128]} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Row 2 - Activity + Chart                                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white border-slate-200 lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-600">
                View All
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((item) => {
                const status = statusConfig[item.status];
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        {item.time}
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Views chart */}
        <Card className="bg-white border-slate-200 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900">Monthly Views</CardTitle>
              <Badge variant="default">
                <TrendingUp className="w-3 h-3 mr-1" />
                +34%
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Last 7 months performance
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyViewsData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "Views",
                    ]}
                  />
                  <Bar
                    dataKey="views"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Row 3 - Content Performance + Quick Actions                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Content Performance (donut) */}
        <Card className="bg-white border-slate-200 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-900">
              Content Performance
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Breakdown by content type
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-[180px] w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {contentBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        fontSize: "13px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {contentBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">
                          {item.name}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {item.value}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-900">Quick Actions</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Jump into common tasks
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button className="justify-start h-11 gap-3" variant="default">
                <Plus className="w-4 h-4" />
                New Recording
              </Button>
              <Button className="justify-start h-11 gap-3" variant="outline">
                <BookOpen className="w-4 h-4" />
                Create Guide
              </Button>
              <Button className="justify-start h-11 gap-3" variant="outline">
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
              <Button className="justify-start h-11 gap-3" variant="outline">
                <Share2 className="w-4 h-4" />
                Share Collection
              </Button>
              <Button className="justify-start h-11 gap-3" variant="ghost">
                <Settings className="w-4 h-4" />
                Workspace Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
