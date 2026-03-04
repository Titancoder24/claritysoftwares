/* ------------------------------------------------------------------ */
/*  ScreenFlow Chrome Extension – shared type definitions              */
/* ------------------------------------------------------------------ */

// --------------- Recording source / state ---------------------------

export type CaptureSource = 'tab' | 'window' | 'screen';

export interface RecordingOptions {
  source: CaptureSource;
  micEnabled: boolean;
  systemAudioEnabled: boolean;
  webcamEnabled: boolean;
  countdownEnabled: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  tabId: number | null;
  startTime: number | null;
  elapsed: number;
  options: RecordingOptions | null;
}

// --------------- Message types (background <-> popup/content) -------

export type MessageType =
  | 'START_RECORDING'
  | 'STOP_RECORDING'
  | 'PAUSE_RECORDING'
  | 'RESUME_RECORDING'
  | 'GET_STATE'
  | 'STATE_UPDATE'
  | 'START_TRACKING'
  | 'STOP_TRACKING'
  | 'TRACKING_DATA'
  | 'OFFSCREEN_STREAM_READY'
  | 'OFFSCREEN_RECORDING_STOPPED'
  | 'OFFSCREEN_START'
  | 'OFFSCREEN_STOP'
  | 'UPLOAD_COMPLETE';

export interface ExtensionMessage<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface StartRecordingPayload {
  options: RecordingOptions;
  streamId: string;
}

export interface StopRecordingPayload {
  uploadUrl?: string;
}

export interface TrackingDataPayload {
  clicks: ClickEvent[];
  inputs: InputEvent[];
  scrolls: ScrollEvent[];
  cursorPositions: CursorPosition[];
  keyboardShortcuts: KeyboardShortcutEvent[];
  url: string;
  startTime: number;
  endTime: number;
}

export interface OffscreenStartPayload {
  streamId: string;
  micStreamId?: string;
  mimeType: string;
}

export interface OffscreenStoppedPayload {
  blob: Blob;
  duration: number;
}

// --------------- Click / interaction tracking -----------------------

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ClickEvent {
  timestamp: number;
  x: number;
  y: number;
  viewportX: number;
  viewportY: number;
  selector: string;
  elementText: string;
  elementTag: string;
  boundingBox: BoundingBox;
  url: string;
  button: number;
  meta: ElementMeta;
}

export interface ElementMeta {
  textContent: string;
  ariaLabel: string | null;
  title: string | null;
  placeholder: string | null;
  id: string | null;
  className: string;
  role: string | null;
}

export interface InputEvent {
  timestamp: number;
  selector: string;
  inputType: 'text' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'other';
  value: string;
  isPassword: boolean;
  url: string;
}

export interface ScrollEvent {
  timestamp: number;
  scrollX: number;
  scrollY: number;
  maxScrollX: number;
  maxScrollY: number;
  url: string;
}

export interface CursorPosition {
  timestamp: number;
  x: number;
  y: number;
}

export interface KeyboardShortcutEvent {
  timestamp: number;
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  combo: string;
  url: string;
}

// --------------- Upload types --------------------------------------

export interface PresignedUploadUrl {
  url: string;
  fields: Record<string, string>;
}

export interface RecordingUploadResult {
  recordingId: string;
  editorUrl: string;
}
