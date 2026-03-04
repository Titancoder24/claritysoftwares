import { StepType, TooltipPosition, DEFAULT_ZOOM_LEVEL, DEFAULT_ZOOM_DURATION_MS } from './constants';
import type {
  ClickEvent,
  InputEvent,
  DomSnapshot,
  ZoomKeyframe,
  GuideStep,
  WalkthroughStep,
} from './types';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

let _idCounter = 0;

/** Generate a deterministic pseudo-UUID (good enough for client-side drafts). */
function generateId(): string {
  _idCounter += 1;
  const ts = Date.now().toString(16).padStart(12, '0');
  const seq = _idCounter.toString(16).padStart(4, '0');
  const rand = Math.random().toString(16).slice(2, 14).padStart(12, '0');
  return `${ts.slice(0, 8)}-${ts.slice(8)}-4${seq.slice(0, 3)}-${seq.slice(3)}${rand.slice(0, 3)}-${rand.slice(3)}`;
}

/** Reset the internal ID counter (useful in tests). */
export function resetIdCounter(): void {
  _idCounter = 0;
}

/**
 * Derive a human-readable action description from a click event.
 * Examples:
 *  - 'Click the "Save" button'
 *  - 'Click the submit link'
 */
function describeClickAction(click: ClickEvent): string {
  const tag = click.tagName.toLowerCase();
  const text = click.innerText.trim().slice(0, 80);

  if (text) {
    const friendlyTag = tag === 'a' ? 'link' : tag === 'button' ? 'button' : tag;
    return `Click the "${text}" ${friendlyTag}`;
  }
  return `Click on ${click.selector}`;
}

/**
 * Derive a human-readable action description from an input event.
 * Examples:
 *  - 'Type "hello" in the Email field'
 *  - 'Enter text in the search input'
 */
function describeInputAction(input: InputEvent): string {
  const fieldName = input.label || input.placeholder || input.selector;
  const preview = input.value.length > 40 ? `${input.value.slice(0, 37)}...` : input.value;
  return `Type "${preview}" in the ${fieldName} field`;
}

// ──────────────────────────────────────────────
// generateZoomKeyframes
// ──────────────────────────────────────────────

export interface ZoomKeyframeOptions {
  /** Zoom scale multiplier. Default: DEFAULT_ZOOM_LEVEL (1.5). */
  scale?: number;
  /** Duration the zoom holds in ms. Default: 1500. */
  holdMs?: number;
  /** Transition-in duration in ms. Default: DEFAULT_ZOOM_DURATION_MS (600). */
  transitionInMs?: number;
  /** Transition-out duration in ms. Default: DEFAULT_ZOOM_DURATION_MS (600). */
  transitionOutMs?: number;
  /** Recording viewport width in pixels (used for normalisation). */
  viewportWidth?: number;
  /** Recording viewport height in pixels (used for normalisation). */
  viewportHeight?: number;
  /** Minimum gap between consecutive zoom keyframes in ms. Default: 300. */
  minGapMs?: number;
}

/**
 * Generate zoom keyframes from click events.
 *
 * Each click produces a keyframe that zooms into the click location,
 * holds for a short period, then zooms back out. Clicks that are too
 * close together in time are merged into a single keyframe centred
 * between them.
 *
 * @param clickEvents - Sorted array of click events from the recording.
 * @param options     - Optional tuning parameters.
 * @returns Array of ZoomKeyframe objects ready to be stored in VideoProjectData.
 */
