/* ------------------------------------------------------------------ */
/*  ScreenFlow – Content Script                                        */
/*  Tracks cursor, clicks, inputs, scrolls and keyboard shortcuts      */
/*  on the active page while recording is in progress.                 */
/* ------------------------------------------------------------------ */

import type {
  ExtensionMessage,
  ClickEvent,
  InputEvent as SFInputEvent,
  ScrollEvent,
  CursorPosition,
  KeyboardShortcutEvent,
  ElementMeta,
  BoundingBox,
  TrackingDataPayload,
} from './types';

// --------------- State -----------------------------------------------

let isTracking = false;
let trackingStartTime = 0;

const clicks: ClickEvent[] = [];
const inputs: SFInputEvent[] = [];
const scrolls: ScrollEvent[] = [];
const cursorPositions: CursorPosition[] = [];
const keyboardShortcuts: KeyboardShortcutEvent[] = [];

let cursorRafId: number | null = null;
let lastCursorX = 0;
let lastCursorY = 0;
let cursorSampleInterval: ReturnType<typeof setInterval> | null = null;

let indicatorEl: HTMLElement | null = null;

// --------------- CSS Selector Generator ------------------------------

function getCssSelector(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`;

  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      parts.unshift(`#${CSS.escape(current.id)}`);
      break;
    }

    // Prefer unique class names
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => c.length > 0)
        .slice(0, 3);
      if (classes.length > 0) {
        selector += '.' + classes.map((c) => CSS.escape(c)).join('.');
      }
    }

    // nth-child if needed to disambiguate siblings
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (s) => s.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    parts.unshift(selector);
    current = current.parentElement;
  }

  return parts.join(' > ');
}

// --------------- Element metadata extraction -------------------------

function getElementMeta(el: Element): ElementMeta {
  const text = (el.textContent ?? '').trim();
  return {
    textContent: text.length > 200 ? text.slice(0, 200) + '...' : text,
    ariaLabel: el.getAttribute('aria-label'),
    title: el.getAttribute('title'),
    placeholder: el.getAttribute('placeholder'),
    id: el.id || null,
    className: typeof el.className === 'string' ? el.className : '',
    role: el.getAttribute('role'),
  };
}

function getBoundingBox(el: Element): BoundingBox {
  const rect = el.getBoundingClientRect();
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

function getElementText(el: Element): string {
  // Short display text for the element (button label, link text, etc.)
  const directText = Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent?.trim())
    .filter(Boolean)
    .join(' ');

  if (directText) return directText.slice(0, 100);

  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.slice(0, 100);

  const title = el.getAttribute('title');
  if (title) return title.slice(0, 100);

  const innerText = (el as HTMLElement).innerText;
  if (innerText) return innerText.trim().slice(0, 100);

  return '';
}

// --------------- Click tracking --------------------------------------

function handleClick(e: MouseEvent): void {
  if (!isTracking) return;

  const target = e.target as Element;
  if (!target) return;

  // Ignore clicks on our own indicator overlay
  if (target.closest('[data-screenflow-indicator]')) return;

  const click: ClickEvent = {
    timestamp: Date.now() - trackingStartTime,
    x: e.pageX,
    y: e.pageY,
    viewportX: e.clientX,
    viewportY: e.clientY,
    selector: getCssSelector(target),
    elementText: getElementText(target),
    elementTag: target.tagName.toLowerCase(),
    boundingBox: getBoundingBox(target),
    url: window.location.href,
    button: e.button,
    meta: getElementMeta(target),
  };

  clicks.push(click);
}

// --------------- Input tracking --------------------------------------

function handleInput(e: Event): void {
  if (!isTracking) return;

  const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (!target || !target.tagName) return;

  const tag = target.tagName.toLowerCase();
  const type = (target as HTMLInputElement).type?.toLowerCase() ?? '';

  let inputType: SFInputEvent['inputType'] = 'other';
  if (tag === 'textarea') inputType = 'textarea';
  else if (tag === 'select') inputType = 'select';
  else if (type === 'checkbox') inputType = 'checkbox';
  else if (type === 'radio') inputType = 'radio';
  else if (['text', 'email', 'search', 'tel', 'url', 'number'].includes(type)) inputType = 'text';

  const isPassword = type === 'password';
  let value = '';

  if (isPassword) {
    value = '[REDACTED]';
  } else if (inputType === 'checkbox' || inputType === 'radio') {
    value = (target as HTMLInputElement).checked ? 'checked' : 'unchecked';
  } else {
    value = target.value ?? '';
    if (value.length > 500) value = value.slice(0, 500) + '...';
  }

  const inputEvent: SFInputEvent = {
    timestamp: Date.now() - trackingStartTime,
    selector: getCssSelector(target),
    inputType,
    value,
    isPassword,
    url: window.location.href,
  };

  inputs.push(inputEvent);
}

// --------------- Scroll tracking (throttled) -------------------------

