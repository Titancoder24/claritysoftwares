import {
  DEFAULT_SPRING_STIFFNESS,
  DEFAULT_SPRING_DAMPING,
  DEFAULT_SPRING_MASS,
} from './constants';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

/** Configuration for a damped spring simulation. */
export interface SpringConfig {
  /** Spring stiffness (k). Higher = snappier. Default: 170. */
  stiffness: number;
  /** Damping coefficient (c). Higher = less oscillation. Default: 26. */
  damping: number;
  /** Mass of the object (m). Higher = more inertia. Default: 1. */
  mass: number;
  /**
   * Velocity threshold below which the spring is considered at rest.
   * Default: 0.001.
   */
  restVelocityThreshold: number;
  /**
   * Displacement threshold below which the spring is considered at rest.
   * Default: 0.001.
   */
  restDisplacementThreshold: number;
}

/** The instantaneous state of the spring. */
export interface SpringState {
  /** Current value. */
  value: number;
  /** Current velocity. */
  velocity: number;
  /** Whether the spring has settled. */
  atRest: boolean;
}

/** A snapshot of the spring at a given time (useful for pre-computed easing curves). */
export interface SpringFrame {
  /** Normalised time (0-1). */
  t: number;
  /** Normalised value (0-1 for a 0->1 animation, may overshoot). */
  value: number;
}

// ──────────────────────────────────────────────
// Default config
// ──────────────────────────────────────────────

