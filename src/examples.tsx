/**
 * Example trail elements — copy, remix, or replace with your own.
 *
 * Trail elements are just ReactNode items. Anything you can render in React
 * works: text badges, images, icons, SVGs, entire components, etc.
 *
 * Pass them to <MouseTrail elements={myElements}> and they'll spawn
 * along your cursor path using a shuffle-bag algorithm.
 */

import type { ReactNode } from "react";

/* ─── Style helpers (inline so examples have zero dependencies) ─── */

const badge = (
  bg: string,
  color: string,
  border?: string,
): React.CSSProperties => ({
  fontFamily: "monospace",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  background: bg,
  color,
  padding: "10px 16px",
  border: border ?? "3px solid #111",
  boxShadow: "4px 4px 0 #111",
  whiteSpace: "nowrap",
  borderRadius: 4,
});

const card = (size: number): React.CSSProperties => ({
  display: "inline-block",
  width: size,
  borderRadius: 12,
  overflow: "hidden",
  background: "#fff",
  border: "3px solid #111",
  boxShadow: "4px 4px 0 #111",
});

/* ─── Example 1: Text badges ─── */

export const textBadgeElements: ReactNode[] = [
  <span key="a" style={badge("#FFD700", "#111")}>
    ✦ certified blessed
  </span>,
  <span key="b" style={badge("#EF4444", "#fff")}>
    ⚡ incoming
  </span>,
  <span key="c" style={badge("#fff", "#111", "3px solid #7C3AED")}>
    ⚡ 69h · 0.069% · 69M
  </span>,
  <span key="d" style={badge("#EF4444", "#fff", "2px solid #111")}>
    not for normies
  </span>,
  <span key="e" style={badge("#111", "#FFD700", "none")}>
    ◐ gates sealed
  </span>,
];

/* ─── Example 2: Emoji elements (simplest possible) ─── */

export const emojiElements: ReactNode[] = [
  <span key="1" style={{ fontSize: 28 }}>🔥</span>,
  <span key="2" style={{ fontSize: 28 }}>⚡</span>,
  <span key="3" style={{ fontSize: 28 }}>✨</span>,
  <span key="4" style={{ fontSize: 28 }}>💀</span>,
  <span key="5" style={{ fontSize: 28 }}>👑</span>,
  <span key="6" style={{ fontSize: 28 }}>🌙</span>,
];

/* ─── Example 3: Image cards ─── */

export function makeImageCards(
  images: { src: string; label: string }[],
): ReactNode[] {
  return images.map((img) => (
    <span key={img.label} style={card(144)}>
      <span
        style={{
          display: "block",
          aspectRatio: "1",
          background: "#f3f4f6",
          borderBottom: "3px solid #111",
        }}
      >
        <img
          src={img.src}
          alt={img.label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </span>
      <span
        style={{
          display: "block",
          padding: "4px 8px",
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 10,
          color: "#111",
        }}
      >
        {img.label}
      </span>
    </span>
  ));
}
