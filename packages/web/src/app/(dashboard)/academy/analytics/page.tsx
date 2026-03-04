"use client";

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  Search,
  Download,
  Eye,
  Clock,
  Award,
  Target,
  Activity,
  ArrowLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ENROLLMENT_DATA = [
  { date: "Jan", enrollments: 45, completions: 32 },
  { date: "Feb", enrollments: 62, completions: 41 },
  { date: "Mar", enrollments: 78, completions: 55 },
  { date: "Apr", enrollments: 95, completions: 68 },
  { date: "May", enrollments: 112, completions: 82 },
  { date: "Jun", enrollments: 134, completions: 95 },
  { date: "Jul", enrollments: 156, completions: 112 },
  { date: "Aug", enrollments: 142, completions: 108 },
  { date: "Sep", enrollments: 168, completions: 125 },
  { date: "Oct", enrollments: 189, completions: 140 },
  { date: "Nov", enrollments: 210, completions: 158 },
  { date: "Dec", enrollments: 234, completions: 175 },
];

const COURSE_COMPLETION_DATA = [
  { name: "Getting Started", completionRate: 78, enrollments: 234, avgScore: 85 },
  { name: "Customer Onboarding", completionRate: 85, enrollments: 312, avgScore: 88 },
  { name: "Advanced Editing", completionRate: 62, enrollments: 156, avgScore: 76 },
  { name: "Video Production", completionRate: 45, enrollments: 89, avgScore: 72 },
  { name: "Team Collaboration", completionRate: 71, enrollments: 98, avgScore: 81 },
  { name: "Analytics & Reporting", completionRate: 55, enrollments: 67, avgScore: 79 },
];

const COURSE_TABLE_DATA = [
  {
    id: "1",
    name: "Getting Started with ScreenFlow",
    enrollments: 234,
    activelearners: 45,
    completionRate: 78,
    avgScore: 85,
    avgTime: "2h 12m",
    certificates: 182,
    trend: "up" as const,
    trendValue: "+12%",
  },
  {
    id: "2",
    name: "Customer Onboarding Template",
    enrollments: 312,
    activelearners: 67,
    completionRate: 85,
    avgScore: 88,
    avgTime: "1h 45m",
    certificates: 265,
    trend: "up" as const,
    trendValue: "+8%",
  },
  {
    id: "3",
    name: "Advanced Editing Techniques",
    enrollments: 156,
    activelearners: 38,
    completionRate: 62,
    avgScore: 76,
    avgTime: "3h 40m",
    certificates: 97,
    trend: "down" as const,
    trendValue: "-3%",
  },
  {
    id: "4",
    name: "Video Production Mastery",
    enrollments: 89,
    activelearners: 22,
    completionRate: 45,
    avgScore: 72,
    avgTime: "5h 30m",
    certificates: 40,
    trend: "up" as const,
    trendValue: "+5%",
  },
  {
    id: "5",
    name: "Team Collaboration Guide",
    enrollments: 98,
    activelearners: 15,
    completionRate: 71,
    avgScore: 81,
    avgTime: "1h 20m",
    certificates: 0,
    trend: "up" as const,
    trendValue: "+18%",
  },
];

const LEARNER_DATA = [
  { id: "1", name: "Alice Thompson", email: "alice@example.com", coursesEnrolled: 3, coursesCompleted: 2, avgScore: 92, lastActive: "2 hours ago", status: "active" },
  { id: "2", name: "Bob Martinez", email: "bob@example.com", coursesEnrolled: 2, coursesCompleted: 1, avgScore: 85, lastActive: "1 day ago", status: "active" },
  { id: "3", name: "Carol Zhang", email: "carol@example.com", coursesEnrolled: 4, coursesCompleted: 4, avgScore: 95, lastActive: "3 hours ago", status: "active" },
  { id: "4", name: "David Kim", email: "david@example.com", coursesEnrolled: 1, coursesCompleted: 0, avgScore: 0, lastActive: "1 week ago", status: "inactive" },
  { id: "5", name: "Eva Petrova", email: "eva@example.com", coursesEnrolled: 3, coursesCompleted: 2, avgScore: 78, lastActive: "5 hours ago", status: "active" },
  { id: "6", name: "Frank Wilson", email: "frank@example.com", coursesEnrolled: 2, coursesCompleted: 2, avgScore: 88, lastActive: "12 hours ago", status: "active" },
];

