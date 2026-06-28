"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  PARAGRAPH_SPECIMENS,
  PREVIEW_SAMPLES,
  TYPE_SCALE,
} from "@/lib/specimenContent";
import type { FontParams } from "@/lib/types";
import { FONT_BY_ID, DEFAULT_FONT_ID, fontFaceStyle, weightName } from "@/lib/fontCatalog";

interface Props {
  params: FontParams;
  liveStyle: CSSProperties;
  glyphCount: number;
  source: string | null;
}

const RUNGS: { name: string; t: number }[] = [
  { name: "Thin", t: 0 },
  { name: "Light", t: 0.22 },
  { name: "Regular", t: 0.42 },
  { name: "Medium", t: 0.56 },
  { name: "SemiBold", t: 0.7 },
  { name: "Bold", t: 0.86 },
  { name: "Black", t: 1 },
];

export default function FontSpecimen({ params, liveStyle, glyphCount, source }: Props) {
  const [previewText, setPreviewText] = useState<string>(PREVIEW_SAMPLES[0].text);
  const [previewSize, setPreviewSize] = useState(64);

  const def = FONT_BY_ID[params.base] ?? FONT_BY_ID[DEFAULT_FONT_ID];
  const wghtAxis = def.axes.find((a) => a.tag === "wght");
  const currentWeight = weightName(params.axes.wght ?? 400);

  const weightStyleAt = (wght: number): CSSProperties =>
    fontFaceStyle(params.base, { ...params.axes, wght }, params.tracking);

  return (
    <div className="gf-specimen">
      <section className="gf-playground fq-card fq-card--white fq-bento-preview">
        <div className="gf-preview-toolbar">
          <div className="gf-preview-select">
            <label htmlFor="preview-sample">Select preview text</label>
            <select
              id="preview-sample"
              value={PREVIEW_SAMPLES.some((s) => s.text === previewText) ? previewText : "custom"}
              onChange={(e) => {
                if (e.target.value !== "custom") setPreviewText(e.target.value);
              }}
            >
              {PREVIEW_SAMPLES.map((s) => (
                <option key={s.id} value={s.text}>
                  {s.label} — {s.text.slice(0, 42)}
                  {s.text.length > 42 ? "…" : ""}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="gf-preview-size">
            <label htmlFor="preview-size">Size</label>
            <input
              id="preview-size"
              type="range"
              min={16}
              max={140}
              value={previewSize}
              onChange={(e) => setPreviewSize(Number(e.target.value))}
            />
            <span className="gf-preview-size-val">{previewSize}px</span>
          </div>
        </div>

        <textarea
          className="gf-hero-preview"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          rows={2}
          style={{ ...liveStyle, fontSize: previewSize, lineHeight: 1.15 }}
        />
      </section>

      <section className="gf-type-scale fq-card fq-card--yellow fq-bento-scale">
        <h2 className="gf-section-title">Type scale</h2>
        <div className="gf-scale-list">
          {TYPE_SCALE.map((row) => (
            <div key={row.name} className="gf-scale-row">
              <div className="gf-scale-meta">
                <span className="gf-scale-name">{row.name}</span>
                <span className="gf-scale-size">{row.size}px</span>
              </div>
              <p
                className="gf-scale-sample"
                style={{ ...liveStyle, fontSize: row.size, lineHeight: row.leading }}
              >
                {row.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="gf-paragraphs fq-card fq-card--pink fq-span-full">
        <h2 className="gf-section-title">Body text</h2>
        {PARAGRAPH_SPECIMENS.map((block) => (
          <div key={block.size} className="gf-para-block">
            <p className="gf-para-label">{block.label}</p>
            <p
              className="gf-para-text"
              style={{ ...liveStyle, fontSize: block.size, lineHeight: block.size <= 21 ? 1.45 : 1.35 }}
            >
              {block.text}
            </p>
          </div>
        ))}
      </section>

      <section className="gf-styles fq-card fq-card--lavender fq-span-full">
        <div className="gf-styles-head">
          <h2 className="gf-section-title">Weights</h2>
          <p className="gf-styles-hint">
            {wghtAxis ? `${def.label} weight axis · current: ${currentWeight}` : `${def.label} · single weight`}
          </p>
        </div>
        <div className="gf-style-list">
          {(wghtAxis ? RUNGS : [{ name: currentWeight, t: 0 }]).map((rung) => {
            const wght = wghtAxis
              ? Math.round(wghtAxis.min + (wghtAxis.max - wghtAxis.min) * rung.t)
              : (params.axes.wght ?? 400);
            const isActive = Math.abs((params.axes.wght ?? 0) - wght) < 30;
            return (
              <div key={rung.name} className={`gf-style-row${isActive ? " gf-style-row--active" : ""}`}>
                <div className="gf-style-label">
                  <span className="gf-style-name">{rung.name}</span>
                  <span className="gf-style-css">{wght}</span>
                </div>
                <div className="gf-style-preview" style={{ ...weightStyleAt(wght), fontSize: 34, lineHeight: 1.1 }}>
                  {previewText.slice(0, 32)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="gf-bottom-grid">
        <section className="gf-recap fq-card fq-card--terra">
          <h2 className="gf-section-title">Glyph set</h2>
          <p className="gf-recap-sample" style={{ ...liveStyle, fontSize: 30, lineHeight: 1.3 }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 &amp;@#%.,:;!?
          </p>
        </section>

        <section className="gf-about fq-card fq-card--teal">
          <h2 className="gf-section-title">About this face</h2>
          <dl className="gf-about-list">
            <div>
              <dt>Base</dt>
              <dd>{def.label}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{def.category}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{currentWeight} ({Math.round(params.axes.wght ?? 0)})</dd>
            </div>
            <div>
              <dt>Glyphs</dt>
              <dd>{glyphCount}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{source ?? "manual"}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>TrueType (.ttf)</dd>
            </div>
          </dl>
          <p className="gf-about-copy">
            Generated by instancing the open-licensed <strong>{def.label}</strong> variable font at your
            chosen axes — every glyph is professionally drawn. Tune axes on the left, then download a real
            static <code>.ttf</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
