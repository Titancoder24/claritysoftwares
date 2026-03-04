"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ChevronDown, Minus } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
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
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Plan {
  name: string;
  monthlyPrice: number | null;
  desc: string;
  popular: boolean;
  cta: string;
  ctaHref: string;
}

const plans: Plan[] = [
  { name: "Free", monthlyPrice: 0, desc: "For individuals", popular: false, cta: "Get Started", ctaHref: "/auth/signup" },
  { name: "Pro", monthlyPrice: 29, desc: "For creators", popular: false, cta: "Start Free Trial", ctaHref: "/auth/signup" },
  { name: "Team", monthlyPrice: 79, desc: "For growing teams", popular: true, cta: "Start Free Trial", ctaHref: "/auth/signup" },
  { name: "Business", monthlyPrice: 149, desc: "For organizations", popular: false, cta: "Contact Sales", ctaHref: "#" },
  { name: "Enterprise", monthlyPrice: null, desc: "Custom solutions", popular: false, cta: "Contact Sales", ctaHref: "#" },
];

type FeatureValue = boolean | string;

interface FeatureRow {
  feature: string;
  values: FeatureValue[];
}

interface FeatureCategory {
  category: string;
  rows: FeatureRow[];
}

const featureCategories: FeatureCategory[] = [
  {
    category: "Recording",
    rows: [
      { feature: "Recordings per month", values: ["5", "Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Max recording length", values: ["5 min", "30 min", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Browser recording", values: [true, true, true, true, true] },
      { feature: "Desktop recording", values: [false, true, true, true, true] },
      { feature: "Webcam overlay", values: [true, true, true, true, true] },
      { feature: "System audio capture", values: [false, true, true, true, true] },
    ],
  },
  {
    category: "Editing",
    rows: [
      { feature: "Basic trimming & cuts", values: [true, true, true, true, true] },
      { feature: "AI cinematic zooms", values: [false, true, true, true, true] },
      { feature: "Cursor smoothing", values: [false, true, true, true, true] },
      { feature: "Annotations & callouts", values: [false, true, true, true, true] },
      { feature: "Background music", values: [false, true, true, true, true] },
      { feature: "Transitions library", values: [false, false, true, true, true] },
    ],
  },
  {
    category: "Export & Quality",
    rows: [
      { feature: "720p export", values: [true, true, true, true, true] },
      { feature: "1080p export", values: [false, true, true, true, true] },
      { feature: "4K @ 60fps export", values: [false, false, true, true, true] },
      { feature: "Custom watermark", values: [false, true, true, true, true] },
      { feature: "Remove ScreenFlow branding", values: [false, true, true, true, true] },
    ],
  },
  {
    category: "Delivery",
    rows: [
      { feature: "Step-by-step guides", values: [false, true, true, true, true] },
      { feature: "Interactive walkthroughs", values: [false, false, true, true, true] },
      { feature: "Knowledge base portal", values: [false, false, true, true, true] },
      { feature: "Learning academy", values: [false, false, false, true, true] },
      { feature: "Embeddable widget", values: [false, false, false, true, true] },
      { feature: "Custom domain", values: [false, false, true, true, true] },
    ],
  },
  {
    category: "Collaboration & Admin",
    rows: [
      { feature: "Team members", values: ["1", "1", "Up to 15", "Up to 50", "Unlimited"] },
      { feature: "Shared workspace", values: [false, false, true, true, true] },
      { feature: "Role-based permissions", values: [false, false, true, true, true] },
      { feature: "SSO / SAML", values: [false, false, false, true, true] },
      { feature: "Audit logs", values: [false, false, false, true, true] },
      { feature: "API access", values: [false, false, true, true, true] },
    ],
  },
  {
    category: "Support",
    rows: [
      { feature: "Community support", values: [true, true, true, true, true] },
      { feature: "Email support", values: [false, true, true, true, true] },
      { feature: "Priority support", values: [false, false, true, true, true] },
      { feature: "Dedicated success manager", values: [false, false, false, true, true] },
      { feature: "SLA guarantee", values: [false, false, false, true, true] },
      { feature: "24/7 premium support", values: [false, false, false, false, true] },
    ],
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, you'll receive credit toward future billing.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes, Pro and Team plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What happens when my free plan limits are reached?",
    a: "You'll be notified when you're approaching your limits. Existing recordings remain accessible, but you won't be able to create new ones until the next billing cycle or until you upgrade.",
  },
  {
    q: "Do you offer discounts for nonprofits or education?",
    a: "Yes. We offer 50% off for verified nonprofits and educational institutions. Contact our sales team to learn more.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, wire transfers for annual enterprise plans, and can accommodate purchase orders for Business and Enterprise tiers.",
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function CellValue({ value }: { value: FeatureValue }) {
  if (typeof value === "string") {
    return <span className="text-sm text-zinc-300">{value}</span>;
  }
  if (value) {
    return <Check className="mx-auto h-4 w-4 text-indigo-400" />;
  }
  return <Minus className="mx-auto h-4 w-4 text-zinc-700" />;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [annual, setAnnual] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const getPrice = (plan: Plan) => {
    if (plan.monthlyPrice === null) return "Custom";
    if (plan.monthlyPrice === 0) return "$0";
    const price = annual
      ? Math.round(plan.monthlyPrice * 0.8)
      : plan.monthlyPrice;
    return `$${price}`;
  };

  return (
    <div className="pb-24">
      {/* Header */}
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
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 text-lg text-zinc-400"
          >
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </motion.p>

          {/* Annual toggle */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <span
              className={`text-sm font-medium ${!annual ? "text-white" : "text-zinc-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                annual ? "bg-indigo-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  annual ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${annual ? "text-white" : "text-zinc-500"}`}
            >
              Annual{" "}
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-400">
                Save 20%
              </span>
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Plan cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mx-auto max-w-7xl px-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              custom={i}
              className={`relative flex flex-col rounded-2xl border p-6 ${
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
              <h3 className="text-sm font-semibold text-zinc-300">
                {plan.name}
              </h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">{getPrice(plan)}</span>
                {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                  <span className="text-sm text-zinc-500">
                    /mo{annual ? " billed annually" : ""}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>
              <Link
                href={plan.ctaHref}
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
      </motion.section>

      {/* Full feature comparison */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mx-auto mt-24 max-w-7xl px-6"
      >
        <motion.h2
          variants={fadeUp}
          className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Full feature comparison
        </motion.h2>

        <motion.div variants={fadeUp} custom={1} className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 pr-4 text-left text-sm font-medium text-zinc-400 w-56" />
                {plans.map((p, i) => (
                  <th
                    key={p.name}
                    className={`px-4 py-4 text-center text-sm font-semibold ${
                      p.popular ? "text-indigo-400" : "text-zinc-400"
                    }`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureCategories.map((cat) => (
                <React.Fragment key={cat.category}>
                  <tr>
                    <td
                      colSpan={6}
                      className="pt-8 pb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500"
                    >
                      {cat.category}
                    </td>
                  </tr>
                  {cat.rows.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/40"
                    >
                      <td className="py-3 pr-4 text-sm text-zinc-300">
                        {row.feature}
                      </td>
                      {row.values.map((val, vi) => (
                        <td key={vi} className="px-4 py-3 text-center">
                          <CellValue value={val} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mx-auto mt-24 max-w-2xl px-6"
      >
        <motion.h2
          variants={fadeUp}
          className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Pricing FAQ
        </motion.h2>

        <motion.div
          variants={fadeUp}
          custom={1}
          className="mt-10 divide-y divide-zinc-800"
        >
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="text-sm font-medium text-zinc-200 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === i ? "max-h-48 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-sm leading-relaxed text-zinc-400">{faq.a}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
