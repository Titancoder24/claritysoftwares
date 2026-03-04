import { h } from 'preact';

export type ContentType = 'video' | 'guide' | 'walkthrough';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  duration?: string;
  url?: string;
  projectId?: string;
}

interface ContentCardProps {
  item: ContentItem;
  onSelect: (item: ContentItem) => void;
}

const typeIcons: Record<ContentType, string> = {
  video: '\u25B6',
  guide: '\uD83D\uDCC4',
  walkthrough: '\uD83D\uDC49',
};

export function ContentCard({ item, onSelect }: ContentCardProps) {
  return (
    <div class="sf-card" onClick={() => onSelect(item)} role="button" tabIndex={0}>
      <div class={`sf-card__icon sf-card__icon--${item.type}`}>
        {typeIcons[item.type]}
      </div>
      <div class="sf-card__content">
        <p class="sf-card__title">{item.title}</p>
        <p class="sf-card__description">{item.description}</p>
        <div class="sf-card__meta">
          <span class={`sf-card__badge sf-card__badge--${item.type}`}>
            {item.type}
          </span>
          {item.duration && <span>{item.duration}</span>}
        </div>
      </div>
    </div>
  );
}
