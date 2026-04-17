import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";

export interface TrailKeyframe {
  /** Progress point between 0 and 1 */
  offset: number;
  /** Scale multiplier (0 = invisible, 1 = full size) */
  scale: number;
  /** Opacity between 0 and 1 */
  opacity: number;
}

export interface TrailConfig {
  spawn?: {
    /** Min cursor distance (px) before spawning next item. Default: 90 */
    distance?: number;
    /** Max simultaneous visible items. Default: 6 */
    maxVisible?: number;
    /** How long each item stays visible (ms). Default: 1200 */
    lifetimeMs?: number;
    /** Rotation randomness range in degrees. Default: 16 */
    rotationRange?: number;
  };
  animation?: {
    /** Keyframe stops for the trail-pop animation */
    keyframes?: TrailKeyframe[];
    /** CSS easing function. Default: "cubic-bezier(0.22, 1, 0.36, 1)" */
    easing?: string;
  };
}

export interface MouseTrailProps {
  /** Array of ReactNode elements to display as trail items */
  elements: ReactNode[];
  /** Content to wrap — the trail area */
  children: ReactNode;
  /** CSS class for the container div */
  className?: string;
  /** Inline styles for the container div */
  style?: React.CSSProperties;
  /** Min cursor distance (px) before spawning next item */
  spawnDistance?: number;
  /** How long each item stays visible (ms) */
  lifetimeMs?: number;
  /** Max simultaneous visible items */
  maxVisible?: number;
  /** Rotation randomness range in degrees */
  rotationRange?: number;
  /** Config object — individual props override config values */
  config?: TrailConfig;
}

export interface TrailInstance {
  id: number;
  slot: number;
  x: number;
  y: number;
  rotate: number;
}

export interface UseMouseTrailOptions {
  elementCount: number;
  spawnDistance: number;
  lifetimeMs: number;
  maxVisible: number;
  rotationRange: number;
}

export interface UseMouseTrailReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  trail: TrailInstance[];
  handlers: {
    onMouseMove: (e: ReactMouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
  };
}