/** Sensible defaults for a snappy yet natural zoom animation. */
export const DEFAULT_SPRING_CONFIG: SpringConfig = {
  stiffness: DEFAULT_SPRING_STIFFNESS,
  damping: DEFAULT_SPRING_DAMPING,
  mass: DEFAULT_SPRING_MASS,
  restVelocityThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

/** A "gentle" preset with more oscillation. */
export const SPRING_PRESET_GENTLE: SpringConfig = {
  stiffness: 120,
  damping: 14,
  mass: 1,
  restVelocityThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

/** A "stiff" preset with almost no oscillation. */
export const SPRING_PRESET_STIFF: SpringConfig = {
  stiffness: 300,
  damping: 30,
  mass: 1,
  restVelocityThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

/** A "bouncy" preset with pronounced overshoot. */
export const SPRING_PRESET_BOUNCY: SpringConfig = {
  stiffness: 200,
  damping: 10,
  mass: 0.8,
  restVelocityThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

// ──────────────────────────────────────────────
// Core simulation
// ──────────────────────────────────────────────

/**
 * Advance a damped spring by one time step using semi-implicit Euler integration.
 *
 * The equation of motion is:
 *   a = (-k * (x - target) - c * v) / m
 *
 * where k = stiffness, c = damping, m = mass, x = current value,
 * v = current velocity, target = destination value.
 *
 * @param current  - Current spring state.
 * @param target   - Target (rest) value.
 * @param dt       - Time step in seconds.
 * @param config   - Spring configuration.
 * @returns Updated spring state after the time step.
 */
export function stepSpring(
  current: SpringState,
  target: number,
  dt: number,
  config: Partial<SpringConfig> = {},
): SpringState {
  const {
    stiffness = DEFAULT_SPRING_CONFIG.stiffness,
    damping = DEFAULT_SPRING_CONFIG.damping,
    mass = DEFAULT_SPRING_CONFIG.mass,
    restVelocityThreshold = DEFAULT_SPRING_CONFIG.restVelocityThreshold,
    restDisplacementThreshold = DEFAULT_SPRING_CONFIG.restDisplacementThreshold,
  } = config;

  const displacement = current.value - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * current.velocity;
  const acceleration = (springForce + dampingForce) / mass;

  // Semi-implicit Euler: update velocity first, then position
  const newVelocity = current.velocity + acceleration * dt;
  const newValue = current.value + newVelocity * dt;

  const atRest =
    Math.abs(newVelocity) < restVelocityThreshold &&
    Math.abs(newValue - target) < restDisplacementThreshold;

  return {
    value: atRest ? target : newValue,
    velocity: atRest ? 0 : newVelocity,
    atRest,
  };
}

// ──────────────────────────────────────────────
// Pre-computed easing curve
// ──────────────────────────────────────────────

/**
 * Pre-compute a spring easing curve from 0 to 1.
 *
 * Returns an array of { t, value } frames that can be used as a
 * lookup table for easing. The curve is normalised so that t=0
 * corresponds to the animation start and t=1 to the animation end.
 *
 * @param durationMs - Desired animation duration in milliseconds.
 * @param config     - Spring configuration.
 * @param fps        - Frames per second for the lookup table. Default: 60.
 * @returns Array of SpringFrame objects.
 */
export function computeSpringCurve(
  durationMs: number,
  config: Partial<SpringConfig> = {},
  fps: number = 60,
): SpringFrame[] {
  const totalFrames = Math.max(1, Math.ceil((durationMs / 1000) * fps));
  const dt = 1 / fps; // time step in seconds

  const frames: SpringFrame[] = [];
  let state: SpringState = { value: 0, velocity: 0, atRest: false };

  for (let i = 0; i <= totalFrames; i++) {
    const t = i / totalFrames;
    frames.push({ t, value: state.value });

    if (!state.atRest) {
      state = stepSpring(state, 1, dt, config);
    }
  }

  // Ensure the last frame lands exactly at 1
  frames[frames.length - 1] = { t: 1, value: 1 };

  return frames;
}

/**
 * Sample a pre-computed spring curve at a given normalised time.
 *
 * Uses linear interpolation between the two nearest frames for
 * sub-frame accuracy.
 *
 * @param curve - Pre-computed spring frames from `computeSpringCurve`.
 * @param t     - Normalised time (0-1).
 * @returns Interpolated value at time t.
 */
export function sampleSpringCurve(curve: SpringFrame[], t: number): number {
  if (curve.length === 0) return t;
  if (t <= 0) return curve[0]!.value;
  if (t >= 1) return curve[curve.length - 1]!.value;

  // Binary search for the surrounding frames
  let lo = 0;
  let hi = curve.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (curve[mid]!.t <= t) lo = mid;
    else hi = mid;
  }

  const f0 = curve[lo]!;
  const f1 = curve[hi]!;
  const segmentT = f1.t - f0.t;
  if (segmentT < 1e-10) return f0.value;

  const localT = (t - f0.t) / segmentT;
  return f0.value + localT * (f1.value - f0.value);
}

// ──────────────────────────────────────────────
// Convenience: spring easing function
// ──────────────────────────────────────────────

/**
 * Create a spring-based easing function.
 *
 * Returns a function `(t: number) => number` that maps normalised
 * time [0, 1] to a spring-eased value. Useful as a drop-in
 * replacement for CSS easing functions in JS animation loops.
 *
 * The curve is pre-computed once on creation for O(1) sampling.
 *
 * @param durationMs - Animation duration in ms (affects curve resolution).
 * @param config     - Spring configuration.
 * @returns Easing function.
 */
export function createSpringEasing(
  durationMs: number = 600,
  config: Partial<SpringConfig> = {},
): (t: number) => number {
  const curve = computeSpringCurve(durationMs, config);
  return (t: number) => sampleSpringCurve(curve, t);
}

// ──────────────────────────────────────────────
// 2-D spring (for zoom pan animations)
// ──────────────────────────────────────────────

/** State for a 2-D spring (x and y axes simulated independently). */
export interface Spring2DState {
  x: SpringState;
  y: SpringState;
}

/**
 * Advance a 2-D spring by one time step.
 *
 * Each axis is simulated independently with the same spring config.
 *
 * @param current - Current 2-D spring state.
 * @param targetX - Target X value.
 * @param targetY - Target Y value.
 * @param dt      - Time step in seconds.
 * @param config  - Spring configuration (shared for both axes).
 * @returns Updated 2-D spring state.
 */
export function stepSpring2D(
  current: Spring2DState,
  targetX: number,
  targetY: number,
  dt: number,
  config: Partial<SpringConfig> = {},
): Spring2DState {
  return {
    x: stepSpring(current.x, targetX, dt, config),
    y: stepSpring(current.y, targetY, dt, config),
  };
}

/**
 * Create an initial 2-D spring state at a given position.
 *
 * @param x - Initial X value.
 * @param y - Initial Y value.
 * @returns 2-D spring state at rest.
 */
export function createSpring2DState(x: number = 0, y: number = 0): Spring2DState {
  return {
    x: { value: x, velocity: 0, atRest: true },
    y: { value: y, velocity: 0, atRest: true },
  };
}
