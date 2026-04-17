import type { TrailKeyframe } from "./types";

export const DEFAULT_SPAWN_DISTANCE = 90;
export const DEFAULT_LIFETIME_MS = 1200;
export const DEFAULT_MAX_VISIBLE = 6;
export const DEFAULT_ROTATION_RANGE = 16;
export const DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DEFAULT_KEYFRAMES: TrailKeyframe[] = [
  { offset: 0, scale: 0, opacity: 0 },
  { offset: 0.12, scale: 1.15, opacity: 1 },
  { offset: 0.2, scale: 1, opacity: 1 },
  { offset: 0.75, scale: 1, opacity: 1 },
  { offset: 1, scale: 0, opacity: 0 },
];

/**
 * Generates a CSS @keyframes rule from a keyframe array.
 * Each keyframe specifies offset (0-1), scale, and opacity.
 */
export function buildKeyframesCSS(
  name: string,
  keyframes: TrailKeyframe[],
): string {
  const stops = keyframes
    .map((kf) => {
      const pct = `${(kf.offset * 100).toFixed(0)}%`;
      return `  ${pct} {
    transform: translate(-50%, -50%) rotate(var(--trail-r, 0deg)) scale(${kf.scale});
    opacity: ${kf.opacity};
  }`;
    })
    .join("\n");
  return `@keyframes ${name} {\n${stops}\n}`;
}
