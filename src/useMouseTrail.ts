import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { TrailInstance, UseMouseTrailOptions, UseMouseTrailReturn } from "./types";

/**
 * Core hook powering the mouse trail effect.
 * Returns refs, trail state, and event handlers — render however you like.
 */
export function useMouseTrail({
  elementCount,
  spawnDistance,
  lifetimeMs,
  maxVisible,
  rotationRange,
}: UseMouseTrailOptions): UseMouseTrailReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef<{ x: number; y: number } | null>(null);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const bagRef = useRef<number[]>([]);
  const [trail, setTrail] = useState<TrailInstance[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  // Shuffle-bag: ensures every element appears before any repeats
  const pickSlot = useCallback(() => {
    if (bagRef.current.length === 0) {
      const indices = Array.from({ length: elementCount }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      bagRef.current = indices;
    }
    return bagRef.current.pop()!;
  }, [elementCount]);

  const onMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const last = lastSpawnRef.current;

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.hypot(dx, dy) < spawnDistance) return;
      }
      lastSpawnRef.current = { x, y };

      const id = nextIdRef.current++;
      const slot = pickSlot();
      const rotate = (Math.random() - 0.5) * rotationRange;

      setTrail((prev) => {
        const next = [...prev, { id, slot, x, y, rotate }];
        if (next.length > maxVisible) {
          const dropped = next.slice(0, next.length - maxVisible);
          dropped.forEach((d) => {
            const timer = timersRef.current.get(d.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(d.id);
            }
          });
          return next.slice(-maxVisible);
        }
        return next;
      });

      const timeout = setTimeout(() => {
        setTrail((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, lifetimeMs);
      timersRef.current.set(id, timeout);
    },
    [spawnDistance, lifetimeMs, maxVisible, rotationRange, pickSlot],
  );

  const onMouseLeave = useCallback(() => {
    lastSpawnRef.current = null;
  }, []);

  return {
    containerRef,
    trail,
    handlers: { onMouseMove, onMouseLeave },
  };
}