type TabValue = "overview" | "courses" | "learners";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-zinc-900 px-3 py-2 shadow-xl shadow-black/40">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  change,
  changeType,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconBg)}>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              changeType === "up" ? "text-emerald-400" : "text-red-400"
            )}
          >
            {changeType === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AcademyAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [timeRange, setTimeRange] = useState("12 months");
  const [searchQuery, setSearchQuery] = useState("");

  const TABS: { label: string; value: TabValue }[] = [
    { label: "Overview", value: "overview" },
    { label: "Courses", value: "courses" },
    { label: "Learners", value: "learners" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/academy">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Academy Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Track learner engagement, completion rates, and course performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground transition-colors hover:border-zinc-600">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {timeRange}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <Button variant="outline" size="md">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-border px-8 py-5">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            iconColor="text-indigo-400"
            iconBg="bg-indigo-500/10"
            label="Total Enrollments"
            value="891"
            change="+12.5%"
            changeType="up"
          />
          <StatCard
            icon={Activity}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10"
            label="Active Learners"
            value="187"
            change="+8.2%"
            changeType="up"
          />
          <StatCard
            icon={Target}
            iconColor="text-violet-400"
            iconBg="bg-violet-500/10"
            label="Completion Rate"
            value="68%"
            change="+3.1%"
            changeType="up"
          />
          <StatCard
            icon={Award}
            iconColor="text-amber-400"
            iconBg="bg-amber-500/10"
            label="Avg Quiz Score"
            value="82%"
            change="-1.2%"
            changeType="down"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-8">
        <div className="flex items-center gap-1 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all",
                activeTab === tab.value
                  ? "bg-zinc-800 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Enrollment Trends Chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Enrollment Trends</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enrollments and completions over time
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Enrollments
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    Completions
                  </span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ENROLLMENT_DATA}>
                    <defs>
                      <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="completeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#enrollGrad)"
                      name="Enrollments"
                    />
                    <Area
                      type="monotone"
                      dataKey="completions"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#completeGrad)"
                      name="Completions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Completion Rates by Course Chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground">Completion Rates by Course</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Percentage of enrolled learners who completed each course
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={COURSE_COMPLETION_DATA} layout="vertical" barCategoryGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#a1a1aa", fontSize: 12 }}
                      width={140}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="completionRate"
                      fill="#6366f1"
                      radius={[0, 4, 4, 0]}
                      name="Completion Rate"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search courses..."
                icon={<Search className="h-4 w-4" />}
                className="w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Course
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Enrolled
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Active
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Completion
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Score
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Time
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Certificates
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COURSE_TABLE_DATA.filter(
                    (c) =>
                      !searchQuery ||
                      c.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-border transition-colors hover:bg-zinc-900/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                            <BookOpen className="h-4 w-4 text-indigo-400" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {course.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {course.enrollments}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {course.activelearners}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              style={{ width: `${course.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-foreground">{course.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {course.avgScore}%
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                        {course.avgTime}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {course.certificates > 0 ? (
                          <span className="flex items-center justify-end gap-1">
                            <Award className="h-3.5 w-3.5 text-amber-400" />
                            {course.certificates}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            "flex items-center justify-end gap-0.5 text-xs font-medium",
                            course.trend === "up" ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {course.trend === "up" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {course.trendValue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "learners" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search learners..."
                icon={<Search className="h-4 w-4" />}
                className="w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Learner
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Enrolled
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Score
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Last Active
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LEARNER_DATA.filter(
                    (l) =>
                      !searchQuery ||
                      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      l.email.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((learner) => (
                    <tr
                      key={learner.id}
                      className="border-b border-border transition-colors hover:bg-zinc-900/30 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white">
                            {learner.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{learner.name}</p>
                            <p className="text-xs text-muted-foreground">{learner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {learner.coursesEnrolled}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {learner.coursesCompleted}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {learner.avgScore > 0 ? `${learner.avgScore}%` : "--"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                        {learner.lastActive}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          variant={learner.status === "active" ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {learner.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
