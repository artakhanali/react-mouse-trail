import { useEffect, useId, useMemo } from "react";
import { useMouseTrail } from "./useMouseTrail";
import {
  buildKeyframesCSS,
  DEFAULT_EASING,
  DEFAULT_KEYFRAMES,
  DEFAULT_LIFETIME_MS,
  DEFAULT_MAX_VISIBLE,
  DEFAULT_ROTATION_RANGE,
  DEFAULT_SPAWN_DISTANCE,
} from "./defaults";
import type { MouseTrailProps } from "./types";

/**
 * Wraps any content and spawns trail elements along the cursor path.
 *
 * Pass an array of `elements` (any ReactNode) — they cycle through using
 * a shuffle-bag algorithm so every element appears before any repeats.
 */
export function MouseTrail({
  elements,
  children,
  className,
  style,
  spawnDistance,
  lifetimeMs,
  maxVisible,
  rotationRange,
  config,
}: MouseTrailProps) {
  // Resolve values: individual props > config > defaults
  const resolvedDistance =
    spawnDistance ?? config?.spawn?.distance ?? DEFAULT_SPAWN_DISTANCE;
  const resolvedLifetime =
    lifetimeMs ?? config?.spawn?.lifetimeMs ?? DEFAULT_LIFETIME_MS;
  const resolvedMaxVisible =
    maxVisible ?? config?.spawn?.maxVisible ?? DEFAULT_MAX_VISIBLE;
  const resolvedRotation =
    rotationRange ?? config?.spawn?.rotationRange ?? DEFAULT_ROTATION_RANGE;
  const resolvedKeyframes = config?.animation?.keyframes ?? DEFAULT_KEYFRAMES;
  const resolvedEasing = config?.animation?.easing ?? DEFAULT_EASING;

  const { containerRef, trail, handlers } = useMouseTrail({
    elementCount: elements.length,
    spawnDistance: resolvedDistance,
    lifetimeMs: resolvedLifetime,
    maxVisible: resolvedMaxVisible,
    rotationRange: resolvedRotation,
  });

  // Unique style injection per component instance
  const instanceId = useId().replace(/:/g, "");
  const animationName = `trail-pop-${instanceId}`;
  const styleId = `mouse-trail-style-${instanceId}`;

  const styleContent = useMemo(() => {
    const keyframesRule = buildKeyframesCSS(animationName, resolvedKeyframes);
    return `${keyframesRule}
.trail-item-${instanceId} {
  animation: ${animationName} var(--trail-lifetime, ${DEFAULT_LIFETIME_MS}ms) ${resolvedEasing} forwards;
  will-change: transform, opacity;
}`;
  }, [animationName, instanceId, resolvedKeyframes, resolvedEasing]);

  // Inject <style> into <head>
  useEffect(() => {
    if (typeof document === "undefined") return;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = styleContent;
    return () => {
      styleEl?.remove();
    };
  }, [styleId, styleContent]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
      className={className}
      style={{ position: "relative", ...style }}
    >
      {children}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          overflow: "visible",
        }}
      >
        {trail.map((t) => (
          <div
            key={t.id}
            className={`trail-item-${instanceId}`}
            style={{
              position: "absolute",
              left: `${t.x}px`,
              top: `${t.y}px`,
              ["--trail-r" as string]: `${t.rotate}deg`,
              ["--trail-lifetime" as string]: `${resolvedLifetime}ms`,
            }}
          >
            {elements[t.slot]}
          </div>
        ))}
      </div>
    </div>
  );
}
