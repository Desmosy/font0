"use client";

import { useEffect, useRef, useState } from "react";
import type { Cmd, GlyphOutline } from "@/lib/glyphOutline";

interface Props {
  outline: GlyphOutline;
  onChange: (commands: Cmd[]) => void;
}

interface Anchor {
  index: number;
  x: number;
  y: number;
}

function anchorsOf(commands: Cmd[]): Anchor[] {
  const out: Anchor[] = [];
  commands.forEach((c, index) => {
    if ((c.type === "M" || c.type === "L" || c.type === "C" || c.type === "Q") && c.x !== undefined) {
      out.push({ index, x: c.x, y: c.y as number });
    }
  });
  return out;
}

function pathD(commands: Cmd[]): string {
  let d = "";
  for (const c of commands) {
    if (c.type === "M") d += `M ${c.x} ${c.y} `;
    else if (c.type === "L") d += `L ${c.x} ${c.y} `;
    else if (c.type === "C") d += `C ${c.x1} ${c.y1} ${c.x2} ${c.y2} ${c.x} ${c.y} `;
    else if (c.type === "Q") d += `Q ${c.x1} ${c.y1} ${c.x} ${c.y} `;
    else if (c.type === "Z") d += "Z ";
  }
  return d;
}

export default function GlyphEditor({ outline, onChange }: Props) {
  const [commands, setCommands] = useState<Cmd[]>(outline.commands);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ index: number; base: Cmd[]; startX: number; startY: number; scale: number } | null>(null);

  useEffect(() => {
    setCommands(outline.commands);
  }, [outline]);

  const anchors = anchorsOf(commands);
  const xs: number[] = [];
  const ys: number[] = [0, outline.upm * 0.72];
  for (const c of commands) {
    if (c.x !== undefined) { xs.push(c.x); ys.push(c.y as number); }
    if (c.x1 !== undefined) { xs.push(c.x1); ys.push(c.y1 as number); }
    if (c.x2 !== undefined) { xs.push(c.x2); ys.push(c.y2 as number); }
  }
  xs.push(0, outline.advance);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys);
  const padX = (maxX - minX) * 0.14 + 40;
  const padY = (maxY - minY) * 0.14 + 40;
  const width = maxX - minX + padX * 2;
  const height = maxY - minY + padY * 2;
  const originX = minX - padX;
  const topY = maxY + padY;
  const r = Math.max(width, height) * 0.012;

  const apply = (index: number, base: Cmd[], dx: number, dy: number) => {
    const next = base.map((c) => ({ ...c }));
    const c = next[index];
    c.x = (c.x as number) + dx;
    c.y = (c.y as number) + dy;
    if (c.type === "C") { c.x2 = (c.x2 as number) + dx; c.y2 = (c.y2 as number) + dy; }
    if (c.type === "Q") { c.x1 = (c.x1 as number) + dx; c.y1 = (c.y1 as number) + dy; }
    const nx = next[index + 1];
    if (nx && (nx.type === "C" || nx.type === "Q")) { nx.x1 = (nx.x1 as number) + dx; nx.y1 = (nx.y1 as number) + dy; }
    return next;
  };

  const onPointerDown = (e: React.PointerEvent, index: number) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    const scale = rect ? rect.width / width : 1;
    drag.current = { index, base: commands.map((c) => ({ ...c })), startX: e.clientX, startY: e.clientY, scale };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.startX) / d.scale;
    const dy = -(e.clientY - d.startY) / d.scale;
    setCommands(apply(d.index, d.base, dx, dy));
  };

  const onPointerUp = () => {
    if (drag.current) {
      drag.current = null;
      onChange(commands);
    }
  };

  return (
    <svg
      ref={svgRef}
      className="ge-canvas"
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <g transform={`translate(${-originX} ${topY}) scale(1 -1)`}>
        <line x1={minX - padX} y1={0} x2={maxX + padX} y2={0} className="ge-guide" />
        <line x1={0} y1={minY - padY} x2={0} y2={maxY + padY} className="ge-guide ge-guide--faint" />
        <line x1={outline.advance} y1={minY - padY} x2={outline.advance} y2={maxY + padY} className="ge-guide ge-guide--faint" />
        <path d={pathD(commands)} className="ge-fill" />
        <path d={pathD(commands)} className="ge-outline" style={{ strokeWidth: r * 0.5 }} />
        {anchors.map((a) => (
          <circle
            key={a.index}
            cx={a.x}
            cy={a.y}
            r={r}
            className="ge-node"
            onPointerDown={(e) => onPointerDown(e, a.index)}
          />
        ))}
      </g>
    </svg>
  );
}
