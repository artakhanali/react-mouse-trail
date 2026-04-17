# react-mouse-trail

Lightweight React component that spawns elements along your cursor path. No dependencies beyond React.

<!-- Replace with a GIF/video of the effect once you have one -->
<!-- ![demo](demo.gif) -->

## Install

```bash
npm install react-mouse-trail
```

## Quick Start

```tsx
import { MouseTrail } from "react-mouse-trail";

const trailElements = [
  <span key="1" style={{ fontSize: 24 }}>🔥</span>,
  <span key="2" style={{ fontSize: 24 }}>⚡</span>,
  <span key="3" style={{ fontSize: 24 }}>✨</span>,
  <span key="4" style={{ fontSize: 24 }}>💀</span>,
];

function Hero() {
  return (
    <MouseTrail elements={trailElements}>
      <h1>Move your mouse here</h1>
    </MouseTrail>
  );
}
```

Elements cycle through using a **shuffle-bag algorithm** — every element appears before any repeats, so distribution stays even.

## Creating Trail Elements

The `elements` prop accepts **any array of ReactNode** — emojis, styled badges, images, cards, entire components. Whatever you can render in React works as a trail item.

### Option A: Bring your own

```tsx
const myElements = [
  <span key="a" style={{ padding: "8px 16px", background: "#FFD700", border: "2px solid #111" }}>
    ✦ blessed
  </span>,
  <span key="b" style={{ padding: "8px 16px", background: "#EF4444", color: "#fff" }}>
    ⚡ incoming
  </span>,
  <img key="c" src="/my-icon.png" alt="" width={48} height={48} />,
  <MyCustomComponent key="d" />,
];

<MouseTrail elements={myElements}>
  <h1>Your content</h1>
</MouseTrail>
```

### Option B: Use the built-in examples

The package ships with ready-to-use element sets you can import directly or use as a starting point:

```tsx
import { MouseTrail, emojiElements, textBadgeElements, makeImageCards } from "react-mouse-trail";

// Emojis — simplest possible
<MouseTrail elements={emojiElements}>...</MouseTrail>

// Styled text badges
<MouseTrail elements={textBadgeElements}>...</MouseTrail>

// Image cards — pass your own images
const cards = makeImageCards([
  { src: "/zeus.png", label: "Zeus" },
  { src: "/bastet.png", label: "Bastet" },
]);
<MouseTrail elements={cards}>...</MouseTrail>
```

See [src/examples.tsx](src/examples.tsx) for the full source — copy and customize.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elements` | `ReactNode[]` | *required* | Array of elements to display as trail items |
| `children` | `ReactNode` | *required* | Content to wrap (the trail area) |
| `className` | `string` | — | CSS class for the container |
| `style` | `CSSProperties` | — | Inline styles for the container |
| `spawnDistance` | `number` | `90` | Min cursor distance (px) before spawning next item |
| `lifetimeMs` | `number` | `1200` | How long each item stays visible (ms) |
| `maxVisible` | `number` | `6` | Max simultaneous visible items |
| `rotationRange` | `number` | `16` | Rotation randomness range in degrees (e.g. 16 = -8 to +8) |
| `config` | `TrailConfig` | — | Config object for bulk customization (see below) |

Individual props **override** matching config values when both are provided.

## Config File

Copy `mouse-trail.config.json` into your project and tweak it:

```json
{
  "spawn": {
    "distance": 90,
    "maxVisible": 6,
    "lifetimeMs": 1200,
    "rotationRange": 16
  },
  "animation": {
    "keyframes": [
      { "offset": 0,    "scale": 0,    "opacity": 0 },
      { "offset": 0.12, "scale": 1.15, "opacity": 1 },
      { "offset": 0.20, "scale": 1,    "opacity": 1 },
      { "offset": 0.75, "scale": 1,    "opacity": 1 },
      { "offset": 1,    "scale": 0,    "opacity": 0 }
    ],
    "easing": "cubic-bezier(0.22, 1, 0.36, 1)"
  }
}
```

Then pass it in:

```tsx
import config from "./mouse-trail.config.json";

<MouseTrail elements={trailElements} config={config}>
  <h1>Configured trail</h1>
</MouseTrail>
```

### Customizing the Animation

The `keyframes` array controls the pop-in/pop-out animation. Each entry has:

- **`offset`** — Progress point from `0` (start) to `1` (end)
- **`scale`** — Size multiplier (`0` = invisible, `1` = full size, `1.15` = slight overshoot)
- **`opacity`** — Transparency from `0` to `1`

For example, a simple fade-in/fade-out with no scale:

```json
{
  "animation": {
    "keyframes": [
      { "offset": 0, "scale": 1, "opacity": 0 },
      { "offset": 0.1, "scale": 1, "opacity": 1 },
      { "offset": 0.9, "scale": 1, "opacity": 1 },
      { "offset": 1, "scale": 1, "opacity": 0 }
    ]
  }
}
```

## Hook Usage

For custom rendering, use the `useMouseTrail` hook directly:

```tsx
import { useMouseTrail } from "react-mouse-trail";

function CustomTrail({ elements }) {
  const { containerRef, trail, handlers } = useMouseTrail({
    elementCount: elements.length,
    spawnDistance: 80,
    lifetimeMs: 1400,
    maxVisible: 6,
    rotationRange: 16,
  });

  return (
    <div ref={containerRef} {...handlers} style={{ position: "relative" }}>
      <h1>Custom rendering</h1>
      {trail.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            transform: `translate(-50%, -50%) rotate(${t.rotate}deg)`,
          }}
        >
          {elements[t.slot]}
        </div>
      ))}
    </div>
  );
}
```

Note: when using the hook directly, you handle your own animation (CSS transitions, framer-motion, etc.).

## Next.js App Router

In Next.js App Router, the component uses browser APIs so it needs to run on the client. Add `"use client"` to the file that imports it:

```tsx
"use client";

import { MouseTrail } from "react-mouse-trail";
```

## How It Works

1. Listens to `mousemove` on the container
2. Only spawns a new trail item when the cursor moves `spawnDistance` px from the last spawn point
3. Picks the next element using a **shuffle bag** (Fisher-Yates) — guarantees even distribution
4. Each item gets a random rotation within `rotationRange`
5. A CSS `@keyframes` animation plays the pop-in/hold/pop-out effect
6. Items are removed from the DOM after `lifetimeMs`
7. A hard cap of `maxVisible` prevents element overflow

## License

MIT
