"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
  MoreHorizontal,
  GraduationCap,
  Video,
  FileText,
  BarChart3,
  Filter,
  ArrowUpRight,
  Pencil,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CourseStatus = "all" | "published" | "draft";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "published" | "draft";
  lessonCount: number;
  moduleCount: number;
  enrollmentCount: number;
  completionRate: number;
  duration: string;
  updatedAt: string;
  category: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Getting Started with ScreenFlow",
    description: "Learn the fundamentals of screen recording, editing, and sharing with ScreenFlow.",
    thumbnail: "/api/placeholder/course-1",
    status: "published",
    lessonCount: 12,
    moduleCount: 4,
    enrollmentCount: 234,
    completionRate: 78,
    duration: "2h 45m",
    updatedAt: "2 days ago",
    category: "Onboarding",
  },
  {
    id: "2",
    title: "Advanced Editing Techniques",
    description: "Master advanced editing workflows including multi-track editing, effects, and animations.",
    thumbnail: "/api/placeholder/course-2",
    status: "published",
    lessonCount: 18,
    moduleCount: 6,
    enrollmentCount: 156,
    completionRate: 62,
    duration: "4h 20m",
    updatedAt: "5 days ago",
    category: "Advanced",
  },
  {
    id: "3",
    title: "Team Collaboration Guide",
    description: "Best practices for team-based video production and review workflows.",
    thumbnail: "/api/placeholder/course-3",
    status: "draft",
    lessonCount: 8,
    moduleCount: 3,
    enrollmentCount: 0,
    completionRate: 0,
    duration: "1h 30m",
    updatedAt: "1 day ago",
    category: "Teams",
  },
  {
    id: "4",
    title: "Video Production Mastery",
    description: "Professional video production techniques including lighting, audio, and post-processing.",
    thumbnail: "/api/placeholder/course-4",
    status: "published",
    lessonCount: 24,
    moduleCount: 8,
    enrollmentCount: 89,
    completionRate: 45,
    duration: "6h 10m",
    updatedAt: "1 week ago",
    category: "Production",
  },
  {
    id: "5",
    title: "Analytics & Reporting",
    description: "Understand viewer analytics, engagement metrics, and how to optimize your content.",
    thumbnail: "/api/placeholder/course-5",
    status: "draft",
    lessonCount: 6,
    moduleCount: 2,
    enrollmentCount: 0,
    completionRate: 0,
    duration: "55m",
    updatedAt: "3 days ago",
    category: "Analytics",
  },
  {
    id: "6",
    title: "Customer Onboarding Template",
    description: "A ready-to-use template for creating customer onboarding video courses.",
    thumbnail: "/api/placeholder/course-6",
    status: "published",
    lessonCount: 10,
    moduleCount: 3,
    enrollmentCount: 312,
    completionRate: 85,
    duration: "1h 50m",
    updatedAt: "4 days ago",
    category: "Templates",
  },
];

const TABS: { label: string; value: CourseStatus }[] = [
  { label: "All Courses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Onboarding: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Advanced: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Teams: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Production: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Analytics: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Templates: "bg-pink-500/15 text-pink-400 border-pink-500/20",
};

function CourseThumbnail({ course }: { course: Course }) {
  const gradients = [
    "from-indigo-600 to-violet-600",
    "from-violet-600 to-purple-600",
    "from-blue-600 to-indigo-600",
    "from-emerald-600 to-teal-600",
    "from-amber-600 to-orange-600",
    "from-pink-600 to-rose-600",
  ];
  const idx = parseInt(course.id, 10) % gradients.length;

  return (
    <div
      className={cn(
        "relative h-40 w-full rounded-t-xl bg-gradient-to-br overflow-hidden",
        gradients[idx]
      )}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          {course.category === "Production" ? (
            <Video className="h-7 w-7 text-white/80" />
          ) : course.category === "Analytics" ? (
            <BarChart3 className="h-7 w-7 text-white/80" />
          ) : (
            <BookOpen className="h-7 w-7 text-white/80" />
          )}
        </div>
      </div>
      <div className="absolute right-3 top-3">
        <Badge
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider border",
            course.status === "published"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
          )}
        >
          {course.status}
        </Badge>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20">
      <CourseThumbnail course={course} />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span
            className={cn(
              "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
              CATEGORY_COLORS[course.category] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/20"
            )}
          >
            {course.category}
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-border bg-zinc-900 p-1 shadow-xl shadow-black/40">
                  <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Course
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
                    <Copy className="h-3.5 w-3.5" />
                    Duplicate
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className="mb-1.5 text-[15px] font-semibold text-foreground leading-snug">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-auto flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessonCount} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          {course.status === "published" && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {course.enrollmentCount}
            </span>
          )}
        </div>

        {course.status === "published" && (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium text-foreground">{course.completionRate}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${course.completionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcademyDashboardPage() {
  const [activeTab, setActiveTab] = useState<CourseStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesTab = activeTab === "all" || course.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    totalCourses: MOCK_COURSES.length,
    published: MOCK_COURSES.filter((c) => c.status === "published").length,
    totalEnrollments: MOCK_COURSES.reduce((acc, c) => acc + c.enrollmentCount, 0),
    avgCompletion: Math.round(
      MOCK_COURSES.filter((c) => c.status === "published").reduce((acc, c) => acc + c.completionRate, 0) /
        MOCK_COURSES.filter((c) => c.status === "published").length
    ),
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Training Academy</h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage learning content for your team and customers
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="md" asChild>
              <a href="/academy/analytics">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </a>
            </Button>
            <Button size="md">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="border-b border-border px-8 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
              <BookOpen className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Courses</p>
              <p className="text-lg font-semibold text-foreground">{stats.totalCourses}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Published</p>
              <p className="text-lg font-semibold text-foreground">{stats.published}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
              <Users className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Enrollments</p>
              <p className="text-lg font-semibold text-foreground">{stats.totalEnrollments}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <BarChart3 className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Completion</p>
              <p className="text-lg font-semibold text-foreground">{stats.avgCompletion}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-8 py-3">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
                activeTab === tab.value
                  ? "bg-zinc-800 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
              )}
            >
              {tab.label}
              {tab.value === "all" && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {MOCK_COURSES.length}
                </span>
              )}
              {tab.value === "published" && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {MOCK_COURSES.filter((c) => c.status === "published").length}
                </span>
              )}
              {tab.value === "draft" && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {MOCK_COURSES.filter((c) => c.status === "draft").length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search courses..."
            icon={<Search className="h-4 w-4" />}
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="flex-1 overflow-auto p-8">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">No courses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first course to get started"}
            </p>
            {!searchQuery && (
              <Button className="mt-4" size="md">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
