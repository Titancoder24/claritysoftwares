"use client";

import React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

function MarketingHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-800">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3h4v4H3V3Zm6 0h4v4H9V3ZM3 9h4v4H3V9Zm6 2.5L15 9v4l-6 2.5V11Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">ScreenFlow</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 text-slate-500 hover:text-slate-900"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-slate-600 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-green-800 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "#" },
      { label: "Integrations", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
];

function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-800">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 3h4v4H3V3Zm6 0h4v4H9V3ZM3 9h4v4H3V9Zm6 2.5L15 9v4l-6 2.5V11Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">ScreenFlow</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Record once, create everything. The modern platform for product
              tutorials and documentation.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-800">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ScreenFlow. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Twitter", "GitHub", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-sm text-slate-500 transition-colors hover:text-slate-700"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <main className="pt-16">{children}</main>
      <MarketingFooter />
    </div>
  );
}
