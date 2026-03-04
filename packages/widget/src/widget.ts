import { h, render } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { FloatingButton, WidgetPosition } from './components/FloatingButton';
import { ContentPanel } from './components/ContentPanel';
import { ContentItem } from './components/ContentCard';
import { WalkthroughStep } from './components/WalkthroughEngine';
import styles from './styles.css?inline';

// ── Types ──

export interface ScreenFlowConfig {
  /** Position of the floating button */
  position?: WidgetPosition;
  /** Contents to display in the panel */
  contents?: ContentItem[];
  /** Walkthrough definitions keyed by projectId */
  walkthroughs?: Record<string, WalkthroughStep[]>;
  /** Panel title */
  title?: string;
  /** Panel subtitle */
  subtitle?: string;
  /** API base URL for fetching content dynamically */
  apiUrl?: string;
  /** Project token for authentication */
  token?: string;
}

export interface ScreenFlowAPI {
  open: () => void;
  close: () => void;
  startWalkthrough: (projectId: string) => void;
  destroy: () => void;
}

// ── Internal state shared between Preact tree and imperative API ──

let setOpenExternal: ((open: boolean) => void) | null = null;
let startWalkthroughExternal: ((projectId: string) => void) | null = null;

// ── Root Preact component ──

interface WidgetAppProps {
  config: ScreenFlowConfig;
}

function WidgetApp({ config }: WidgetAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const position = config.position ?? 'bottom-right';

  // Expose state setters to the imperative API
  setOpenExternal = setIsOpen;

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return h('div', null,
    h(FloatingButton, { position, isOpen, onClick: handleToggle }),
    h(ContentPanel, {
      isOpen,
      position,
      contents: config.contents ?? [],
      walkthroughs: config.walkthroughs ?? {},
      hostDocument: document,
      onClose: handleClose,
      title: config.title,
      subtitle: config.subtitle,
    }),
  );
}

// ── Public API ──

function init(config: ScreenFlowConfig = {}): ScreenFlowAPI {
  // Prevent double-initialization
  const existingHost = document.getElementById('screenflow-widget-host');
  if (existingHost) {
    existingHost.remove();
  }

  // Create host element and shadow DOM
  const host = document.createElement('div');
  host.id = 'screenflow-widget-host';
  host.style.cssText = 'position:fixed;z-index:2147483644;pointer-events:none;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // Inject styles into shadow DOM
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  // Create container for Preact
  const container = document.createElement('div');
  container.style.cssText = 'pointer-events:auto;';
  shadow.appendChild(container);

  // Render
  render(h(WidgetApp, { config }), container);

  // Build imperative API
  const api: ScreenFlowAPI = {
    open() {
      setOpenExternal?.(true);
    },
    close() {
      setOpenExternal?.(false);
    },
    startWalkthrough(projectId: string) {
      // Open the panel and trigger walkthrough through the content panel
      // The ContentPanel will pick up the walkthrough by finding the matching content item
      startWalkthroughExternal?.(projectId);
    },
    destroy() {
      render(null, container);
      host.remove();
      setOpenExternal = null;
      startWalkthroughExternal = null;
    },
  };

  return api;
}

// ── Attach to window global ──

declare global {
  interface Window {
    ScreenFlow: {
      init: typeof init;
      open: () => void;
      close: () => void;
      startWalkthrough: (projectId: string) => void;
    };
  }
}

const ScreenFlow = {
  init(config: ScreenFlowConfig = {}): ScreenFlowAPI {
    const api = init(config);
    // Also attach convenience methods at the top level
    ScreenFlow.open = api.open;
    ScreenFlow.close = api.close;
    ScreenFlow.startWalkthrough = api.startWalkthrough;
    return api;
  },
  open() {
    console.warn('ScreenFlow: call ScreenFlow.init() before using ScreenFlow.open()');
  },
  close() {
    console.warn('ScreenFlow: call ScreenFlow.init() before using ScreenFlow.close()');
  },
  startWalkthrough(_projectId: string) {
    console.warn('ScreenFlow: call ScreenFlow.init() before using ScreenFlow.startWalkthrough()');
  },
};

if (typeof window !== 'undefined') {
  window.ScreenFlow = ScreenFlow;
}

export default ScreenFlow;
