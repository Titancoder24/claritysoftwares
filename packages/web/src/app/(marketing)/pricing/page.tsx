"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ChevronDown, ArrowRight } from "lucide-react";

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

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Plan {
  name: string;
  monthlyPrice: number | null;
  desc: string;
  cta: string;
  popular: boolean;
}

const plans: Plan[] = [
  { name: "Free", monthlyPrice: 0, desc: "For individuals getting started", cta: "Get Started", popular: false },
  { name: "Pro", monthlyPrice: 29, desc: "For creators and solopreneurs", cta: "Start Free Trial", popular: false },
  { name: "Team", monthlyPrice: 79, desc: "For growing teams", cta: "Start Free Trial", popular: true },
  { name: "Business", monthlyPrice: 149, desc: "For scaling organizations", cta: "Contact Sales", popular: false },
  { name: "Enterprise", monthlyPrice: null, desc: "For large organizations", cta: "Contact Sales", popular: false },
];

interface FeatureRow {
  feature: string;
  values: (string | boolean)[];
}

const featureCategories: { category: string; rows: FeatureRow[] }[] = [
  {
    category: "Recording",
    rows: [
      { feature: "Recordings per month", values: ["5", "Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Max recording length", values: ["5 min", "30 min", "60 min", "Unlimited", "Unlimited"] },
      { feature: "Webcam overlay", values: [true, true, true, true, true] },
      { feature: "System audio capture", values: [false, true, true, true, true] },
      { feature: "Desktop app recording", values: [false, true, true, true, true] },
    ],
  },
  {
    category: "Editing",
    rows: [
      { feature: "Export quality", values: ["720p", "1080p", "4K 60fps", "4K 60fps", "4K 60fps"] },
      { feature: "AI cinematic zooms", values: [false, true, true, true, true] },
      { feature: "Cursor smoothing", values: [false, true, true, true, true] },
      { feature: "Background music library", values: [false, true, true, true, true] },
      { feature: "Custom transitions", values: [false, false, true, true, true] },
      { feature: "Batch export", values: [false, false, true, true, true] },
    ],
  },
  {
    category: "Content Delivery",
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
    category: "Support & Analytics",
    rows: [
      { feature: "Analytics dashboard", values: [false, true, true, true, true] },
      { feature: "Advanced analytics", values: [false, false, false, true, true] },
      { feature: "Community support", values: [true, true, true, true, true] },
      { feature: "Priority support", values: [false, true, true, true, true] },
      { feature: "Dedicated success manager", values: [false, false, false, true, true] },
      { feature: "SLA guarantee", values: [false, false, false, true, true] },
      { feature: "24/7 premium support", values: [false, false, false, false, true] },
    ],
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remaining billing period. When downgrading, the change takes effect at the end of your current billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! Pro and Team plans come with a 14-day free trial. No credit card required to start. You'll only be charged after the trial ends if you choose to continue.",
  },
  {
    q: "What happens when I exceed my recording limit on Free?",
    a: "You'll still be able to view and share existing recordings, but you won't be able to create new ones until the next billing cycle or until you upgrade to a paid plan.",
  },
  {
    q: "Do you offer discounts for nonprofits or education?",
    a: "Yes, we offer a 50% discount for verified nonprofit organizations and educational institutions. Contact our sales team to learn more.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), as well as ACH bank transfers for annual plans. Enterprise customers can pay via invoice.",
  },
];

/* ------------------------------------------------------------------ */
/*  Cell renderer                                                      */
/* ------------------------------------------------------------------ */

function CellValue({ value, highlight }: { value: string | boolean; highlight: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={`text-sm ${highlight ? "font-medium text-white" : "text-zinc-400"}`}>
        {value}
      </span>
    );
  }
  return value ? (
    <Check className={`mx-auto h-4 w-4 ${highlight ? "text-indigo-400" : "text-zinc-500"}`} />
  ) : (
    <X className="mx-auto h-4 w-4 text-zinc-700" />
  );
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
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-24 sm:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-15"
            style={{
              background: "radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)",
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
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-zinc-400">
            Start free, upgrade when you need to. No hidden fees.
          </motion.p>

          {/* Billing toggle */}
          <motion.div variants={fadeUp} custom={2} className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!annual ? "text-white" : "text-zinc-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                annual ? "bg-indigo-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  annual ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? "text-white" : "text-zinc-500"}`}>
              Annual
            </span>
            {annual && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                Save 20%
              </span>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Plan cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mx-auto max-w-7xl px-6 pb-20"
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
                  : "border-zinc-800 bg-zinc-950/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-sm font-semibold text-zinc-300">{plan.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">{getPrice(plan)}</span>
                {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                  <span className="text-sm text-zinc-500">/mo</span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>
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
      </motion.section>

      {/* Feature comparison table */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mx-auto max-w-7xl px-6 pb-24"
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
                <th className="w-[220px] py-4 text-left text-sm font-medium text-zinc-400" />
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
                      colSpan={plans.length + 1}
                      className="pb-2 pt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500"
                    >
                      {cat.category}
                    </td>
                  </tr>
                  {cat.rows.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-zinc-800/40 transition-colors hover:bg-zinc-900/50"
                    >
                      <td className="py-3 pr-4 text-sm text-zinc-300">
                        {row.feature}
                      </td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          <CellValue value={v} highlight={plans[i].popular} />
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
      <section className="border-t border-zinc-800 bg-zinc-950/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mx-auto max-w-2xl px-6 py-24"
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
            className="mt-12 divide-y divide-zinc-800"
          >
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="pr-4 text-sm font-medium text-zinc-200">
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
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
            style={{
              background: "radial-gradient(ellipse at center, #8b5cf6 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-3 text-zinc-400">
            Try ScreenFlow free for 14 days. No credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
