/* ------------------------------------------------------------------ */
/*  ScreenFlow – Background Service Worker                             */
/*  Manages recording lifecycle, offscreen document, and upload.       */
/* ------------------------------------------------------------------ */

import type {
  RecordingState,
  RecordingOptions,
  ExtensionMessage,
  StartRecordingPayload,
  TrackingDataPayload,
  OffscreenStoppedPayload,
} from './types';

// --------------- State ----------------------------------------------

const DEFAULT_STATE: RecordingState = {
  isRecording: false,
  isPaused: false,
  tabId: null,
  startTime: null,
  elapsed: 0,
  options: null,
};

let state: RecordingState = { ...DEFAULT_STATE };
let elapsedInterval: ReturnType<typeof setInterval> | null = null;
let lastTrackingData: TrackingDataPayload | null = null;
let recordedBlob: Blob | null = null;

// --------------- Badge helpers --------------------------------------

function updateBadge(): void {
  if (state.isRecording && !state.isPaused) {
    chrome.action.setBadgeText({ text: 'REC' });
    chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
  } else if (state.isRecording && state.isPaused) {
    chrome.action.setBadgeText({ text: '||' });
    chrome.action.setBadgeBackgroundColor({ color: '#F59E0B' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

function broadcastState(): void {
  const msg: ExtensionMessage<RecordingState> = {
    type: 'STATE_UPDATE',
    payload: { ...state },
  };
  chrome.runtime.sendMessage(msg).catch(() => {
    /* popup may be closed – that's fine */
  });
}

// --------------- Elapsed timer --------------------------------------

function startElapsedTimer(): void {
  stopElapsedTimer();
  state.startTime = Date.now();
  state.elapsed = 0;
  elapsedInterval = setInterval(() => {
    if (state.startTime && !state.isPaused) {
      state.elapsed = Date.now() - state.startTime;
      broadcastState();
    }
  }, 500);
}

function stopElapsedTimer(): void {
  if (elapsedInterval !== null) {
    clearInterval(elapsedInterval);
    elapsedInterval = null;
  }
}

// --------------- Offscreen document ---------------------------------

const OFFSCREEN_PATH = 'src/offscreen/offscreen.html';

async function ensureOffscreenDocument(): Promise<void> {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)],
  });

  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_PATH,
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: 'MediaRecorder requires a document context to record captured media streams.',
  });
}

async function closeOffscreenDocument(): Promise<void> {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)],
  });

  if (existingContexts.length > 0) {
    await chrome.offscreen.closeDocument();
  }
}

// --------------- Desktop capture ------------------------------------

function requestDesktopCapture(
  options: RecordingOptions,
  tab: chrome.tabs.Tab,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const sources: chrome.desktopCapture.DesktopCaptureSourceType[] = [];

    switch (options.source) {
      case 'tab':
        sources.push('tab');
        break;
      case 'window':
        sources.push('window');
        break;
      case 'screen':
        sources.push('screen');
        break;
    }

    chrome.desktopCapture.chooseDesktopMedia(sources, tab, (streamId) => {
      if (!streamId) {
        reject(new Error('User cancelled desktop capture selection.'));
        return;
      }
      resolve(streamId);
    });
  });
}

// --------------- Content-script injection ---------------------------

async function injectContentScript(tabId: number): Promise<void> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['src/content-script.ts'],
    });
  } catch {
    // Content script may already be injected via manifest – that's ok.
  }
}

// --------------- Recording lifecycle --------------------------------

async function startRecording(
  options: RecordingOptions,
  sender: chrome.runtime.MessageSender,
): Promise<void> {
  if (state.isRecording) return;

  const tab = sender.tab ?? (await getCurrentTab());
  if (!tab?.id) throw new Error('No active tab found.');

  const tabId = tab.id;

  // 1. Get desktop capture stream id
  const streamId = await requestDesktopCapture(options, tab);

  // 2. Prepare offscreen document
  await ensureOffscreenDocument();

  // 3. Determine preferred MIME type
  const mimeType = 'video/webm;codecs=vp9,opus';

  // 4. Tell offscreen to start recording
  const startMsg: ExtensionMessage = {
    type: 'OFFSCREEN_START',
    payload: { streamId, mimeType } as StartRecordingPayload,
  };
  await chrome.runtime.sendMessage(startMsg);

  // 5. Inject content-script and start tracking
  await injectContentScript(tabId);
  await chrome.tabs.sendMessage(tabId, { type: 'START_TRACKING' } as ExtensionMessage);

  // 6. Update state
  state = {
    isRecording: true,
    isPaused: false,
    tabId,
    startTime: Date.now(),
    elapsed: 0,
    options,
  };

  startElapsedTimer();
  updateBadge();
  broadcastState();
}

