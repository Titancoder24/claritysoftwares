import React from "react";
import {
  Search,
  BookOpen,
  Video,
  Layers,
  FileText,
  FileCode,
  ChevronRight,
  ArrowRight,
  Zap,
  Settings,
  Shield,
  Code2,
  Plug,
  CreditCard,
  ExternalLink,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  pageCount: number;
  children: { id: string; name: string; slug: string }[];
}

const categories: Category[] = [
  {
    id: "cat-1",
    name: "Getting Started",
    slug: "getting-started",
    description: "Quick setup guides and first steps to get up and running.",
    icon: "zap",
    pageCount: 5,
    children: [
      { id: "c1-1", name: "Quick Start Guide", slug: "quick-start" },
      { id: "c1-2", name: "Installation", slug: "installation" },
      { id: "c1-3", name: "First Recording", slug: "first-recording" },
    ],
  },
  {
    id: "cat-2",
    name: "Recording",
    slug: "recording",
    description: "Learn how to capture screen recordings and configure options.",
    icon: "video",
    pageCount: 4,
    children: [
      { id: "c2-1", name: "Screen Recording Basics", slug: "basics" },
      { id: "c2-2", name: "Advanced Options", slug: "advanced" },
    ],
  },
  {
    id: "cat-3",
    name: "Editing & Export",
    slug: "editing-export",
    description: "Edit your recordings and export in various formats.",
    icon: "settings",
    pageCount: 3,
    children: [
      { id: "c3-1", name: "Video Editor", slug: "video-editor" },
      { id: "c3-2", name: "Export Formats", slug: "export-formats" },
    ],
  },
  {
    id: "cat-4",
    name: "Integrations",
    slug: "integrations",
    description: "Connect with your favorite tools and automate workflows.",
    icon: "plug",
    pageCount: 6,
    children: [
      { id: "c4-1", name: "REST API", slug: "rest-api" },
      { id: "c4-2", name: "Webhooks", slug: "webhooks" },
      { id: "c4-3", name: "Slack", slug: "slack" },
    ],
  },
  {
    id: "cat-5",
    name: "Security",
    slug: "security",
    description: "Security features, compliance, and data protection policies.",
    icon: "shield",
    pageCount: 3,
    children: [
      { id: "c5-1", name: "Data Encryption", slug: "encryption" },
      { id: "c5-2", name: "SSO Setup", slug: "sso" },
    ],
  },
  {
    id: "cat-6",
    name: "Account & Billing",
    slug: "account-billing",
    description: "Manage your subscription, team members, and billing info.",
    icon: "creditcard",
    pageCount: 4,
    children: [
      { id: "c6-1", name: "Plans & Pricing", slug: "plans" },
      { id: "c6-2", name: "Team Management", slug: "team" },
    ],
  },
];

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  video: Video,
  settings: Settings,
  plug: Plug,
  shield: Shield,
  creditcard: CreditCard,
  code: Code2,
};

const popularArticles = [
  { title: "Quick Start Guide", slug: "getting-started/quick-start", category: "Getting Started" },
  { title: "Screen Recording Basics", slug: "recording/basics", category: "Recording" },
  { title: "REST API Guide", slug: "integrations/rest-api", category: "Integrations" },
  { title: "Export Formats", slug: "editing-export/export-formats", category: "Editing & Export" },
  { title: "SSO Setup", slug: "security/sso", category: "Security" },
];

function CategoryCard({ category, subdomain }: { category: Category; subdomain: string }) {
  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/15">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <a
            href={`/kb/${subdomain}/${category.slug}`}
            className="text-base font-semibold text-white transition-colors group-hover:text-indigo-400"
          >
            {category.name}
          </a>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {category.description}
          </p>

          <ul className="mt-4 space-y-1.5">
            {category.children.slice(0, 3).map((child) => (
              <li key={child.id}>
                <a
                  href={`/kb/${subdomain}/${category.slug}/${child.slug}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-indigo-400"
                >
                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                  {child.name}
                </a>
              </li>
            ))}
            {category.children.length > 3 && (
              <li>
                <a
                  href={`/kb/${subdomain}/${category.slug}`}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-400/70 transition-colors hover:text-indigo-400"
                >
                  View all {category.pageCount} articles
                  <ArrowRight className="h-3 w-3" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ categories: cats, subdomain }: { categories: Category[]; subdomain: string }) {
  return (
    <nav className="space-y-1">
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Categories
      </div>
      {cats.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        return (
          <a
            key={cat.id}
            href={`/kb/${subdomain}/${cat.slug}`}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200"
          >
            <Icon className="h-4 w-4 text-zinc-600" />
            <span>{cat.name}</span>
            <span className="ml-auto text-[10px] tabular-nums text-zinc-700">
              {cat.pageCount}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

export default async function PublicKBHomePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">ScreenFlow Docs</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-zinc-400 transition-colors hover:text-white">
              API Reference
            </a>
            <a href="#" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Changelog
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Visit ScreenFlow
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            How can we help you?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-400">
            Search our knowledge base or browse categories below to find answers,
            guides, and tutorials.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="h-14 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-12 pr-4 text-base text-white placeholder:text-zinc-600 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                /
              </kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-8">
            <Sidebar categories={categories} subdomain={subdomain} />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {/* Category Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} subdomain={subdomain} />
            ))}
          </div>

          {/* Popular Articles */}
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Popular Articles</h2>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 divide-y divide-zinc-800/50">
              {popularArticles.map((article) => (
                <a
                  key={article.slug}
                  href={`/kb/${subdomain}/${article.slug}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-zinc-800/30"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-zinc-600" />
                    <span className="text-sm text-zinc-300">{article.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">{article.category}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-violet-500">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            Powered by ScreenFlow
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <a href="#" className="transition-colors hover:text-zinc-400">Status</a>
            <a href="#" className="transition-colors hover:text-zinc-400">Privacy</a>
            <a href="#" className="transition-colors hover:text-zinc-400">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
