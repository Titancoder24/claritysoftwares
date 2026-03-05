"use client";

import React from "react";
import {
  Eye,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpDown,
  ChevronRight,
  Film,
  BookOpen,
  MousePointerClick,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ViewsLineChart,
  TopContentBarChart,
  type ViewsDataPoint,
  type TopContentDataPoint,
} from "@/components/shared/AnalyticsCharts";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

function generateViewsData(): ViewsDataPoint[] {
  const data: ViewsDataPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(80 + Math.random() * 400 + (30 - i) * 8),
    });
  }
  return data;
}

const viewsData = generateViewsData();

const topContent: TopContentDataPoint[] = [
  { name: "Getting Started Guide", views: 2847 },
  { name: "API Authentication", views: 2201 },
  { name: "Dashboard Overview", views: 1893 },
  { name: "Deployment Walkthrough", views: 1654 },
  { name: "Data Import Tutorial", views: 1432 },
  { name: "Team Management", views: 1198 },
  { name: "Webhook Configuration", views: 987 },
  { name: "Custom Themes", views: 876 },
  { name: "Billing Setup", views: 743 },
  { name: "SSO Integration", views: 612 },
];

interface ContentRow {
  id: string;
  title: string;
  type: "video" | "guide" | "walkthrough";
  views: number;
  avgWatchTime: string;
  completionRate: number;
  trend: number;
}

const contentRows: ContentRow[] = [
  { id: "1", title: "Getting Started Guide", type: "guide", views: 2847, avgWatchTime: "4:32", completionRate: 78, trend: 12 },
  { id: "2", title: "API Authentication", type: "video", views: 2201, avgWatchTime: "6:18", completionRate: 64, trend: 8 },
  { id: "3", title: "Dashboard Overview", type: "walkthrough", views: 1893, avgWatchTime: "3:45", completionRate: 82, trend: -3 },
  { id: "4", title: "Deployment Walkthrough", type: "walkthrough", views: 1654, avgWatchTime: "8:12", completionRate: 56, trend: 15 },
  { id: "5", title: "Data Import Tutorial", type: "video", views: 1432, avgWatchTime: "5:22", completionRate: 71, trend: 5 },
  { id: "6", title: "Team Management", type: "guide", views: 1198, avgWatchTime: "3:08", completionRate: 88, trend: -1 },
  { id: "7", title: "Webhook Configuration", type: "video", views: 987, avgWatchTime: "7:44", completionRate: 52, trend: 22 },
  { id: "8", title: "Custom Themes", type: "guide", views: 876, avgWatchTime: "2:56", completionRate: 91, trend: 6 },
  { id: "9", title: "Billing Setup", type: "video", views: 743, avgWatchTime: "4:10", completionRate: 67, trend: -8 },
  { id: "10", title: "SSO Integration", type: "walkthrough", views: 612, avgWatchTime: "9:30", completionRate: 44, trend: 18 },
];

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
}) {
  const positive = trend >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-green-500/10 p-2.5">
            <Icon className="h-5 w-5 text-green-600" />
          </div>
          <div
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
              positive
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {trend}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{trendLabel}</p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Type badge helper                                                  */
/* ------------------------------------------------------------------ */

function TypeBadge({ type }: { type: ContentRow["type"] }) {
  const config = {
    video: { icon: Film, variant: "default" as const, label: "Video" },
    guide: { icon: BookOpen, variant: "success" as const, label: "Guide" },
    walkthrough: { icon: MousePointerClick, variant: "warning" as const, label: "Walkthrough" },
  };
  const { icon: Icon, variant, label } = config[type];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

type SortKey = "title" | "views" | "avgWatchTime" | "completionRate";
type SortDir = "asc" | "desc";

export default function AnalyticsPage() {
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("views");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = contentRows
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "views") cmp = a.views - b.views;
      else if (sortKey === "completionRate") cmp = a.completionRate - b.completionRate;
      else cmp = a.avgWatchTime.localeCompare(b.avgWatchTime);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      onClick={() => toggleSort(field)}
      className="group flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown
        className={`h-3 w-3 transition-colors ${sortKey === field ? "text-green-600" : "text-slate-400 group-hover:text-slate-500"}`}
      />
    </button>
  );

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Track how your content is performing across all channels.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Total Views (30d)"
          value="18,432"
          trend={14}
          trendLabel="vs previous 30 days"
        />
        <StatCard
          icon={Clock}
          label="Total Watch Time"
          value="1,247 hrs"
          trend={8}
          trendLabel="vs previous 30 days"
        />
        <StatCard
          icon={Trophy}
          label="Most Viewed Content"
          value="Getting Started"
          trend={12}
          trendLabel="2,847 views this month"
        />
        <StatCard
          icon={Target}
          label="Avg Completion Rate"
          value="72.3%"
          trend={-2}
          trendLabel="vs previous 30 days"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ViewsLineChart data={viewsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Content by Views</CardTitle>
          </CardHeader>
          <CardContent>
            <TopContentBarChart data={topContent} />
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">All Content</CardTitle>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content..."
              className="h-9 rounded-lg border border-border bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border">
                  <th className="px-6 py-3 text-left">
                    <SortHeader label="Title" field="title" />
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Type
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <SortHeader label="Views" field="views" />
                  </th>
                  <th className="px-6 py-3 text-right">
                    <SortHeader label="Avg Watch Time" field="avgWatchTime" />
                  </th>
                  <th className="px-6 py-3 text-right">
                    <SortHeader label="Completion" field="completionRate" />
                  </th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="group cursor-pointer border-t border-border transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium text-foreground group-hover:text-green-600 transition-colors">
                        {row.title}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <TypeBadge type={row.type} />
                    </td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-sm">
                      {row.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-sm text-muted-foreground">
                      {row.avgWatchTime}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${row.completionRate}%` }}
                          />
                        </div>
                        <span className="w-10 text-right tabular-nums text-sm">
                          {row.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-green-600" />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      No content found matching &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
