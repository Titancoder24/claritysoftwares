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
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Record your screen.
          <br />
          <span className="text-slate-400">We handle the rest.</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
          ScreenFlow turns raw screen recordings into polished product videos,
          step-by-step guides, and interactive walkthroughs. One take, three
          formats.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-800 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900">
            <Play className="h-3.5 w-3.5" />
            Watch demo
          </button>
        </div>
      </div>

      {/* App mockup */}
      <div className="mt-16 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="mx-auto flex h-5 w-56 items-center justify-center rounded bg-slate-100 text-[10px] text-slate-400">
            app.screenflow.dev/editor
          </div>
        </div>
        {/* Editor area */}
        <div className="flex h-[300px] sm:h-[380px]">
          {/* Sidebar */}
          <div className="hidden w-48 flex-shrink-0 border-r border-slate-200 p-3 sm:block">
            {["Timeline", "Scenes", "Zooms", "Cursor", "Audio"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`mb-0.5 flex h-7 items-center rounded px-2.5 text-xs ${
                    i === 0
                      ? "bg-green-50 font-medium text-green-800"
                      : "text-slate-500"
                  }`}
                >
                  {item}
                </div>
              )
            )}
            <div className="mt-5 space-y-1.5">
              <div className="h-1.5 w-full rounded bg-slate-100" />
              <div className="h-1.5 w-3/4 rounded bg-slate-100" />
              <div className="h-1.5 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
          {/* Preview area */}
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center justify-center bg-slate-50">
              <div className="relative h-44 w-72 rounded bg-slate-100 sm:h-52 sm:w-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 ring-1 ring-green-200">
                    <Play className="h-5 w-5 text-green-700" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-slate-200">
                    <div className="h-1 w-1/3 rounded-full bg-green-600" />
                  </div>
                  <span className="text-[10px] text-slate-400">1:24</span>
                </div>
              </div>
            </div>
            {/* Timeline bar */}
            <div className="border-t border-slate-200 p-2.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 flex-1 rounded-sm"
                    style={{
                      backgroundColor:
                        i < 7
                          ? `rgba(22,101,52,${0.08 + i * 0.03})`
                          : i < 14
                            ? `rgba(21,128,61,${0.05 + (i - 7) * 0.02})`
                            : "#f8fafc",
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
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        How it works
      </h2>
      <p className="mt-2 text-slate-500">
        Three steps. One recording session.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {featureCards.map((f, i) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-slate-300 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <f.icon className="h-4.5 w-4.5 text-slate-600" />
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-xs font-medium text-green-800">
                {i + 1}
              </div>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
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
          <div className="h-36 flex-1 rounded bg-slate-100" />
          <div className="w-40 space-y-1.5 rounded bg-slate-50 p-2.5">
            <div className="h-2.5 w-full rounded bg-slate-200" />
            <div className="h-2.5 w-2/3 rounded bg-slate-200" />
            <div className="mt-3 h-7 rounded bg-green-100" />
            <div className="h-7 rounded bg-slate-100" />
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-5 flex-1 rounded-sm bg-green-100" />
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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
              {step}
            </div>
            <div className="flex-1">
              <div className="h-2.5 w-40 rounded bg-slate-200" />
              <div className="mt-2 h-20 rounded bg-slate-100" />
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
      <div className="relative rounded bg-slate-50 p-5">
        <div className="h-28 rounded bg-slate-100" />
        <div className="absolute right-6 top-8 rounded border border-green-200 bg-white p-2.5 shadow-lg">
          <div className="h-2 w-20 rounded bg-slate-300" />
          <div className="mt-1 h-2 w-14 rounded bg-slate-200" />
          <div className="mt-2.5 h-5 w-16 rounded bg-green-100" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-slate-200">
            <div className="h-1 w-2/5 rounded-full bg-green-600" />
          </div>
          <span className="text-[10px] text-slate-400">Step 2 / 5</span>
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
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        See it in action
      </h2>

      <div className="mt-8 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-md px-4 py-2 text-sm transition-colors ${
              active === tab.id
                ? "bg-white font-medium text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{current.title}</h3>
            <p className="mt-2 leading-relaxed text-slate-500 text-sm">
              {current.desc}
            </p>
            <Link
              href="/features"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-600"
            >
              Learn more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
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
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Pricing
      </h2>
      <p className="mt-2 text-slate-500">
        Start free. Upgrade when you need to.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 bg-white shadow-sm ${
              plan.highlight
                ? "border-green-600 ring-1 ring-green-600"
                : "border-slate-200"
            }`}
          >
            <h3 className="text-sm font-semibold text-slate-800">
              {plan.name}
            </h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
              {plan.price !== "$0" && (
                <span className="text-sm text-slate-400">/mo</span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{plan.desc}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-6 flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                plan.highlight
                  ? "bg-green-800 text-white hover:bg-green-700"
                  : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Need more?{" "}
        <Link href="#" className="text-slate-700 underline hover:text-slate-900">
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
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Questions
      </h2>

      <div className="mt-8 max-w-2xl divide-y divide-slate-200">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-sm font-medium text-slate-700 pr-4">
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <p className="pb-4 text-sm leading-relaxed text-slate-500">
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
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-8 py-12 sm:px-12 sm:py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Ready to try it?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          Create your first recording in under a minute. Free plan, no credit
          card.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-green-800 px-6 text-sm font-medium text-white transition-colors hover:bg-green-700"
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
