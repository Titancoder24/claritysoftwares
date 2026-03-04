"use client";

import {
  Users,
  GraduationCap,
  Trophy,
  TrendingUp,
  TrendingDown,
  BookOpen,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Enrollments",
    value: "2,847",
    change: "+12.3%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Active Learners",
    value: "1,203",
    change: "+8.1%",
    trend: "up" as const,
    icon: BookOpen,
  },
  {
    label: "Completion Rate",
    value: "68.4%",
    change: "+3.2%",
    trend: "up" as const,
    icon: GraduationCap,
  },
  {
    label: "Avg Quiz Score",
    value: "82%",
    change: "-1.5%",
    trend: "down" as const,
    icon: Trophy,
  },
];

const coursePerformance = [
  { name: "Getting Started with ScreenFlow", enrollments: 1240, completion: 78, avgScore: 88, trend: "up" },
  { name: "Advanced Video Editing", enrollments: 890, completion: 62, avgScore: 79, trend: "up" },
  { name: "Creating Step-by-Step Guides", enrollments: 675, completion: 71, avgScore: 84, trend: "down" },
  { name: "Building Your Knowledge Base", enrollments: 432, completion: 55, avgScore: 76, trend: "up" },
  { name: "Interactive Walkthroughs", enrollments: 321, completion: 48, avgScore: 81, trend: "down" },
  { name: "Analytics & Optimization", enrollments: 256, completion: 44, avgScore: 73, trend: "up" },
];

const enrollmentTrend = [
  { month: "Jul", value: 180 },
  { month: "Aug", value: 220 },
  { month: "Sep", value: 340 },
  { month: "Oct", value: 420 },
  { month: "Nov", value: 510 },
  { month: "Dec", value: 580 },
  { month: "Jan", value: 620 },
];

export default function AcademyAnalyticsPage() {
  const maxEnrollment = Math.max(...enrollmentTrend.map((d) => d.value));

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Academy Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Track learner engagement, course performance, and quiz results.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-zinc-500" />
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Enrollment trend */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-[#0c0c0f] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-white">Enrollment Trend</h2>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              +244% over 6 months
            </div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {enrollmentTrend.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-400 tabular-nums">{d.value}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-indigo-500/60 to-indigo-400/80 transition-all"
                  style={{ height: `${(d.value / maxEnrollment) * 100}%` }}
                />
                <span className="text-xs text-zinc-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion rates */}
        <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Completion by Course</h2>
          <div className="space-y-4">
            {coursePerformance.slice(0, 5).map((course) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400 truncate max-w-[180px]">
                    {course.name}
                  </span>
                  <span className="text-xs font-medium text-white">{course.completion}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                    style={{ width: `${course.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course performance table */}
      <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f]">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-zinc-500" />
            Course Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {coursePerformance.map((course) => (
                <tr key={course.name} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{course.name}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-zinc-300">{course.enrollments.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-zinc-300">{course.completion}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-zinc-300">{course.avgScore}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {course.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400 ml-auto" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400 ml-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