async function stopRecording(): Promise<void> {
  if (!state.isRecording) return;

  // 1. Stop content-script tracking and collect data
  if (state.tabId) {
    try {
      const response = await chrome.tabs.sendMessage(state.tabId, {
        type: 'STOP_TRACKING',
      } as ExtensionMessage);
      if (response?.type === 'TRACKING_DATA') {
        lastTrackingData = response.payload as TrackingDataPayload;
      }
    } catch {
      // Tab may have been closed.
    }
  }

  // 2. Stop offscreen recorder
  await chrome.runtime.sendMessage({ type: 'OFFSCREEN_STOP' } as ExtensionMessage);

  // 3. Stop elapsed timer
  stopElapsedTimer();

  // 4. Reset state
  const prevState = { ...state };
  state = { ...DEFAULT_STATE };

  updateBadge();
  broadcastState();

  // 5. Upload if we have a blob (set by OFFSCREEN_RECORDING_STOPPED handler)
  if (recordedBlob) {
    await uploadRecording(recordedBlob, lastTrackingData, prevState);
    recordedBlob = null;
    lastTrackingData = null;
  }

  // 6. Clean up offscreen document
  await closeOffscreenDocument();
}

function pauseRecording(): void {
  if (!state.isRecording || state.isPaused) return;

  state.isPaused = true;

  // Pause the offscreen MediaRecorder
  chrome.runtime.sendMessage({ type: 'PAUSE_RECORDING' } as ExtensionMessage).catch(() => {});

  updateBadge();
  broadcastState();
}

function resumeRecording(): void {
  if (!state.isRecording || !state.isPaused) return;

  state.isPaused = false;

  // Resume the offscreen MediaRecorder
  chrome.runtime.sendMessage({ type: 'RESUME_RECORDING' } as ExtensionMessage).catch(() => {});

  updateBadge();
  broadcastState();
}

// --------------- Upload ---------------------------------------------

async function uploadRecording(
  blob: Blob,
  trackingData: TrackingDataPayload | null,
  recordingState: RecordingState,
): Promise<void> {
  try {
    // 1. Request presigned upload URL from API
    const apiBase = await getApiBaseUrl();
    const token = await getAuthToken();

    if (!apiBase || !token) {
      console.warn('[ScreenFlow] No API base or auth token – skipping upload.');
      return;
    }

    const presignedRes = await fetch(`${apiBase}/api/recordings/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mimeType: blob.type,
        size: blob.size,
        duration: recordingState.elapsed,
        source: recordingState.options?.source ?? 'tab',
      }),
    });

    if (!presignedRes.ok) {
      console.error('[ScreenFlow] Failed to get presigned URL:', presignedRes.statusText);
      return;
    }

    const { url: uploadUrl, recordingId, editorUrl } = await presignedRes.json();

    // 2. Upload video blob
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': blob.type },
      body: blob,
    });

    // 3. Upload tracking data
    if (trackingData) {
      await fetch(`${apiBase}/api/recordings/${recordingId}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trackingData),
      });
    }

    // 4. Notify popup of upload completion
    chrome.runtime.sendMessage({
      type: 'UPLOAD_COMPLETE',
      payload: { recordingId, editorUrl },
    } as ExtensionMessage).catch(() => {});
  } catch (err) {
    console.error('[ScreenFlow] Upload error:', err);
  }
}

// --------------- Storage helpers ------------------------------------

async function getApiBaseUrl(): Promise<string | null> {
  const { apiBaseUrl } = await chrome.storage.local.get('apiBaseUrl');
  return apiBaseUrl ?? null;
}

async function getAuthToken(): Promise<string | null> {
  const { authToken } = await chrome.storage.local.get('authToken');
  return authToken ?? null;
}

async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// --------------- Message listener -----------------------------------

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    const { type, payload } = message;

    switch (type) {
      case 'START_RECORDING': {
        const options = payload as RecordingOptions;
        startRecording(options, sender)
          .then(() => sendResponse({ success: true }))
          .catch((err: Error) => sendResponse({ success: false, error: err.message }));
        return true; // async response
      }

      case 'STOP_RECORDING': {
        stopRecording()
          .then(() => sendResponse({ success: true }))
          .catch((err: Error) => sendResponse({ success: false, error: err.message }));
        return true;
      }

      case 'PAUSE_RECORDING': {
        pauseRecording();
        sendResponse({ success: true });
        break;
      }

      case 'RESUME_RECORDING': {
        resumeRecording();
        sendResponse({ success: true });
        break;
      }

      case 'GET_STATE': {
        sendResponse({ ...state });
        break;
      }

      case 'OFFSCREEN_RECORDING_STOPPED': {
        const data = payload as OffscreenStoppedPayload;
        recordedBlob = data.blob;
        break;
      }

      default:
        break;
    }

    return false;
  },
);

// --------------- Install / update -----------------------------------

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default config
    chrome.storage.local.set({
      apiBaseUrl: 'https://app.screenflow.dev',
    });
  }
});
