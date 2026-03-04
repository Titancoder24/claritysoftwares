import React from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  FileText,
  Video,
  Layers,
  Search,
  ExternalLink,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Hash,
  Zap,
  Settings,
  Plug,
  Shield,
  CreditCard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface NavLink {
  title: string;
  slug: string;
}

interface SidebarCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  pages: { title: string; slug: string; active?: boolean }[];
}

const sidebarCategories: SidebarCategory[] = [
  {
    id: "cat-1",
    name: "Getting Started",
    slug: "getting-started",
    icon: "zap",
    pages: [
      { title: "Quick Start Guide", slug: "getting-started/quick-start" },
      { title: "Installation", slug: "getting-started/installation" },
      { title: "First Recording", slug: "getting-started/first-recording" },
      { title: "System Requirements", slug: "getting-started/system-requirements" },
    ],
  },
  {
    id: "cat-2",
    name: "Recording",
    slug: "recording",
    icon: "video",
    pages: [
      { title: "Screen Recording Basics", slug: "recording/basics" },
      { title: "Advanced Options", slug: "recording/advanced" },
    ],
  },
  {
    id: "cat-3",
    name: "Editing & Export",
    slug: "editing-export",
    icon: "settings",
    pages: [
      { title: "Video Editor", slug: "editing-export/video-editor" },
      { title: "Export Formats", slug: "editing-export/export-formats" },
    ],
  },
  {
    id: "cat-4",
    name: "Integrations",
    slug: "integrations",
    icon: "plug",
    pages: [
      { title: "REST API", slug: "integrations/rest-api" },
      { title: "Webhooks", slug: "integrations/webhooks" },
      { title: "Slack", slug: "integrations/slack" },
    ],
  },
  {
    id: "cat-5",
    name: "Security",
    slug: "security",
    icon: "shield",
    pages: [
      { title: "Data Encryption", slug: "security/encryption" },
      { title: "SSO Setup", slug: "security/sso" },
    ],
  },
  {
    id: "cat-6",
    name: "Account & Billing",
    slug: "account-billing",
    icon: "creditcard",
    pages: [
      { title: "Plans & Pricing", slug: "account-billing/plans" },
      { title: "Team Management", slug: "account-billing/team" },
    ],
  },
];

const tocItems: TOCItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "prerequisites", title: "Prerequisites", level: 2 },
  { id: "step-1", title: "Step 1: Install the extension", level: 2 },
  { id: "step-2", title: "Step 2: Configure settings", level: 2 },
  { id: "configuration-options", title: "Configuration Options", level: 3 },
  { id: "step-3", title: "Step 3: Start recording", level: 2 },
  { id: "keyboard-shortcuts", title: "Keyboard Shortcuts", level: 3 },
  { id: "troubleshooting", title: "Troubleshooting", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  video: Video,
  settings: Settings,
  plug: Plug,
  shield: Shield,
  creditcard: CreditCard,
};

/* ------------------------------------------------------------------ */
/*  Sidebar Navigation                                                 */
/* ------------------------------------------------------------------ */

