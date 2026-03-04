/* ------------------------------------------------------------------ */
/*  ScreenFlow – Popup UI (Preact)                                     */
/* ------------------------------------------------------------------ */

import { render } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import type {
  CaptureSource,
  RecordingOptions,
  RecordingState,
  ExtensionMessage,
  RecordingUploadResult,
} from '../types';

// --------------- Helpers --------------------------------------------

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, '0');
  const sec = (totalSec % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

// --------------- Components -----------------------------------------

function SourceSelector({
  value,
  onChange,
}: {
  value: CaptureSource;
  onChange: (v: CaptureSource) => void;
}) {
  const sources: { id: CaptureSource; label: string; icon: string }[] = [
    { id: 'tab', label: 'Tab', icon: 'tab' },
    { id: 'window', label: 'Window', icon: 'window' },
    { id: 'screen', label: 'Screen', icon: 'screen' },
  ];

  return (
    <div class="source-selector">
      {sources.map((s) => (
        <button
          key={s.id}
          class={`source-btn ${value === s.id ? 'source-btn--active' : ''}`}
          onClick={() => onChange(s.id)}
          type="button"
        >
          <SourceIcon type={s.icon} />
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}

function SourceIcon({ type }: { type: string }) {
  switch (type) {
    case 'tab':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 3v6" />
        </svg>
      );
    case 'window':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M2 9h20" />
          <circle cx="6" cy="6" r="0.5" fill="currentColor" />
          <circle cx="9" cy="6" r="0.5" fill="currentColor" />
          <circle cx="12" cy="6" r="0.5" fill="currentColor" />
        </svg>
      );
    case 'screen':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    default:
      return null;
  }
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label class={`toggle ${disabled ? 'toggle--disabled' : ''}`}>
      <span class="toggle__label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        class={`toggle__switch ${checked ? 'toggle__switch--on' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span class="toggle__thumb" />
      </button>
    </label>
  );
}

// --------------- Main App -------------------------------------------

function App() {
  const [state, setState] = useState<RecordingState | null>(null);
  const [source, setSource] = useState<CaptureSource>('tab');
  const [micEnabled, setMicEnabled] = useState(true);
  const [systemAudio, setSystemAudio] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [countdownEnabled, setCountdownEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [uploadResult, setUploadResult] = useState<RecordingUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch initial state
  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: 'GET_STATE' } as ExtensionMessage,
      (response: RecordingState) => {
        if (response) setState(response);
      },
    );

    // Check login status
    chrome.storage.local.get('authToken', (data) => {
      setIsLoggedIn(!!data.authToken);
    });
  }, []);

  // Listen for state updates from background
  useEffect(() => {
    const listener = (message: ExtensionMessage) => {
      if (message.type === 'STATE_UPDATE') {
        setState(message.payload as RecordingState);
      }
      if (message.type === 'UPLOAD_COMPLETE') {
        setUploadResult(message.payload as RecordingUploadResult);
        setIsLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  // Local timer for responsive display
  useEffect(() => {
    if (state?.isRecording && !state.isPaused && state.startTime) {
      timerRef.current = setInterval(() => {
        setState((prev) =>
          prev ? { ...prev, elapsed: Date.now() - (prev.startTime ?? Date.now()) } : prev,
        );
      }, 200);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state?.isRecording, state?.isPaused]);

  const handleStartRecording = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setUploadResult(null);

    const options: RecordingOptions = {
      source,
      micEnabled,
      systemAudioEnabled: systemAudio,
      webcamEnabled,
      countdownEnabled,
    };

    chrome.runtime.sendMessage(
      { type: 'START_RECORDING', payload: options } as ExtensionMessage,
      (response: { success: boolean; error?: string }) => {
        setIsLoading(false);
        if (!response?.success) {
          setError(response?.error ?? 'Failed to start recording.');
        }
      },
    );
  }, [source, micEnabled, systemAudio, webcamEnabled, countdownEnabled]);

  const handleStopRecording = useCallback(() => {
    setIsLoading(true);
    chrome.runtime.sendMessage({ type: 'STOP_RECORDING' } as ExtensionMessage);
  }, []);

  const handlePauseResume = useCallback(() => {
    if (state?.isPaused) {
      chrome.runtime.sendMessage({ type: 'RESUME_RECORDING' } as ExtensionMessage);
    } else {
      chrome.runtime.sendMessage({ type: 'PAUSE_RECORDING' } as ExtensionMessage);
    }
  }, [state?.isPaused]);

  const handleLogin = useCallback(() => {
    chrome.tabs.create({ url: 'https://app.screenflow.dev/login?from=extension' });
  }, []);

  // ---- Render: Login prompt ----
  if (!isLoggedIn) {
    return (
      <div class="popup">
        <Header />
        <div class="popup__body popup__body--center">
          <p class="text-muted">Sign in to start recording and save your screencasts.</p>
          <button class="btn btn--primary btn--full" onClick={handleLogin} type="button">
            Sign in to ScreenFlow
          </button>
        </div>
      </div>
    );
  }

  // ---- Render: Post-recording (upload result) ----
  if (uploadResult) {
    return (
      <div class="popup">
        <Header />
        <div class="popup__body popup__body--center">
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <p class="text-primary">Recording saved!</p>
          <button
            class="btn btn--primary btn--full"
            onClick={() => {
              chrome.tabs.create({ url: uploadResult.editorUrl });
              window.close();
            }}
            type="button"
          >
            Open in Editor
          </button>
          <button
            class="btn btn--ghost btn--full"
            onClick={() => setUploadResult(null)}
            type="button"
          >
            Record another
          </button>
        </div>
      </div>
    );
  }

  // ---- Render: Recording in progress ----
  if (state?.isRecording) {
    return (
      <div class="popup">
        <Header />
        <div class="popup__body popup__body--center">
          <div class="timer">
            <span class={`timer__dot ${state.isPaused ? 'timer__dot--paused' : ''}`} />
            <span class="timer__value">{formatTime(state.elapsed)}</span>
          </div>

          <div class="recording-controls">
            <button
              class="btn btn--outline"
              onClick={handlePauseResume}
              type="button"
            >
              {state.isPaused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
              {state.isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              class="btn btn--danger"
              onClick={handleStopRecording}
              disabled={isLoading}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
              Stop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Render: Ready to record ----
  return (
    <div class="popup">
      <Header />
      <div class="popup__body">
        <section class="section">
          <h3 class="section__title">Capture Source</h3>
          <SourceSelector value={source} onChange={setSource} />
        </section>

        <section class="section">
          <h3 class="section__title">Options</h3>
          <div class="toggles">
            <Toggle label="Microphone" checked={micEnabled} onChange={setMicEnabled} />
            <Toggle label="System Audio" checked={systemAudio} onChange={setSystemAudio} />
            <Toggle label="Webcam" checked={webcamEnabled} onChange={setWebcamEnabled} />
            <Toggle label="Countdown" checked={countdownEnabled} onChange={setCountdownEnabled} />
          </div>
        </section>

        {error && <p class="error-text">{error}</p>}

        <button
          class="btn btn--primary btn--full btn--large"
          onClick={handleStartRecording}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? 'Starting...' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header class="popup__header">
      <div class="popup__logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
        </svg>
        <span>ScreenFlow</span>
      </div>
    </header>
  );
}

// --------------- Mount -----------------------------------------------

const root = document.getElementById('app');
if (root) render(<App />, root);
