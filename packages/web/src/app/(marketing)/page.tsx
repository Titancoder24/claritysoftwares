"use client";

import React from "react";
import Link from "next/link";
import {
  Monitor,
  Film,
  Rocket,
  Check,
  ChevronDown,
  Play,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Record your screen.
          <br />
          <span className="text-zinc-500">We handle the rest.</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
          ScreenFlow turns raw screen recordings into polished product videos,
          step-by-step guides, and interactive walkthroughs. One take, three
          formats.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
            <Play className="h-3.5 w-3.5" />
            Watch demo
          </button>
        </div>
      </div>

      {/* App mockup */}
      <div className="mt-16 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="mx-auto flex h-5 w-56 items-center justify-center rounded bg-zinc-800/80 text-[10px] text-zinc-500">
            app.screenflow.dev/editor
          </div>
        </div>
        {/* Editor area */}
        <div className="flex h-[300px] sm:h-[380px]">
          {/* Sidebar */}
          <div className="hidden w-48 flex-shrink-0 border-r border-zinc-800 p-3 sm:block">
            {["Timeline", "Scenes", "Zooms", "Cursor", "Audio"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`mb-0.5 flex h-7 items-center rounded px-2.5 text-xs ${
                    i === 0
                      ? "bg-indigo-500/10 font-medium text-indigo-400"
                      : "text-zinc-500"
                  }`}
                >
                  {item}
                </div>
              )
            )}
            <div className="mt-5 space-y-1.5">
              <div className="h-1.5 w-full rounded bg-zinc-800" />
              <div className="h-1.5 w-3/4 rounded bg-zinc-800" />
              <div className="h-1.5 w-1/2 rounded bg-zinc-800" />
            </div>
          </div>
          {/* Preview area */}
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="relative h-44 w-72 rounded bg-zinc-900 sm:h-52 sm:w-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 ring-1 ring-indigo-500/30">
                    <Play className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-zinc-700">
                    <div className="h-1 w-1/3 rounded-full bg-indigo-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500">1:24</span>
                </div>
              </div>
            </div>
            {/* Timeline bar */}
            <div className="border-t border-zinc-800 p-2.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 flex-1 rounded-sm"
                    style={{
                      backgroundColor:
                        i < 7
                          ? `rgba(99,102,241,${0.15 + i * 0.04})`
                          : i < 14
                            ? `rgba(139,92,246,${0.1 + (i - 7) * 0.03})`
                            : "#18181b",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURES                                                           */
/* ------------------------------------------------------------------ */

const featureCards = [
  {
    icon: Monitor,
    title: "Record",
    desc: "Browser & desktop capture with automatic cursor tracking, webcam overlay, and system audio. One click to start.",
  },
  {
    icon: Film,
    title: "Edit",
    desc: "AI generates cinematic zoom animations from your clicks. Add annotations, transitions, and export up to 4K/60fps.",
  },
  {
    icon: Rocket,
    title: "Deliver",
    desc: "Publish as video, step-by-step guide, or interactive walkthrough. Embed anywhere with a single snippet.",
  },
];

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        How it works
      </h2>
      <p className="mt-2 text-zinc-400">
        Three steps. One recording session.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {featureCards.map((f, i) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-800 p-6 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                <f.icon className="h-4.5 w-4.5 text-zinc-300" />
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
                {i + 1}
              </div>
            </div>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SHOWCASE (tabs)                                                    */
/* ------------------------------------------------------------------ */

const tabs = [
  {
    id: "editor",
    label: "Video Editor",
    title: "Cinematic videos from raw recordings",
    desc: "Auto-generated zooms, smooth cursor motion, annotations, and transitions. Export a polished product video in minutes — not hours.",
    mockup: (
      <div className="space-y-2.5">
        <div className="flex gap-2">
          <div className="h-36 flex-1 rounded bg-zinc-800/50" />
          <div className="w-40 space-y-1.5 rounded bg-zinc-800/30 p-2.5">
            <div className="h-2.5 w-full rounded bg-zinc-700" />
            <div className="h-2.5 w-2/3 rounded bg-zinc-700" />
            <div className="mt-3 h-7 rounded bg-indigo-500/20" />
            <div className="h-7 rounded bg-zinc-700/50" />
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-5 flex-1 rounded-sm bg-indigo-500/15" />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "guide",
    label: "Step-by-Step Guide",
    title: "Documentation that writes itself",
    desc: "Every click and keystroke becomes a numbered step with an annotated screenshot. Edit the text, rearrange steps, done.",
    mockup: (
      <div className="space-y-3">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
              {step}
            </div>
            <div className="flex-1">
              <div className="h-2.5 w-40 rounded bg-zinc-700" />
              <div className="mt-2 h-20 rounded bg-zinc-800/50" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "walkthrough",
    label: "Interactive Walkthrough",
    title: "Guided product tours",
    desc: "Users click through your product with hotspots, tooltips, and progress tracking. Embed it in your app or share a link.",
    mockup: (
      <div className="relative rounded bg-zinc-800/40 p-5">
        <div className="h-28 rounded bg-zinc-700/30" />
        <div className="absolute right-6 top-8 rounded border border-indigo-500/20 bg-zinc-900 p-2.5 shadow-lg">
          <div className="h-2 w-20 rounded bg-zinc-600" />
          <div className="mt-1 h-2 w-14 rounded bg-zinc-700" />
          <div className="mt-2.5 h-5 w-16 rounded bg-indigo-500/25" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-zinc-700">
            <div className="h-1 w-2/5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-[10px] text-zinc-500">Step 2 / 5</span>
        </div>
      </div>
    ),
  },
];

function Showcase() {
  const [active, setActive] = React.useState("editor");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        See it in action
      </h2>

      <div className="mt-8 flex gap-1 rounded-lg bg-zinc-900 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-md px-4 py-2 text-sm transition-colors ${
              active === tab.id
                ? "bg-zinc-800 font-medium text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 p-6 sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold">{current.title}</h3>
            <p className="mt-2 leading-relaxed text-zinc-400 text-sm">
              {current.desc}
            </p>
            <Link
              href="/features"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              Learn more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            {current.mockup}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PRICING                                                            */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For trying things out",
    cta: "Get started",
    highlight: false,
    features: [
      "5 recordings / month",
      "720p export",
      "Basic editing",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For individuals & small teams",
    cta: "Start free trial",
    highlight: true,
    features: [
      "Unlimited recordings",
      "4K export at 60fps",
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
    cta: "Start free trial",
    highlight: false,
    features: [
      "Everything in Pro",
      "Knowledge base portal",
      "Interactive walkthroughs",
      "Embeddable widget",
      "Analytics dashboard",
      "API access",
    ],
  },
];

function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20" id="pricing">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Pricing
      </h2>
      <p className="mt-2 text-zinc-400">
        Start free. Upgrade when you need to.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.highlight
                ? "border-indigo-500/30 bg-indigo-500/[0.03]"
                : "border-zinc-800"
            }`}
          >
            <h3 className="text-sm font-semibold text-zinc-300">
              {plan.name}
            </h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.price !== "$0" && (
                <span className="text-sm text-zinc-500">/mo</span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-zinc-400"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-6 flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                plan.highlight
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        Need more?{" "}
        <Link href="#" className="text-zinc-300 underline hover:text-white">
          Talk to sales
        </Link>{" "}
        about Enterprise plans with SSO, SLA, and custom integrations.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "How is this different from Loom?",
    a: "Loom is great for quick async videos. ScreenFlow goes further — it takes that same recording and also generates step-by-step guides and interactive walkthroughs. Three formats from one session.",
  },
  {
    q: "Can I try it without paying?",
    a: "Yes. The free plan gives you 5 recordings per month with basic editing. Pro and Team plans have a 14-day trial, no credit card required.",
  },
  {
    q: "How does the AI zoom thing work?",
    a: "We analyze your cursor movement and clicks to generate smooth zoom animations that draw attention to the right parts of the screen. You can tweak the timing or add manual zooms too.",
  },
  {
    q: "Can I embed content in my product?",
    a: "Team plans include a JavaScript widget you can drop into any web app. It supports videos, guides, and walkthroughs with your own branding.",
  },
];

function FAQ() {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Questions
      </h2>

      <div className="mt-8 max-w-2xl divide-y divide-zinc-800">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-sm font-medium text-zinc-200 pr-4">
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <p className="pb-4 text-sm leading-relaxed text-zinc-400">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-8 py-12 sm:px-12 sm:py-16 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to try it?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          Create your first recording in under a minute. Free plan, no credit
          card.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Get started
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Showcase />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
