import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';

export interface WalkthroughStep {
  /** CSS selector for the target element in the host page DOM */
  selector: string;
  title: string;
  body: string;
  /** Optional: wait for a specific event on the target before auto-advancing */
  waitForEvent?: 'click' | 'input' | 'change';
  /** Optional fallback screenshot URL if the element can't be found */
  screenshotUrl?: string;
}

interface WalkthroughEngineProps {
  steps: WalkthroughStep[];
  onComplete: () => void;
  onExit: () => void;
  /** Reference to the host document (outside shadow DOM) */
  hostDocument: Document;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;

function getElementRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PADDING,
    left: r.left - PADDING,
    width: r.width + PADDING * 2,
    height: r.height + PADDING * 2,
  };
}

function computeTooltipPosition(rect: Rect): { top: string; left: string } {
  const spaceBelow = window.innerHeight - (rect.top + rect.height);
  const top =
    spaceBelow > 180
      ? `${rect.top + rect.height + 12}px`
      : `${Math.max(8, rect.top - 12)}px`;

  const left = `${Math.min(Math.max(8, rect.left), window.innerWidth - 316)}px`;

  return spaceBelow > 180
    ? { top, left }
    : { top: `${Math.max(8, rect.top - 180)}px`, left };
}

export function WalkthroughEngine({ steps, onComplete, onExit, hostDocument }: WalkthroughEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [elementFound, setElementFound] = useState(false);
  const observerRef = useRef<number | null>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  // Locate the target element and track its position
  const trackElement = useCallback(() => {
    if (!step) return;
    const el = hostDocument.querySelector(step.selector);
    if (el) {
      setTargetRect(getElementRect(el));
      setElementFound(true);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
      setElementFound(false);
    }
  }, [step, hostDocument]);

  // Poll for element position (handles layout shifts, scrolling)
  useEffect(() => {
    trackElement();
    const id = window.setInterval(trackElement, 400);
    observerRef.current = id;
    return () => window.clearInterval(id);
  }, [trackElement]);

  // Listen for user action on the target element to auto-advance
  useEffect(() => {
    if (!step?.waitForEvent || !elementFound) return;
    const el = hostDocument.querySelector(step.selector);
    if (!el) return;

    const handler = () => {
      if (!isLast) {
        setCurrentStep((s) => s + 1);
      } else {
        onComplete();
      }
    };

    el.addEventListener(step.waitForEvent, handler, { once: true });
    return () => el.removeEventListener(step.waitForEvent!, handler);
  }, [step, elementFound, currentStep, isLast, onComplete, hostDocument]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  if (!step) return null;

  const tooltipPos = targetRect
    ? computeTooltipPosition(targetRect)
    : { top: '50%', left: '50%' };

  return (
    <div class="sf-walkthrough-overlay sf-walkthrough-overlay--active">
      {/* Darkened backdrop */}
      <div class="sf-spotlight" onClick={onExit} />

      {/* Highlight ring around target element */}
      {targetRect && elementFound && (
        <div
          class="sf-highlight-ring"
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
          }}
        />
      )}

      {/* Tooltip */}
      <div class="sf-tooltip" style={tooltipPos}>
        <p class="sf-tooltip__step">
          Step {currentStep + 1} of {steps.length}
        </p>
        <p class="sf-tooltip__title">{step.title}</p>

        {/* Fallback screenshot when element is not found */}
        {!elementFound && step.screenshotUrl && (
          <div class="sf-fallback">
            <img class="sf-fallback__img" src={step.screenshotUrl} alt={step.title} />
            <p class="sf-fallback__label">Element not found on page - showing reference screenshot</p>
          </div>
        )}

        {!elementFound && !step.screenshotUrl && (
          <div class="sf-fallback">
            <p class="sf-fallback__label">
              The target element ({step.selector}) could not be found on this page.
            </p>
          </div>
        )}

        <p class="sf-tooltip__body">{step.body}</p>

        {/* Progress dots */}
        <div class="sf-progress" style={{ marginBottom: '12px' }}>
          {steps.map((_, i) => (
            <span
              key={i}
              class={`sf-progress__dot${
                i < currentStep
                  ? ' sf-progress__dot--done'
                  : i === currentStep
                  ? ' sf-progress__dot--active'
                  : ''
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div class="sf-tooltip__actions">
          <button class="sf-tooltip__btn sf-tooltip__btn--skip" onClick={onExit}>
            Skip
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button class="sf-tooltip__btn sf-tooltip__btn--secondary" onClick={handleBack}>
                Back
              </button>
            )}
            <button class="sf-tooltip__btn sf-tooltip__btn--primary" onClick={handleNext}>
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
