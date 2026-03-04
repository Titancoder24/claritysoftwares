"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Monitor,
  Film,
  BookOpen,
  Library,
  GraduationCap,
  Code2,
  ArrowRight,
  Check,
  MousePointerClick,
  Sparkles,
  Wand2,
  Layers,
  Play,
  Globe,
  BarChart3,
  Palette,
  Lock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ------------------------------------------------------------------ */
/*  Feature section data                                               */
/* ------------------------------------------------------------------ */

interface FeatureSection {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
  features: { icon: React.ElementType; title: string; desc: string }[];
  mockup: React.ReactNode;
}

const featureSections: FeatureSection[] = [
  {
    id: "recording",
    icon: Monitor,
    badge: "Recording",
    title: "Capture everything with one click",
    description:
      "Record your screen, webcam, and audio simultaneously. Our recorder automatically tracks your cursor and detects interactions for smart editing later.",
    features: [
      { icon: Monitor, title: "Screen & webcam capture", desc: "Record browser tabs, full desktop, or specific windows with optional webcam overlay." },
      { icon: MousePointerClick, title: "Smart interaction tracking", desc: "Every click, scroll, and keystroke is logged for automatic guide generation." },
      { icon: Sparkles, title: "Background removal", desc: "AI-powered background removal for your webcam feed, no green screen needed." },
      { icon: Layers, title: "Multi-source audio", desc: "Capture system audio and microphone simultaneously with noise cancellation." },
    ],
    mockup: (
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-[11px] font-medium text-red-400">Recording</span>
          <span className="ml-auto text-[11px] tabular-nums text-zinc-500">02:34</span>
        </div>
        <div className="relative h-52 bg-zinc-900">
          <div className="absolute inset-4 rounded-lg bg-zinc-800/50" />
          <div className="absolute bottom-3 right-3 h-16 w-16 rounded-full bg-zinc-700 ring-2 ring-indigo-500" />
          <div className="absolute left-8 top-8 h-3 w-3 animate-pulse rounded-full bg-indigo-500" />
        </div>
      </div>
    ),
  },
  {
    id: "editing",
    icon: Film,
    badge: "Editing",
    title: "Cinematic quality, zero effort",
    description:
      "Transform raw screen recordings into polished product videos. AI generates zoom animations, smooth cursor movements, and professional transitions automatically.",
    features: [
      { icon: Wand2, title: "AI cinematic zooms", desc: "Automatically generate professional zoom-and-pan animations from your cursor activity." },
      { icon: MousePointerClick, title: "Cursor smoothing", desc: "Shaky, erratic cursor movements are transformed into smooth, professional motion paths." },
      { icon: Play, title: "Transitions library", desc: "A curated library of transitions, from subtle crossfades to dynamic animations." },
      { icon: Palette, title: "Custom branding", desc: "Add your logo, brand colors, intro/outro screens, and custom watermarks." },
    ],
    mockup: (
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-2.5">
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
        </div>
        <div className="flex h-52">
          <div className="flex-1 p-3">
            <div className="h-full rounded-lg bg-zinc-800/50 p-2">
              <div className="flex h-full items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-indigo-500/20 ring-2 ring-indigo-500/30 flex items-center justify-center">
                  <Play className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-40 border-l border-zinc-800 p-3 space-y-2">
            <div className="h-3 w-full rounded bg-zinc-800" />
            <div className="h-3 w-2/3 rounded bg-zinc-800" />
            <div className="mt-3 h-7 rounded bg-indigo-500/15" />
            <div className="h-7 rounded bg-violet-500/15" />
            <div className="h-7 rounded bg-zinc-800/50" />
          </div>
        </div>
        <div className="border-t border-zinc-800 p-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="h-5 flex-1 rounded-sm bg-indigo-500/20" style={{ opacity: 0.3 + Math.random() * 0.7 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "guides",
    icon: BookOpen,
    badge: "Step-by-Step Guides",
    title: "Documentation on autopilot",
    description:
      "ScreenFlow analyzes your recording to automatically generate beautiful step-by-step guides with annotated screenshots and clear instructions.",
    features: [
      { icon: Sparkles, title: "Auto-generation", desc: "Guides are created automatically from your recording. Every click becomes a step." },
      { icon: BookOpen, title: "Rich text editor", desc: "Edit, reorder, and enhance steps with a powerful Notion-like editor." },
      { icon: Globe, title: "Instant publishing", desc: "Publish guides to your knowledge base or export as PDF/HTML with one click." },
      { icon: Palette, title: "Custom styling", desc: "Match your brand with custom colors, fonts, logos, and layouts." },
    ],
    mockup: (
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-400">
              {step}
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-zinc-700" />
              <div className="h-20 rounded-lg bg-zinc-800/50 border border-zinc-800" />
              <div className="h-2.5 w-full rounded bg-zinc-800/70" />
              <div className="h-2.5 w-2/3 rounded bg-zinc-800/70" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "knowledge-base",
    icon: Library,
    badge: "Knowledge Base",
    title: "A home for all your content",
    description:
      "Create a branded self-service portal where customers find answers. Organize videos, guides, and walkthroughs into structured collections.",
    features: [
      { icon: Library, title: "Structured collections", desc: "Organize content into categories, tags, and hierarchical collections." },
      { icon: Globe, title: "Custom domain", desc: "Host your knowledge base on your own domain with full SSL support." },
      { icon: BarChart3, title: "Search analytics", desc: "See what customers are searching for and identify content gaps." },
      { icon: Lock, title: "Access control", desc: "Make content public, private, or restricted to specific user groups." },
    ],
    mockup: (
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 p-4">
          <div className="mx-auto h-4 w-48 rounded bg-zinc-800" />
          <div className="mx-auto mt-3 h-8 w-72 rounded-lg bg-zinc-800/50 border border-zinc-800" />
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          {["Getting Started", "API Reference", "Best Practices", "Troubleshooting"].map((title) => (
            <div key={title} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="h-2.5 w-20 rounded bg-zinc-700" />
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded bg-zinc-800" />
                <div className="h-2 w-3/4 rounded bg-zinc-800" />
              </div>
              <div className="mt-2 text-[10px] text-zinc-600">{Math.floor(3 + Math.random() * 12)} articles</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "academy",
    icon: GraduationCap,
    badge: "Academy",
    title: "Build learning experiences",
    description:
      "Create structured courses with learning paths, progress tracking, quizzes, and certificates. Turn your content into a customer education platform.",
    features: [
      { icon: GraduationCap, title: "Learning paths", desc: "Create multi-course learning journeys with prerequisites and milestones." },
      { icon: BarChart3, title: "Progress tracking", desc: "Track learner progress, completion rates, and quiz scores in real-time." },
      { icon: Sparkles, title: "Quizzes & assessments", desc: "Add interactive quizzes to validate understanding and reinforce learning." },
      { icon: Palette, title: "Certificates", desc: "Award branded certificates upon course completion with custom designs." },
    ],
    mockup: (
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <div className="h-3 w-32 rounded bg-zinc-700" />
            <div className="mt-1 h-2 w-20 rounded bg-zinc-800" />
          </div>
        </div>
        <div className="space-y-2">
          {["Introduction", "Core Concepts", "Advanced Topics", "Final Quiz"].map((mod, i) => (
            <div key={mod} className="flex items-center gap-3 rounded-lg bg-zinc-900/50 px-3 py-2.5">
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${i < 2 ? "border-indigo-500 bg-indigo-500" : "border-zinc-600"}`}>
                {i < 2 && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-xs text-zinc-400">{mod}</span>
              {i === 2 && <span className="ml-auto text-[10px] text-indigo-400">In progress</span>}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
            <span>Progress</span>
            <span>50%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-1/2 rounded-full bg-indigo-500" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "widget",
    icon: Code2,
    badge: "Embeddable Widget",
    title: "Contextual help, everywhere",
    description:
      "Embed a lightweight JavaScript widget in your app to surface relevant videos, guides, and walkthroughs based on where the user is in your product.",
    features: [
      { icon: Code2, title: "Simple integration", desc: "Add a single script tag to your app. No framework dependencies required." },
      { icon: Layers, title: "Context-aware", desc: "Automatically surfaces content relevant to the current page or user action." },
      { icon: Palette, title: "Fully customizable", desc: "Match your app's design system with custom themes, positioning, and triggers." },
      { icon: BarChart3, title: "Usage analytics", desc: "Track which help content is viewed, when, and correlate with user engagement." },
    ],
    mockup: (
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 h-64">
        <div className="p-4 space-y-2">
          <div className="h-3 w-48 rounded bg-zinc-800" />
          <div className="h-3 w-36 rounded bg-zinc-800" />
          <div className="h-24 rounded-lg bg-zinc-800/30 mt-3" />
        </div>
        <div className="absolute bottom-3 right-3 w-56 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded bg-indigo-500/20 flex items-center justify-center">
              <Play className="h-2.5 w-2.5 text-indigo-400" />
            </div>
            <div className="h-2.5 w-28 rounded bg-zinc-700" />
          </div>
          <div className="space-y-1.5">
            {["Setup your workspace", "Import your data", "Configure settings"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded bg-zinc-800/50 px-2 py-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500/40" />
                <span className="text-[10px] text-zinc-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FeaturesPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)",
            }}
          />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative mx-auto max-w-3xl px-6 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              educate at scale
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 text-lg text-zinc-400"
          >
            From recording to delivery, ScreenFlow is the complete platform for
            product tutorials, documentation, and customer education.
          </motion.p>
        </motion.div>
      </section>

      {/* Feature sections */}
      {featureSections.map((section, sectionIdx) => (
        <motion.section
          key={section.id}
          id={section.id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mx-auto max-w-7xl px-6 py-20"
        >
          <div
            className={`grid items-center gap-12 lg:grid-cols-2 ${
              sectionIdx % 2 === 1 ? "lg:[direction:rtl]" : ""
            }`}
          >
            {/* Text */}
            <div className={sectionIdx % 2 === 1 ? "lg:[direction:ltr]" : ""}>
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
              >
                <section.icon className="h-3.5 w-3.5" />
                {section.badge}
              </motion.div>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl"
              >
                {section.title}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-3 leading-relaxed text-zinc-400"
              >
                {section.description}
              </motion.p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {section.features.map((feat, fi) => (
                  <motion.div
                    key={feat.title}
                    variants={fadeUp}
                    custom={fi + 3}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <feat.icon className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm font-medium text-zinc-200">
                        {feat.title}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-500 pl-6">
                      {feat.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mockup */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className={sectionIdx % 2 === 1 ? "lg:[direction:ltr]" : ""}
            >
              {section.mockup}
            </motion.div>
          </div>
        </motion.section>
      ))}

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)",
            }}
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative mx-auto max-w-2xl px-6 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to transform your content?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-400">
            Start creating cinematic tutorials and documentation in minutes.
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={2}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-700 px-7 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800/50"
            >
              View Pricing
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
