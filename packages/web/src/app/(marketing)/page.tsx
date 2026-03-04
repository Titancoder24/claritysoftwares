"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Monitor,
  Film,
  Rocket,
  Check,
  X,
  ChevronDown,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Users,
  BarChart3,
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

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={`relative mx-auto max-w-7xl px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="pointer-events-none absolute inset-0 -top-32">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)",
            animation: "heroGlow 8s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute left-1/3 top-32 h-[400px] w-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, #8b5cf6 0%, transparent 70%)",
            animation: "heroGlow 10s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes heroGlow {
          0% { transform: translate(-50%, 0) scale(1); }
          100% { transform: translate(-50%, -30px) scale(1.1); }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-28 sm:pt-36 lg:pt-44">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Now in public beta
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Record Once.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Create Everything.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
          >
            Turn a single screen recording into cinematic product videos,
            step-by-step guides, and interactive walkthroughs. Built for teams
            that ship fast.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-7 text-sm font-semibold text-zinc-200 transition-all hover:border-zinc-600 hover:bg-zinc-800/50">
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
              </div>
              <div className="mx-auto flex h-6 w-72 items-center justify-center rounded-md bg-zinc-800/80 text-[11px] text-zinc-500">
                app.screenflow.dev/editor
              </div>
            </div>
            {/* Editor area */}
            <div className="flex h-[340px] sm:h-[420px]">
              {/* Sidebar */}
              <div className="hidden w-56 flex-shrink-0 border-r border-zinc-800 p-4 sm:block">
                <div className="space-y-2">
                  {["Timeline", "Scenes", "Zooms", "Cursor", "Audio"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`flex h-8 items-center rounded-lg px-3 text-xs font-medium ${
                          i === 0
                            ? "bg-indigo-500/10 text-indigo-400"
                            : "text-zinc-500 hover:text-zinc-400"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-2 w-full rounded bg-zinc-800" />
                  <div className="h-2 w-3/4 rounded bg-zinc-800" />
                  <div className="h-2 w-1/2 rounded bg-zinc-800" />
                </div>
              </div>
              {/* Preview */}
              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 items-center justify-center bg-zinc-950">
                  <div className="relative h-48 w-80 rounded-lg bg-zinc-900 sm:h-56 sm:w-96">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 ring-2 ring-indigo-500/40">
                        <Play className="h-6 w-6 text-indigo-400" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                      <div className="h-1 flex-1 rounded-full bg-zinc-700">
                        <div className="h-1 w-1/3 rounded-full bg-indigo-500" />
                      </div>
                      <span className="text-[10px] text-zinc-500">1:24</span>
                    </div>
                  </div>
                </div>
                {/* Timeline */}
                <div className="border-t border-zinc-800 p-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-8 flex-1 rounded"
                        style={{
                          backgroundColor:
                            i < 7
                              ? `rgba(99,102,241,${0.2 + i * 0.05})`
                              : i < 14
                                ? `rgba(139,92,246,${0.15 + (i - 7) * 0.04})`
                                : "#18181b",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="pointer-events-none absolute -bottom-8 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  SOCIAL PROOF                                                       */
/* ================================================================== */

function SocialProof() {
  const companies = [
    "Vercel",
    "Linear",
    "Notion",
    "Stripe",
    "Figma",
    "GitLab",
    "Supabase",
    "Clerk",
  ];
  return (
    <Section className="py-20">
      <motion.p
        variants={fadeUp}
        className="text-center text-sm font-medium uppercase tracking-widest text-zinc-500"
      >
        Trusted by 2,000+ teams worldwide
      </motion.p>
      <motion.div
        variants={fadeUp}
        custom={1}
        className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8"
      >
        {companies.map((name) => (
          <div
            key={name}
            className="flex h-12 items-center justify-center rounded-lg border border-zinc-800/50 bg-zinc-900/30 text-sm font-semibold text-zinc-600 transition-colors hover:border-zinc-700 hover:text-zinc-400"
          >
            {name}
          </div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/*  THREE-COLUMN FEATURES                                              */
/* ================================================================== */

const featureCards = [
  {
    icon: Monitor,
    title: "Record",
    desc: "Screen recording with smart tracking",
    bullets: [
      "One-click browser & desktop capture",
      "Automatic cursor tracking & smoothing",
      "Webcam overlay with background removal",
      "System audio & microphone recording",
    ],
  },
  {
    icon: Film,
    title: "Edit",
    desc: "Cinematic editing, zero learning curve",
    bullets: [
      "AI-powered cinematic zoom generation",
      "Click-to-zoom smart annotations",
      "Background music & transitions",
      "Export up to 4K at 60fps",
    ],
  },
  {
    icon: Rocket,
    title: "Deliver",
    desc: "Publish once, reach everywhere",
    bullets: [
      "Branded knowledge base portals",
      "Interactive step-by-step walkthroughs",
      "Embeddable in-app widget",
      "Academy with learning paths & quizzes",
    ],
  },
];

function Features() {
  return (
    <Section className="py-24">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          One recording. Three formats.{" "}
          <span className="text-zinc-500">Infinite reach.</span>
        </h2>
        <p className="mt-4 text-zinc-400">
          ScreenFlow transforms a single screen recording into every content
          format your team needs.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {featureCards.map((f, i) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            custom={i}
            className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="inline-flex rounded-xl bg-indigo-500/10 p-3">
              <f.icon className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{f.desc}</p>
            <ul className="mt-5 space-y-2.5">
              {f.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  PRODUCT SHOWCASE (Tabs)                                            */
/* ================================================================== */

const showcaseTabs = [
  {
    id: "editor",
    label: "Video Editor",
    content: {
      title: "Cinematic videos from raw recordings",
      desc: "Auto-generate zooms, smooth cursors, add annotations and transitions. Export stunning product videos in minutes.",
      mockup: (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-40 flex-1 rounded-lg bg-zinc-800/50" />
            <div className="w-48 space-y-2 rounded-lg bg-zinc-800/30 p-3">
              <div className="h-3 w-full rounded bg-zinc-700" />
              <div className="h-3 w-2/3 rounded bg-zinc-700" />
              <div className="mt-4 h-8 rounded bg-indigo-500/20" />
              <div className="h-8 rounded bg-zinc-700/50" />
            </div>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-6 flex-1 rounded-sm bg-indigo-500/20" />
            ))}
          </div>
        </div>
      ),
    },
  },
  {
    id: "guide",
    label: "Step-by-Step Guide",
    content: {
      title: "Auto-generated documentation",
      desc: "ScreenFlow detects every click and keystroke, generating beautiful step-by-step guides with annotated screenshots automatically.",
      mockup: (
        <div className="space-y-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-400">
                {step}
              </div>
              <div className="flex-1">
                <div className="h-3 w-48 rounded bg-zinc-700" />
                <div className="mt-2 h-24 rounded-lg bg-zinc-800/50" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    id: "walkthrough",
    label: "Interactive Walkthrough",
    content: {
      title: "Hands-on product tours",
      desc: "Let users click through your product with guided hotspots, tooltips, and progress tracking. Embed anywhere.",
      mockup: (
        <div className="relative rounded-lg bg-zinc-800/40 p-6">
          <div className="h-32 rounded bg-zinc-700/30" />
          <div className="absolute right-8 top-10 rounded-lg border border-indigo-500/30 bg-zinc-900 p-3 shadow-xl">
            <div className="h-2 w-24 rounded bg-zinc-600" />
            <div className="mt-1.5 h-2 w-16 rounded bg-zinc-700" />
            <div className="mt-3 h-6 w-20 rounded bg-indigo-500/30" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-zinc-700">
              <div className="h-1.5 w-2/5 rounded-full bg-indigo-500" />
            </div>
            <span className="text-xs text-zinc-500">Step 2 of 5</span>
          </div>
        </div>
      ),
    },
  },
];

function ProductShowcase() {
  const [active, setActive] = React.useState("editor");
  const current = showcaseTabs.find((t) => t.id === active)!;

  return (
    <Section className="py-24">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          See it in action
        </h2>
        <p className="mt-4 text-zinc-400">
          Three powerful outputs from a single recording session.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} className="mt-12">
        {/* Tab bar */}
        <div className="mx-auto flex w-fit gap-1 rounded-xl bg-zinc-900 p-1">
          {showcaseTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                active === tab.id
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">{current.content.title}</h3>
              <p className="mt-3 leading-relaxed text-zinc-400">
                {current.content.desc}
              </p>
              <Link
                href="/features"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              {current.content.mockup}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/*  COMPARISON TABLE                                                   */
/* ================================================================== */

const competitors = ["ScreenFlow", "Tango", "Clueso", "Trainn", "Loom"];
const comparisonRows = [
  { feature: "Screen Recording", values: [true, true, true, true, true] },
  { feature: "AI Cinematic Zooms", values: [true, false, false, false, false] },
  { feature: "Cursor Smoothing", values: [true, false, true, false, false] },
  { feature: "Step-by-Step Guides", values: [true, true, true, true, false] },
  { feature: "Interactive Walkthroughs", values: [true, false, false, true, false] },
  { feature: "Knowledge Base", values: [true, false, false, false, false] },
  { feature: "Learning Academy", values: [true, false, false, true, false] },
  { feature: "Embeddable Widget", values: [true, false, false, false, false] },
  { feature: "Custom Branding", values: [true, true, true, true, false] },
  { feature: "Analytics Dashboard", values: [true, false, true, true, true] },
  { feature: "4K Export", values: [true, false, false, false, true] },
  { feature: "API Access", values: [true, false, false, true, false] },
];

function ComparisonTable() {
  return (
    <Section className="py-24">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How we compare
        </h2>
        <p className="mt-4 text-zinc-400">
          ScreenFlow is the only platform that does it all.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        custom={1}
        className="mt-12 overflow-x-auto"
      >
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-4 pr-4 text-left text-sm font-medium text-zinc-400">
                Feature
              </th>
              {competitors.map((c, i) => (
                <th
                  key={c}
                  className={`px-4 py-4 text-center text-sm font-semibold ${
                    i === 0 ? "text-indigo-400" : "text-zinc-400"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr
                key={row.feature}
                className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/50"
              >
                <td className="py-3.5 pr-4 text-sm text-zinc-300">
                  {row.feature}
                </td>
                {row.values.map((v, i) => (
                  <td key={i} className="px-4 py-3.5 text-center">
                    {v ? (
                      <Check
                        className={`mx-auto h-4.5 w-4.5 ${
                          i === 0 ? "text-indigo-400" : "text-zinc-500"
                        }`}
                      />
                    ) : (
                      <X className="mx-auto h-4.5 w-4.5 text-zinc-700" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/*  PRICING                                                            */
/* ================================================================== */

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For individuals getting started",
    cta: "Get Started",
    popular: false,
    features: [
      "5 recordings / month",
      "720p export",
      "Basic editing tools",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For creators and solopreneurs",
    cta: "Start Free Trial",
    popular: false,
    features: [
      "Unlimited recordings",
      "1080p export",
      "AI cinematic zooms",
      "Step-by-step guides",
      "Custom branding",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$79",
    desc: "For growing teams",
    cta: "Start Free Trial",
    popular: true,
    features: [
      "Everything in Pro",
      "4K export at 60fps",
      "Knowledge base portal",
      "Interactive walkthroughs",
      "Team collaboration",
      "Analytics dashboard",
      "API access",
    ],
  },
  {
    name: "Business",
    price: "$149",
    desc: "For scaling organizations",
    cta: "Contact Sales",
    popular: false,
    features: [
      "Everything in Team",
      "Learning academy",
      "Embeddable widget",
      "SSO / SAML",
      "Advanced analytics",
      "Dedicated success manager",
      "SLA guarantee",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large organizations",
    cta: "Contact Sales",
    popular: false,
    features: [
      "Everything in Business",
      "Unlimited seats",
      "Custom integrations",
      "On-premise deployment",
      "Custom contracts",
      "24/7 premium support",
    ],
  },
];

function Pricing() {
  return (
    <Section className="py-24" id="pricing">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-zinc-400">
          Start free, upgrade when you need to. No surprises.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            variants={fadeUp}
            custom={i}
            className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
              plan.popular
                ? "border-indigo-500/40 bg-indigo-500/[0.03] shadow-lg shadow-indigo-500/10"
                : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
            )}
            <h3 className="text-sm font-semibold text-zinc-300">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && (
                <span className="text-sm text-zinc-500">/mo</span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.name === "Enterprise" || plan.name === "Business" ? "#" : "/auth/signup"}
              className={`mt-6 flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                plan.popular
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500"
                  : "border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  FAQ                                                                */
/* ================================================================== */

const faqs = [
  {
    q: "How does ScreenFlow differ from Loom?",
    a: "While Loom focuses on async video messaging, ScreenFlow transforms a single recording into three formats: cinematic product videos, step-by-step guides, and interactive walkthroughs. Plus you get a knowledge base, academy, and embeddable widget.",
  },
  {
    q: "Can I try ScreenFlow for free?",
    a: "Absolutely. Our Free plan includes 5 recordings per month with basic editing tools. Pro and Team plans come with a 14-day free trial, no credit card required.",
  },
  {
    q: "What recording quality do you support?",
    a: "Free plans support up to 720p. Pro plans get 1080p, and Team and above get full 4K at 60fps export. All plans record at native resolution.",
  },
  {
    q: "How does the AI cinematic zoom feature work?",
    a: "Our AI analyzes your cursor movement, clicks, and focus areas to automatically generate professional-quality zoom animations. You can adjust timing and easing, or add custom zooms manually.",
  },
  {
    q: "Can I embed content in my own product?",
    a: "Yes. Team plans and above include an embeddable JavaScript widget that you can add to any web application. It supports videos, guides, and walkthroughs with full branding customization.",
  },
  {
    q: "Do you offer annual billing discounts?",
    a: "Yes. Annual plans receive a 20% discount compared to monthly billing. Contact our sales team for custom enterprise pricing.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <Section className="py-24">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
      </motion.div>

      <motion.div
        variants={fadeUp}
        custom={1}
        className="mx-auto mt-12 max-w-2xl divide-y divide-zinc-800"
      >
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-sm font-medium text-zinc-200 pr-4">
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? "max-h-48 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-sm leading-relaxed text-zinc-400">{faq.a}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/*  FINAL CTA                                                          */
/* ================================================================== */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
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
          Start creating better tutorials today
        </motion.h2>
        <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-400">
          Join 2,000+ teams already using ScreenFlow to power their product
          education.
        </motion.p>
        <motion.div variants={fadeUp} custom={2} className="mt-8">
          <Link
            href="/auth/signup"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40"
          >
            Get Started for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */

export default function LandingPage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <ProductShowcase />
      <ComparisonTable />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
