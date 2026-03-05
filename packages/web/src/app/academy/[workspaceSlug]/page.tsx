"use client";

import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
  GraduationCap,
  Video,
  FileText,
  BarChart3,
  Filter,
  Star,
  ChevronDown,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PublicCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  lessonCount: number;
  moduleCount: number;
  duration: string;
  enrollmentCount: number;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  hasCertificate: boolean;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
}

const MOCK_COURSES: PublicCourse[] = [
  {
    id: "1",
    slug: "getting-started",
    title: "Getting Started with ScreenFlow",
    description: "Learn the fundamentals of screen recording, editing, and sharing. Perfect for new users who want to get up and running quickly.",
    category: "Onboarding",
    lessonCount: 12,
    moduleCount: 4,
    duration: "2h 45m",
    enrollmentCount: 1234,
    rating: 4.8,
    level: "Beginner",
    hasCertificate: true,
    thumbnail: "",
    instructor: { name: "Sarah Chen", avatar: "" },
  },
  {
    id: "2",
    slug: "advanced-editing",
    title: "Advanced Editing Techniques",
    description: "Master multi-track editing, effects, animations, and professional post-production workflows for stunning videos.",
    category: "Advanced",
    lessonCount: 18,
    moduleCount: 6,
    duration: "4h 20m",
    enrollmentCount: 856,
    rating: 4.9,
    level: "Advanced",
    hasCertificate: true,
    thumbnail: "",
    instructor: { name: "Alex Morgan", avatar: "" },
  },
  {
    id: "3",
    slug: "team-collaboration",
    title: "Team Collaboration Guide",
    description: "Best practices for team-based video production, review workflows, shared libraries, and permission management.",
    category: "Teams",
    lessonCount: 8,
    moduleCount: 3,
    duration: "1h 30m",
    enrollmentCount: 543,
    rating: 4.7,
    level: "Intermediate",
    hasCertificate: false,
    thumbnail: "",
    instructor: { name: "Jamie Lee", avatar: "" },
  },
  {
    id: "4",
    slug: "video-production-mastery",
    title: "Video Production Mastery",
    description: "Professional video production from start to finish, including lighting, audio capture, scripting, and post-processing.",
    category: "Production",
    lessonCount: 24,
    moduleCount: 8,
    duration: "6h 10m",
    enrollmentCount: 432,
    rating: 4.9,
    level: "Advanced",
    hasCertificate: true,
    thumbnail: "",
    instructor: { name: "Marcus Johnson", avatar: "" },
  },
  {
    id: "5",
    slug: "analytics-reporting",
    title: "Analytics & Reporting",
    description: "Understand viewer analytics, engagement metrics, A/B testing, and how to optimize your video content strategy.",
    category: "Analytics",
    lessonCount: 10,
    moduleCount: 3,
    duration: "1h 50m",
    enrollmentCount: 321,
    rating: 4.6,
    level: "Intermediate",
    hasCertificate: false,
    thumbnail: "",
    instructor: { name: "Priya Sharma", avatar: "" },
  },
  {
    id: "6",
    slug: "customer-onboarding",
    title: "Customer Onboarding Template",
    description: "A comprehensive template for creating engaging customer onboarding video courses that drive adoption and retention.",
    category: "Templates",
    lessonCount: 10,
    moduleCount: 3,
    duration: "1h 50m",
    enrollmentCount: 765,
    rating: 4.8,
    level: "Beginner",
    hasCertificate: true,
    thumbnail: "",
    instructor: { name: "Sarah Chen", avatar: "" },
  },
];

const CATEGORIES = ["All", "Onboarding", "Advanced", "Teams", "Production", "Analytics", "Templates"];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Advanced: "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

const GRADIENT_MAP: Record<number, string> = {
  0: "from-green-600 to-emerald-600",
  1: "from-violet-600 to-purple-600",
  2: "from-blue-600 to-green-600",
  3: "from-emerald-600 to-teal-600",
  4: "from-amber-600 to-orange-600",
  5: "from-pink-600 to-rose-600",
};

function CourseCard({ course, workspaceSlug }: { course: PublicCourse; workspaceSlug: string }) {
  const gradIdx = parseInt(course.id, 10) % 6;

  return (
    <a
      href={`/academy/${workspaceSlug}/${course.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card transition-all duration-200 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/60"
    >
      {/* Thumbnail */}
      <div
        className={cn(
          "relative h-44 w-full rounded-t-xl bg-gradient-to-br overflow-hidden",
          GRADIENT_MAP[gradIdx]
        )}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition-transform group-hover:scale-110">
            <BookOpen className="h-7 w-7 text-white/80" />
          </div>
        </div>
        {course.hasCertificate && (
          <div className="absolute left-3 top-3">
            <div className="flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 text-[10px] font-medium text-white/80">
              <Award className="h-3 w-3" />
              Certificate
            </div>
          </div>
        )}
        <div className="absolute right-3 top-3">
          <span
            className={cn(
              "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium",
              LEVEL_COLORS[course.level]
            )}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-green-600">
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-foreground">{course.rating}</span>
          </div>
        </div>

        <h3 className="mb-1.5 text-[15px] font-semibold text-foreground leading-snug group-hover:text-green-600 transition-colors">
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
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {course.enrollmentCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-[10px] font-bold text-white">
              {course.instructor.name.charAt(0)}
            </div>
            <span className="text-xs text-muted-foreground">{course.instructor.name}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-green-600 opacity-0 transition-opacity group-hover:opacity-100">
            Enroll <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function PublicAcademyCatalogPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  const resolvedParams = React.use(params);
  const workspaceSlug = resolvedParams.workspaceSlug;

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || course.level === levelFilter;
    return matchesCategory && matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">ScreenFlow Academy</h1>
                <p className="text-xs text-muted-foreground">Learn at your own pace</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                My Courses
              </Button>
              <Button variant="ghost" size="sm">
                Certificates
              </Button>
              <Button size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <Badge className="mb-4">{MOCK_COURSES.length} Courses Available</Badge>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Master ScreenFlow.{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Learn Everything.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Free courses, tutorials, and certifications to help you become a video production expert.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <Input
              placeholder="Search courses..."
              icon={<Search className="h-4 w-4" />}
              className="h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all",
                    activeCategory === cat
                      ? "bg-slate-100 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(levelFilter === level ? null : level)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
                    levelFilter === level
                      ? "border-green-500/30 bg-green-500/10 text-green-600"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-slate-300"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {filteredCourses.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} workspaceSlug={workspaceSlug} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">No courses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setLevelFilter(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ScreenFlow Academy</span>
            </div>
            <p className="text-xs text-slate-400">
              Powered by ScreenFlow
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
