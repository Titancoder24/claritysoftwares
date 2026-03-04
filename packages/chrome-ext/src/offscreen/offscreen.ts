/* ------------------------------------------------------------------ */
/*  ScreenFlow – Offscreen Document                                    */
/*  Handles MediaRecorder in a document context (required by Chrome).  */
/* ------------------------------------------------------------------ */

import type { ExtensionMessage, OffscreenStartPayload } from '../types';

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
let mediaStream: MediaStream | null = null;
let micStream: MediaStream | null = null;
let recordingStartTime = 0;

// --------------- Stream creation ------------------------------------

async function createMediaStream(streamId: string): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamId,
      },
    } as MediaTrackConstraints,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamId,
        maxWidth: 3840,
        maxHeight: 2160,
        maxFrameRate: 30,
      },
    } as MediaTrackConstraints,
  });

  return stream;
}

async function createMicStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
}

function combineStreams(desktop: MediaStream, mic?: MediaStream): MediaStream {
  if (!mic) return desktop;

  // Combine desktop video + desktop audio + mic audio using AudioContext
  const audioCtx = new AudioContext();
  const destination = audioCtx.createMediaStreamDestination();

  // Add desktop audio tracks
  const desktopAudioTracks = desktop.getAudioTracks();
  if (desktopAudioTracks.length > 0) {
    const desktopSource = audioCtx.createMediaStreamSource(
      new MediaStream(desktopAudioTracks),
    );
    desktopSource.connect(destination);
  }

  // Add mic audio
  const micSource = audioCtx.createMediaStreamSource(mic);
  micSource.connect(destination);

  // Combine: desktop video + mixed audio
  const combined = new MediaStream([
    ...desktop.getVideoTracks(),
    ...destination.stream.getAudioTracks(),
  ]);

  return combined;
}

// --------------- Recording ------------------------------------------

async function startRecording(payload: OffscreenStartPayload): Promise<void> {
  const { streamId, mimeType } = payload;

  // Create desktop stream
  mediaStream = await createMediaStream(streamId);

  // Optionally create mic stream
  if (payload.micStreamId) {
    try {
      micStream = await createMicStream();
    } catch (err) {
      console.warn('[ScreenFlow] Failed to capture mic audio:', err);
    }
  }

  // Combine streams
  const combinedStream = combineStreams(mediaStream, micStream ?? undefined);

  // Initialize MediaRecorder
  const options: MediaRecorderOptions = {
    mimeType: MediaRecorder.isTypeSupported(mimeType)
      ? mimeType
      : 'video/webm;codecs=vp8,opus',
    videoBitsPerSecond: 5_000_000,
  };

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(combinedStream, options);

  mediaRecorder.ondataavailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const duration = Date.now() - recordingStartTime;
    const blob = new Blob(recordedChunks, { type: options.mimeType });

    // Send the blob back to the background service worker
    chrome.runtime.sendMessage({
      type: 'OFFSCREEN_RECORDING_STOPPED',
      payload: { blob, duration },
    } as ExtensionMessage);

    cleanup();
  };

  mediaRecorder.onerror = (event) => {
    console.error('[ScreenFlow] MediaRecorder error:', event);
    cleanup();
  };

  recordingStartTime = Date.now();
  mediaRecorder.start(1000); // Collect data every second
}

function stopRecording(): void {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function pauseRecording(): void {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
  }
}

function resumeRecording(): void {
  if (mediaRecorder && mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
  }
}

function cleanup(): void {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
    micStream = null;
  }
  mediaRecorder = null;
  recordedChunks = [];
}

// --------------- Message listener ------------------------------------

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    switch (message.type) {
      case 'OFFSCREEN_START': {
        const payload = message.payload as OffscreenStartPayload;
        startRecording(payload)
          .then(() => sendResponse({ success: true }))
          .catch((err: Error) => sendResponse({ success: false, error: err.message }));
        return true; // async response
      }

      case 'OFFSCREEN_STOP': {
        stopRecording();
        sendResponse({ success: true });
        break;
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

      default:
        break;
    }

    return false;
  },
);