let scrollThrottleTimer: ReturnType<typeof setTimeout> | null = null;
const SCROLL_THROTTLE_MS = 250;

function handleScroll(): void {
  if (!isTracking) return;
  if (scrollThrottleTimer) return;

  scrollThrottleTimer = setTimeout(() => {
    scrollThrottleTimer = null;

    const scrollEvent: ScrollEvent = {
      timestamp: Date.now() - trackingStartTime,
      scrollX: Math.round(window.scrollX),
      scrollY: Math.round(window.scrollY),
      maxScrollX: document.documentElement.scrollWidth - window.innerWidth,
      maxScrollY: document.documentElement.scrollHeight - window.innerHeight,
      url: window.location.href,
    };

    scrolls.push(scrollEvent);
  }, SCROLL_THROTTLE_MS);
}

// --------------- Cursor position tracking (30 fps) -------------------

function handleMouseMove(e: MouseEvent): void {
  lastCursorX = e.clientX;
  lastCursorY = e.clientY;
}

function sampleCursorPosition(): void {
  if (!isTracking) return;

  cursorPositions.push({
    timestamp: Date.now() - trackingStartTime,
    x: lastCursorX,
    y: lastCursorY,
  });
}

// --------------- Keyboard shortcut detection -------------------------

function handleKeydown(e: KeyboardEvent): void {
  if (!isTracking) return;

  // Only track modifier key combos (Ctrl/Cmd + key, Alt + key)
  const hasModifier = e.ctrlKey || e.metaKey || e.altKey;
  if (!hasModifier) return;

  // Ignore lone modifier key presses
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
  if (e.shiftKey) parts.push('Shift');
  if (e.altKey) parts.push('Alt');
  parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);

  const shortcut: KeyboardShortcutEvent = {
    timestamp: Date.now() - trackingStartTime,
    key: e.key,
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
    combo: parts.join('+'),
    url: window.location.href,
  };

  keyboardShortcuts.push(shortcut);
}

// --------------- Recording indicator overlay -------------------------

function showIndicator(): void {
  if (indicatorEl) return;

  indicatorEl = document.createElement('div');
  indicatorEl.setAttribute('data-screenflow-indicator', 'true');
  indicatorEl.innerHTML = `
    <div class="screenflow-indicator">
      <span class="screenflow-indicator__dot"></span>
      <span class="screenflow-indicator__label">Recording</span>
    </div>
  `;
  document.body.appendChild(indicatorEl);
}

function hideIndicator(): void {
  if (indicatorEl) {
    indicatorEl.remove();
    indicatorEl = null;
  }
}

// --------------- Start / Stop ----------------------------------------

function startTracking(): void {
  if (isTracking) return;

  isTracking = true;
  trackingStartTime = Date.now();

  // Clear previous data
  clicks.length = 0;
  inputs.length = 0;
  scrolls.length = 0;
  cursorPositions.length = 0;
  keyboardShortcuts.length = 0;

  // Event listeners
  document.addEventListener('click', handleClick, { capture: true, passive: true });
  document.addEventListener('input', handleInput, { capture: true, passive: true });
  document.addEventListener('change', handleInput, { capture: true, passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('keydown', handleKeydown, { capture: true });

  // Cursor sampling at ~30fps
  cursorSampleInterval = setInterval(sampleCursorPosition, 33);

  // Show indicator
  showIndicator();
}

function stopTracking(): TrackingDataPayload {
  isTracking = false;

  // Remove listeners
  document.removeEventListener('click', handleClick, { capture: true } as EventListenerOptions);
  document.removeEventListener('input', handleInput, { capture: true } as EventListenerOptions);
  document.removeEventListener('change', handleInput, { capture: true } as EventListenerOptions);
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('keydown', handleKeydown, { capture: true } as EventListenerOptions);

  if (cursorSampleInterval) {
    clearInterval(cursorSampleInterval);
    cursorSampleInterval = null;
  }

  if (cursorRafId) {
    cancelAnimationFrame(cursorRafId);
    cursorRafId = null;
  }

  hideIndicator();

  const data: TrackingDataPayload = {
    clicks: [...clicks],
    inputs: [...inputs],
    scrolls: [...scrolls],
    cursorPositions: [...cursorPositions],
    keyboardShortcuts: [...keyboardShortcuts],
    url: window.location.href,
    startTime: trackingStartTime,
    endTime: Date.now(),
  };

  // Clear arrays
  clicks.length = 0;
  inputs.length = 0;
  scrolls.length = 0;
  cursorPositions.length = 0;
  keyboardShortcuts.length = 0;

  return data;
}

// --------------- Message listener ------------------------------------

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    switch (message.type) {
      case 'START_TRACKING': {
        startTracking();
        sendResponse({ success: true });
        break;
      }

      case 'STOP_TRACKING': {
        const data = stopTracking();
        sendResponse({ type: 'TRACKING_DATA', payload: data });
        break;
      }

      default:
        break;
    }

    return false;
  },
);