function SidebarNav({
  categories,
  subdomain,
  currentSlug,
}: {
  categories: SidebarCategory[];
  subdomain: string;
  currentSlug: string;
}) {
  return (
    <nav className="space-y-4">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        const isActiveCategory = currentSlug.startsWith(cat.slug);

        return (
          <div key={cat.id}>
            <a
              href={`/kb/${subdomain}/${cat.slug}`}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActiveCategory ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.name}
            </a>
            <div className="mt-1 space-y-0.5 pl-3">
              {cat.pages.map((page) => {
                const isActive = currentSlug === page.slug;
                return (
                  <a
                    key={page.slug}
                    href={`/kb/${subdomain}/${page.slug}`}
                    className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 font-medium"
                        : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300"
                    }`}
                  >
                    {page.title}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Table of Contents                                                  */
/* ------------------------------------------------------------------ */

function TableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <div className="space-y-1">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        On this page
      </div>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block rounded-md py-1 text-xs transition-colors hover:text-zinc-200 ${
            item.level === 3 ? "pl-4 text-zinc-600" : "pl-0 text-zinc-400"
          }`}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Article Content (mock server-rendered)                             */
/* ------------------------------------------------------------------ */

function ArticleContent() {
  return (
    <div className="prose-custom">
      <h2 id="overview" className="mb-4 mt-0 text-xl font-semibold text-white">
        Overview
      </h2>
      <p className="mb-6 leading-relaxed text-zinc-400">
        This guide will walk you through the complete setup process for ScreenFlow.
        By the end of this guide, you will have the extension installed, configured
        to your preferences, and be ready to create your first screen recording.
      </p>

      <div className="mb-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
        <div className="flex gap-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
          <div>
            <div className="text-sm font-medium text-indigo-300">Quick Tip</div>
            <p className="mt-1 text-sm text-zinc-400">
              If you have already installed the extension, you can skip directly to{" "}
              <a href="#step-2" className="text-indigo-400 underline underline-offset-2">
                Step 2: Configure settings
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <h2 id="prerequisites" className="mb-4 mt-10 text-xl font-semibold text-white">
        Prerequisites
      </h2>
      <ul className="mb-6 space-y-2 text-zinc-400">
        <li className="flex items-start gap-2.5">
          <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-indigo-400/50" />
          <span>A modern web browser (Chrome 90+, Firefox 88+, or Edge 90+)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-indigo-400/50" />
          <span>A ScreenFlow account (free tier available)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-indigo-400/50" />
          <span>Microphone access (optional, for audio recording)</span>
        </li>
      </ul>

      <h2 id="step-1" className="mb-4 mt-10 text-xl font-semibold text-white">
        Step 1: Install the Extension
      </h2>
      <p className="mb-4 leading-relaxed text-zinc-400">
        Visit the Chrome Web Store and search for &quot;ScreenFlow&quot; or click the direct
        installation link below. Click the &quot;Add to Chrome&quot; button to install the
        extension.
      </p>

      {/* Mock code block */}
      <div className="mb-6 overflow-hidden rounded-lg border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <span className="text-xs text-zinc-500">Terminal</span>
          <button className="text-[10px] text-zinc-600 transition-colors hover:text-zinc-400">
            Copy
          </button>
        </div>
        <pre className="overflow-x-auto bg-zinc-950 px-4 py-3">
          <code className="text-sm text-zinc-300">
            <span className="text-zinc-500">$</span>{" "}
            <span className="text-emerald-400">npm</span> install @screenflow/sdk
          </code>
        </pre>
      </div>

      <h2 id="step-2" className="mb-4 mt-10 text-xl font-semibold text-white">
        Step 2: Configure Settings
      </h2>
      <p className="mb-4 leading-relaxed text-zinc-400">
        After installation, click the ScreenFlow icon in your browser toolbar to open
        the settings panel. Here you can configure recording quality, audio sources,
        and keyboard shortcuts.
      </p>

      <h3
        id="configuration-options"
        className="mb-3 mt-8 text-lg font-semibold text-zinc-200"
      >
        Configuration Options
      </h3>

      {/* Mock table */}
      <div className="mb-6 overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400">
                Option
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400">
                Default
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-indigo-400">quality</td>
              <td className="px-4 py-2.5 text-xs text-zinc-500">1080p</td>
              <td className="px-4 py-2.5 text-xs text-zinc-400">
                Recording resolution (720p, 1080p, 4K)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-indigo-400">fps</td>
              <td className="px-4 py-2.5 text-xs text-zinc-500">30</td>
              <td className="px-4 py-2.5 text-xs text-zinc-400">
                Frames per second (24, 30, 60)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-indigo-400">audio</td>
              <td className="px-4 py-2.5 text-xs text-zinc-500">true</td>
              <td className="px-4 py-2.5 text-xs text-zinc-400">
                Enable microphone recording
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-indigo-400">systemAudio</td>
              <td className="px-4 py-2.5 text-xs text-zinc-500">false</td>
              <td className="px-4 py-2.5 text-xs text-zinc-400">
                Capture system/tab audio
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="step-3" className="mb-4 mt-10 text-xl font-semibold text-white">
        Step 3: Start Recording
      </h2>
      <p className="mb-4 leading-relaxed text-zinc-400">
        Click the record button or use the keyboard shortcut to begin capturing your
        screen. You can choose to record the entire screen, a specific window, or a
        custom area.
      </p>

      <h3 id="keyboard-shortcuts" className="mb-3 mt-8 text-lg font-semibold text-zinc-200">
        Keyboard Shortcuts
      </h3>
      <div className="mb-6 space-y-2">
        {[
          { keys: "Ctrl + Shift + R", desc: "Start/Stop recording" },
          { keys: "Ctrl + Shift + P", desc: "Pause/Resume recording" },
          { keys: "Ctrl + Shift + S", desc: "Screenshot" },
        ].map((shortcut) => (
          <div
            key={shortcut.keys}
            className="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2.5"
          >
            <span className="text-sm text-zinc-400">{shortcut.desc}</span>
            <kbd className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-300">
              {shortcut.keys}
            </kbd>
          </div>
        ))}
      </div>

      <h2 id="troubleshooting" className="mb-4 mt-10 text-xl font-semibold text-white">
        Troubleshooting
      </h2>
      <p className="mb-4 leading-relaxed text-zinc-400">
        If you encounter issues during setup, try the following solutions:
      </p>
      <div className="mb-6 space-y-3">
        {[
          {
            q: "Extension not appearing in toolbar",
            a: 'Click the puzzle icon in Chrome and pin the ScreenFlow extension.',
          },
          {
            q: "Microphone not detected",
            a: "Check your browser permissions and ensure microphone access is allowed.",
          },
          {
            q: "Recording quality is low",
            a: "Verify your quality settings and ensure hardware acceleration is enabled.",
          },
        ].map((item) => (
          <details
            key={item.q}
            className="group rounded-lg border border-zinc-800/50 bg-zinc-900/20"
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
              {item.q}
            </summary>
            <p className="border-t border-zinc-800/30 px-4 py-3 text-sm text-zinc-500">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <h2 id="next-steps" className="mb-4 mt-10 text-xl font-semibold text-white">
        Next Steps
      </h2>
      <p className="mb-4 leading-relaxed text-zinc-400">
        Now that you have ScreenFlow set up, explore these guides to make the most of
        your recordings:
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Recording Best Practices", icon: Video },
          { title: "Editing Your First Video", icon: Layers },
        ].map((card) => (
          <a
            key={card.title}
            href="#"
            className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/40"
          >
            <card.icon className="h-5 w-5 text-indigo-400" />
            <div>
              <div className="text-sm font-medium text-zinc-200">{card.title}</div>
              <div className="text-xs text-zinc-600">Read guide</div>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-zinc-700" />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function PublicKBPage({
  params,
}: {
  params: Promise<{ subdomain: string; slug: string[] }>;
}) {
  const { subdomain, slug } = await params;
  const currentSlug = slug.join("/");

  const pageTitle = "Quick Start Guide";
  const categoryName = "Getting Started";
  const readTime = "5 min read";
  const lastUpdated = "Updated 3 days ago";

  const prevPage: NavLink = { title: "Installation", slug: "getting-started/installation" };
  const nextPage: NavLink = {
    title: "First Recording",
    slug: "getting-started/first-recording",
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <a href={`/kb/${subdomain}`} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">ScreenFlow Docs</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 rounded-lg border border-zinc-800 bg-zinc-900/50 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition-all focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-500">
                /
              </kbd>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-zinc-800/50 lg:block">
          <div className="sticky top-0 h-[calc(100vh-64px)] overflow-y-auto px-4 py-6">
            <SidebarNav
              categories={sidebarCategories}
              subdomain={subdomain}
              currentSlug={currentSlug}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-8 py-8 lg:px-12">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-zinc-500">
            <a
              href={`/kb/${subdomain}`}
              className="transition-colors hover:text-zinc-300"
            >
              Home
            </a>
            <ChevronRight className="h-3 w-3" />
            <a href="#" className="transition-colors hover:text-zinc-300">
              {categoryName}
            </a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-300">{pageTitle}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {pageTitle}
            </h1>
            <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readTime}
              </span>
              <span>{lastUpdated}</span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                2,847 views
              </span>
            </div>
          </div>

          {/* Article Content */}
          <ArticleContent />

          {/* Feedback */}
          <div className="mt-12 rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 text-center">
            <p className="text-sm text-zinc-400">Was this article helpful?</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400">
                <ThumbsUp className="h-4 w-4" />
                Yes
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400">
                <ThumbsDown className="h-4 w-4" />
                No
              </button>
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <a
              href={`/kb/${subdomain}/${prevPage.slug}`}
              className="group rounded-xl border border-zinc-800/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/30"
            >
              <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                <ChevronLeft className="h-3 w-3" />
                Previous
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-300 transition-colors group-hover:text-indigo-400">
                {prevPage.title}
              </div>
            </a>
            <a
              href={`/kb/${subdomain}/${nextPage.slug}`}
              className="group rounded-xl border border-zinc-800/50 p-4 text-right transition-all hover:border-zinc-700 hover:bg-zinc-900/30"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-600">
                Next
                <ChevronRight className="h-3 w-3" />
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-300 transition-colors group-hover:text-indigo-400">
                {nextPage.title}
              </div>
            </a>
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-0 px-4 py-8">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </div>

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
