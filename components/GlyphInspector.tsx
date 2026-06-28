"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { FontParams } from "@/lib/types";
import type { Cmd, GlyphOutline, GlyphEdits } from "@/lib/glyphOutline";
import type { ShapeParams } from "@/lib/genShape";
import {
  UPPERCASE,
  LOWERCASE,
  DIGITS,
  SYMBOLS,
  FONT_BY_ID,
  DEFAULT_FONT_ID,
} from "@/lib/fontCatalog";
import GlyphEditor from "@/components/GlyphEditor";

interface Props {
  params: FontParams;
  selected: string;
  onSelect: (char: string) => void;
  liveStyle: CSSProperties;
  edits: GlyphEdits;
  shape: ShapeParams;
  onEdit: (char: string, outline: GlyphOutline) => void;
  onReset: (char: string) => void;
}

function Group({
  title,
  chars,
  selected,
  edits,
  onSelect,
  liveStyle,
}: {
  title: string;
  chars: string[];
  selected: string;
  edits: GlyphEdits;
  onSelect: (c: string) => void;
  liveStyle: CSSProperties;
}) {
  return (
    <div className="pp-glyph-group">
      <h4>{title}</h4>
      <div className="pp-glyph-grid">
        {chars.map((c) => (
          <button
            key={c}
            type="button"
            className={`pp-glyph-cell${c === selected ? " pp-glyph-cell--sel" : ""}${
              edits[c] ? " pp-glyph-cell--edited" : ""
            }`}
            onClick={() => onSelect(c)}
            aria-pressed={c === selected}
            aria-label={`Glyph ${c}`}
          >
            <span className="pp-glyph-cell-char" style={liveStyle}>
              {c}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GlyphInspector({
  params,
  selected,
  onSelect,
  liveStyle,
  edits,
  shape,
  onEdit,
  onReset,
}: Props) {
  const def = FONT_BY_ID[params.base] ?? FONT_BY_ID[DEFAULT_FONT_ID];
  const unicode = `U+${selected.charCodeAt(0).toString(16).padStart(4, "0").toUpperCase()}`;
  const isEdited = !!edits[selected];

  const [outline, setOutline] = useState<GlyphOutline | null>(null);
  const reqId = useRef(0);
  const axesSig = JSON.stringify(params.axes);
  const shapeSig = JSON.stringify(shape);

  useEffect(() => {
    if (edits[selected]) {
      setOutline(edits[selected]);
      return;
    }
    const id = ++reqId.current;
    setOutline(null);
    let cancelled = false;
    (async () => {
      try {
        const { getGlyphOutline } = await import("@/lib/glyphOutline");
        const o = await getGlyphOutline(params, selected, shape);
        if (!cancelled && id === reqId.current) setOutline(o);
      } catch (e) {
        console.error("outline load failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, params.base, axesSig, shapeSig, isEdited]);

  return (
    <div className="pp-glyph-inspector">
      <div className="pp-glyph-map">
        <Group title="Uppercase" chars={UPPERCASE} selected={selected} edits={edits} onSelect={onSelect} liveStyle={liveStyle} />
        <Group title="Lowercase" chars={LOWERCASE} selected={selected} edits={edits} onSelect={onSelect} liveStyle={liveStyle} />
        <Group title="Numerals" chars={DIGITS} selected={selected} edits={edits} onSelect={onSelect} liveStyle={liveStyle} />
        <Group title="Symbols" chars={SYMBOLS} selected={selected} edits={edits} onSelect={onSelect} liveStyle={liveStyle} />
      </div>

      <div className="pp-glyph-detail">
        <div className="pp-glyph-detail-head">
          <span className="pp-glyph-detail-label">
            Edit glyph · {selected} {isEdited && <em className="pp-glyph-edited-tag">edited</em>}
          </span>
          <div className="pp-glyph-detail-meta">
            <span className="pp-glyph-unicode">{unicode}</span>
            {isEdited && (
              <button type="button" className="pp-glyph-reset" onClick={() => onReset(selected)}>
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="pp-glyph-stage-wrap">
          {outline ? (
            <GlyphEditor
              key={`${selected}-${isEdited}`}
              outline={outline}
              onChange={(commands: Cmd[]) => onEdit(selected, { ...outline, commands })}
            />
          ) : (
            <div className="pp-glyph-stage" style={liveStyle}>
              {selected}
            </div>
          )}
        </div>

        <p className="pp-glyph-detail-foot">
          Drag the nodes to reshape · {def.label} · {def.category}
        </p>
      </div>
    </div>
  );
}
