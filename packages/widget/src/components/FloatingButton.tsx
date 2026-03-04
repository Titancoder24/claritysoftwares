import { h } from 'preact';

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

interface FloatingButtonProps {
  position: WidgetPosition;
  isOpen: boolean;
  onClick: () => void;
}

export function FloatingButton({ position, isOpen, onClick }: FloatingButtonProps) {
  return (
    <button
      class={`sf-fab sf-fab--${position}${isOpen ? ' is-open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close ScreenFlow help' : 'Open ScreenFlow help'}
    >
      <svg viewBox="0 0 24 24">
        {isOpen ? (
          // Close (X) icon -- the 45deg rotation on the SVG turns the "+" into "x"
          <path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" />
        ) : (
          // Question-mark / help icon
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        )}
      </svg>
    </button>
  );
}