export function generateZoomKeyframes(
  clickEvents: ClickEvent[],
  options: ZoomKeyframeOptions = {},
): ZoomKeyframe[] {
  const {
    scale = DEFAULT_ZOOM_LEVEL,
    holdMs = 1500,
    transitionInMs = DEFAULT_ZOOM_DURATION_MS,
    transitionOutMs = DEFAULT_ZOOM_DURATION_MS,
    viewportWidth = 1920,
    viewportHeight = 1080,
    minGapMs = 300,
  } = options;

  if (clickEvents.length === 0) return [];

  // Sort by time
  const sorted = [...clickEvents].sort((a, b) => a.t - b.t);

  // Group clicks that are close together in time
  const groups: ClickEvent[][] = [];
  let currentGroup: ClickEvent[] = [sorted[0]!];

  for (let i = 1; i < sorted.length; i++) {
    const prev = currentGroup[currentGroup.length - 1]!;
    const curr = sorted[i]!;

    if (curr.t - prev.t < holdMs + transitionOutMs + minGapMs) {
      // Too close -- merge into current group
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }
  groups.push(currentGroup);

  // Create one keyframe per group
  return groups.map((group) => {
    const firstClick = group[0]!;
    const lastClick = group[group.length - 1]!;

    // Average position for the focus point
    const avgX = group.reduce((sum, c) => sum + c.x, 0) / group.length;
    const avgY = group.reduce((sum, c) => sum + c.y, 0) / group.length;

    // Normalise to 0-1 range
    const focusX = Math.max(0, Math.min(1, avgX / viewportWidth));
    const focusY = Math.max(0, Math.min(1, avgY / viewportHeight));

    const startMs = Math.max(0, firstClick.t - transitionInMs);
    const endMs = lastClick.t + holdMs + transitionOutMs;

    return {
      id: generateId(),
      startMs,
      endMs,
      scale,
      focusX,
      focusY,
      easingIn: 'spring',
      easingOut: 'spring',
      transitionInMs,
      transitionOutMs,
    };
  });
}

// ──────────────────────────────────────────────
// generateGuideSteps
// ──────────────────────────────────────────────

export interface GuideStepOptions {
  /** Whether to include input events as separate steps. Default: true. */
  includeInputs?: boolean;
}

/**
 * Generate step-by-step guide from click and input events.
 *
 * Interleaves click and input events chronologically, producing a
 * human-readable guide step for each action.
 *
 * @param clickEvents - Click events from the recording.
 * @param inputEvents - Input events from the recording.
 * @param options     - Optional configuration.
 * @returns Ordered array of GuideStep objects.
 */
export function generateGuideSteps(
  clickEvents: ClickEvent[],
  inputEvents: InputEvent[],
  options: GuideStepOptions = {},
): GuideStep[] {
  const { includeInputs = true } = options;

  // Build a unified timeline
  type TimelineEntry =
    | { kind: 'click'; t: number; event: ClickEvent }
    | { kind: 'input'; t: number; event: InputEvent };

  const timeline: TimelineEntry[] = [];

  for (const click of clickEvents) {
    timeline.push({ kind: 'click', t: click.t, event: click });
  }

  if (includeInputs) {
    for (const input of inputEvents) {
      timeline.push({ kind: 'input', t: input.t, event: input });
    }
  }

  // Sort chronologically
  timeline.sort((a, b) => a.t - b.t);

  return timeline.map((entry, index): GuideStep => {
    if (entry.kind === 'click') {
      const click = entry.event;
      return {
        id: generateId(),
        order: index,
        type: StepType.Click,
        title: describeClickAction(click),
        description: `Navigate to ${click.pageUrl} and ${describeClickAction(click).toLowerCase()}.`,
        screenshotUrl: click.screenshotDataUrl,
        selector: click.selector,
        annotations: [],
        pageUrl: click.pageUrl,
      };
    } else {
      const input = entry.event;
      return {
        id: generateId(),
        order: index,
        type: StepType.Input,
        title: describeInputAction(input),
        description: describeInputAction(input) + '.',
        screenshotUrl: null,
        selector: input.selector,
        annotations: [],
        pageUrl: null,
      };
    }
  });
}

// ──────────────────────────────────────────────
// generateWalkthroughSteps
// ──────────────────────────────────────────────

export interface WalkthroughStepOptions {
  /** Default tooltip position. Default: TooltipPosition.Bottom. */
  defaultPosition?: TooltipPosition;
  /** Whether all steps require action to advance. Default: true. */
  required?: boolean;
}

/**
 * Generate interactive walkthrough steps from DOM snapshots.
 *
 * Each DOM snapshot represents a user interaction point. The function
 * creates a walkthrough step that highlights the target element and
 * provides instructions.
 *
 * @param domSnapshots - DOM snapshots captured during recording.
 * @param options      - Optional configuration.
 * @returns Ordered array of WalkthroughStep objects.
 */
export function generateWalkthroughSteps(
  domSnapshots: DomSnapshot[],
  options: WalkthroughStepOptions = {},
): WalkthroughStep[] {
  const {
    defaultPosition = TooltipPosition.Bottom,
    required = true,
  } = options;

  // Sort by time
  const sorted = [...domSnapshots].sort((a, b) => a.t - b.t);

  return sorted.map((snapshot, index): WalkthroughStep => {
    // Determine step type from the element tag / attributes
    const tag = extractTagName(snapshot.outerHtml);
    const type = inferStepType(tag, snapshot.outerHtml);

    // Choose tooltip position based on element location on screen
    const position = inferTooltipPosition(snapshot.rect, defaultPosition);

    // Generate human-readable title
    const title = generateStepTitle(type, snapshot);

    return {
      id: generateId(),
      order: index,
      type,
      title,
      content: `Step ${index + 1}: ${title}`,
      selector: snapshot.selector,
      tooltipPosition: position,
      required,
      urlPattern: snapshot.pageUrl,
      expectedAction: null,
    };
  });
}

// ──────────────────────────────────────────────
// Internal helpers for walkthrough generation
// ──────────────────────────────────────────────

/** Extract the tag name from an outerHTML string. */
function extractTagName(outerHtml: string): string {
  const match = outerHtml.match(/^<(\w+)/);
  return match ? match[1]!.toLowerCase() : 'div';
}

/** Infer the step type from the element's tag and HTML. */
function inferStepType(tag: string, outerHtml: string): StepType {
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return StepType.Input;
  }
  if (tag === 'a' && outerHtml.includes('href')) {
    return StepType.Navigation;
  }
  return StepType.Click;
}

/**
 * Infer the best tooltip position based on where the element sits
 * in the viewport. If the element is near the top, position below;
 * if near the bottom, position above, etc.
 */
function inferTooltipPosition(
  rect: { x: number; y: number; width: number; height: number },
  fallback: TooltipPosition,
): TooltipPosition {
  // Assume a 1920x1080 viewport for heuristic purposes
  const centerY = rect.y + rect.height / 2;
  const centerX = rect.x + rect.width / 2;

  if (centerY < 200) return TooltipPosition.Bottom;
  if (centerY > 880) return TooltipPosition.Top;
  if (centerX < 300) return TooltipPosition.Right;
  if (centerX > 1620) return TooltipPosition.Left;

  return fallback;
}

/** Generate a human-readable title for a walkthrough step. */
function generateStepTitle(type: StepType, snapshot: DomSnapshot): string {
  const tag = extractTagName(snapshot.outerHtml);

  switch (type) {
    case StepType.Input:
      return `Enter information in the ${tag} field`;
    case StepType.Navigation:
      return `Click the link to navigate`;
    case StepType.Click:
      return `Click on the ${tag} element`;
    default:
      return `Interact with the ${tag} element`;
  }
}
