import React from "react";
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Layers,
  ArrowRight,
  Zap,
  Shield,
  Settings,
  Code,
  Users,
  CreditCard,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  pageCount: number;
}

interface FeaturedPage {
  id: string;
  title: string;
  slug: string;
  category: string;
  contentType: "video" | "guide" | "article";
  excerpt: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    slug: "getting-started",
    description: "Quick setup guides and introductory tutorials to get you up and running.",
    icon: "zap",
    pageCount: 8,
  },
  {
    id: "2",
    name: "Recording",
    slug: "recording",
    description: "Learn how to capture your screen, configure audio, and manage recordings.",
    icon: "video",
    pageCount: 12,
  },
  {
    id: "3",
    name: "Editing & Export",
    slug: "editing-export",
    description: "Edit your recordings, add annotations, and export in various formats.",
    icon: "layers",
    pageCount: 9,
  },
  {
    id: "4",
    name: "Integrations",
    slug: "integrations",
    description: "Connect with your favorite tools including Slack, Notion, and more.",
    icon: "code",
    pageCount: 15,
  },
  {
    id: "5",
    name: "Team & Collaboration",
    slug: "team",
    description: "Manage team members, permissions, and shared workspaces.",
    icon: "users",
    pageCount: 7,
  },
  {
    id: "6",
    name: "Account & Billing",
    slug: "account-billing",
    description: "Subscription management, invoices, and account settings.",
    icon: "creditcard",
    pageCount: 5,
  },
];

const featuredPages: FeaturedPage[] = [
  {
    id: "f1",
    title: "Quick Start Guide",
    slug: "getting-started/quick-start",
    category: "Getting Started",
    contentType: "guide",
    excerpt: "Get up and running with ScreenFlow in under 5 minutes.",
  },
  {
    id: "f2",
    title: "Your First Recording",
    slug: "recording/first-recording",
    category: "Recording",
    contentType: "video",
    excerpt: "A complete walkthrough of creating your first screen recording.",
  },
  {
    id: "f3",
    title: "REST API Reference",
    slug: "integrations/rest-api",
    category: "Integrations",
    contentType: "article",
    excerpt: "Complete API documentation with endpoints, authentication, and examples.",
  },
];

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  video: Video,
  layers: Layers,
  code: Code,
  users: Users,
  creditcard: CreditCard,
  shield: Shield,
  settings: Settings,
};

const contentTypeIcons: Record<string, React.ElementType> = {
  video: Video,
  guide: Layers,
  article: FileText,
};

function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <a
      href={`#${category.slug}`}
      className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-lg hover:shadow-black/10"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/15">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{category.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{category.description}</p>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
        {category.pageCount} articles
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

function FeaturedCard({ page }: { page: FeaturedPage }) {
  const Icon = contentTypeIcons[page.contentType] || FileText;

  return (
    <a
      href={`#${page.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/40"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 transition-colors group-hover:bg-zinc-800 group-hover:text-zinc-200">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            {page.category}
          </span>
        </div>
        <h4 className="mt-0.5 text-sm font-semibold text-zinc-200 transition-colors group-hover:text-white">
          {page.title}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{page.excerpt}</p>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-700 transition-all group-hover:text-zinc-400 group-hover:translate-x-0.5" />
    </a>
  );
}

function SidebarNav({ categories: cats }: { categories: Category[] }) {
  return (
    <nav className="space-y-1">
      {cats.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        return (
          <a
            key={cat.id}
            href={`#${cat.slug}`}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200"
          >
            <Icon className="h-4 w-4" />
            {cat.name}
            <span className="ml-auto text-[10px] text-zinc-600">{cat.pageCount}</span>
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
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">ScreenFlow Docs</span>
          </div>

          {/* Search */}
          <div className="flex w-96 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 transition-colors focus-within:border-zinc-600">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
              /
            </kbd>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              API Reference
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Changelog
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 py-8">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Categories
              </p>
              <SidebarNav categories={categories} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1 py-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-indigo-950/20 px-8 py-12">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl" />

              <div className="relative">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  How can we help you?
                </h1>
                <p className="mt-2 max-w-lg text-base text-zinc-400">
                  Browse our documentation, watch video tutorials, and follow step-by-step guides
                  to make the most of ScreenFlow.
                </p>

                <div className="mt-6 flex max-w-lg items-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-900/80 px-4 py-3 transition-colors focus-within:border-indigo-500/50">
                  <Search className="h-5 w-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search for articles, guides, and more..."
                    className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-zinc-600">
                  <span>Popular:</span>
                  {["Getting started", "API keys", "Recording settings", "Export options"].map(
                    (term) => (
                      <a
                        key={term}
                        href="#"
                        className="rounded-md bg-zinc-800/50 px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        {term}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Category Grid */}
            <section className="mt-10">
              <h2 className="mb-5 text-lg font-semibold text-white">Browse by Category</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>

            {/* Featured Pages */}
            <section className="mt-10">
              <h2 className="mb-5 text-lg font-semibold text-white">Popular Articles</h2>
              <div className="space-y-3">
                {featuredPages.map((page) => (
                  <FeaturedCard key={page.id} page={page} />
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 border-t border-zinc-800/50 py-8">
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-violet-600">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                  <span>ScreenFlow Documentation</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="transition-colors hover:text-zinc-400">
                    Privacy
                  </a>
                  <a href="#" className="transition-colors hover:text-zinc-400">
                    Terms
                  </a>
                  <a href="#" className="transition-colors hover:text-zinc-400">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
