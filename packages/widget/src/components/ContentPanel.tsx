import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { SearchBar } from './SearchBar';
import { ContentCard, ContentItem } from './ContentCard';
import { WalkthroughEngine, WalkthroughStep } from './WalkthroughEngine';
import type { WidgetPosition } from './FloatingButton';

interface ContentPanelProps {
  isOpen: boolean;
  position: WidgetPosition;
  contents: ContentItem[];
  walkthroughs: Record<string, WalkthroughStep[]>;
  hostDocument: Document;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function ContentPanel({
  isOpen,
  position,
  contents,
  walkthroughs,
  hostDocument,
  onClose,
  title = 'Help Center',
  subtitle = 'Find answers, guides, and walkthroughs',
}: ContentPanelProps) {
  const [query, setQuery] = useState('');
  const [activeWalkthrough, setActiveWalkthrough] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return contents;
    const q = query.toLowerCase();
    return contents.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.type.includes(q),
    );
  }, [query, contents]);

  const grouped = useMemo(() => {
    const groups: Record<string, ContentItem[]> = {};
    for (const item of filtered) {
      (groups[item.type] ??= []).push(item);
    }
    return groups;
  }, [filtered]);

  const sectionLabels: Record<string, string> = {
    walkthrough: 'Interactive Walkthroughs',
    guide: 'Guides & Articles',
    video: 'Video Tutorials',
  };

  const handleSelect = (item: ContentItem) => {
    if (item.type === 'walkthrough' && item.projectId && walkthroughs[item.projectId]) {
      setActiveWalkthrough(item.projectId);
      onClose(); // close the panel while walkthrough runs
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener');
    }
  };

  const handleWalkthroughComplete = () => {
    setActiveWalkthrough(null);
  };

  const handleWalkthroughExit = () => {
    setActiveWalkthrough(null);
  };

  // Render the walkthrough overlay (outside the panel, at top-level in the shadow DOM)
  if (activeWalkthrough && walkthroughs[activeWalkthrough]) {
    return (
      <WalkthroughEngine
        steps={walkthroughs[activeWalkthrough]}
        onComplete={handleWalkthroughComplete}
        onExit={handleWalkthroughExit}
        hostDocument={hostDocument}
      />
    );
  }

  return (
    <div class={`sf-panel sf-panel--${position}${isOpen ? ' is-open' : ''}`}>
      <div class="sf-panel__header">
        <h2 class="sf-panel__title">{title}</h2>
        <p class="sf-panel__subtitle">{subtitle}</p>
      </div>

      <div class="sf-panel__body">
        <SearchBar value={query} onInput={setQuery} />

        {Object.keys(grouped).length === 0 && (
          <div class="sf-empty">
            <div class="sf-empty__icon">&#128269;</div>
            <p class="sf-empty__text">No results found for "{query}"</p>
          </div>
        )}

        {['walkthrough', 'guide', 'video'].map(
          (type) =>
            grouped[type] && (
              <div key={type}>
                <div class="sf-section-label">{sectionLabels[type]}</div>
                {grouped[type].map((item) => (
                  <ContentCard key={item.id} item={item} onSelect={handleSelect} />
                ))}
              </div>
            ),
        )}
      </div>

      <div class="sf-panel__footer">
        Powered by <a href="https://screenflow.dev" target="_blank" rel="noopener">ScreenFlow</a>
      </div>
    </div>
  );
}
