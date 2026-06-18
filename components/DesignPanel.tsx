"use client";

import type { FontParams } from "@/lib/types";
import { FONTS, FONT_BY_ID, DEFAULT_FONT_ID } from "@/lib/fontCatalog";

interface Props {
  params: FontParams;
  onParamChange: (key: "familyName", value: string) => void;
  onBaseChange: (id: string) => void;
  onAxisChange: (tag: string, value: number) => void;
  onTrackingChange: (value: number) => void;
  onShapeChange: (key: "slant" | "width" | "vstretch" | "distortion", value: number) => void;
}

const SHAPE_SLIDERS: {
  key: "slant" | "width" | "vstretch" | "distortion";
  label: string;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
}[] = [
  { key: "slant", label: "Slant · shear", min: -20, max: 20, step: 1, fmt: (n) => `${n}°` },
  { key: "width", label: "Width · stretch", min: 0.7, max: 1.4, step: 0.01, fmt: (n) => n.toFixed(2) },
  { key: "vstretch", label: "Height · vertical", min: 0.82, max: 1.18, step: 0.01, fmt: (n) => n.toFixed(2) },
  { key: "distortion", label: "Distortion · wobble", min: 0, max: 1, step: 0.01, fmt: (n) => n.toFixed(2) },
];

export default function DesignPanel({
  params,
  onParamChange,
  onBaseChange,
  onAxisChange,
  onTrackingChange,
  onShapeChange,
}: Props) {
  const def = FONT_BY_ID[params.base] ?? FONT_BY_ID[DEFAULT_FONT_ID];

  return (
    <div className="pp-design-panel pp-design-panel--params">
      <div className="pp-design-section">
        <div className="pp-field-label"><span>Family name</span></div>
        <input
          className="pp-input"
          value={params.familyName}
          onChange={(e) => onParamChange("familyName", e.target.value)}
        />

        <div className="pp-field-label"><span>Base typeface</span></div>
        <div className="pp-font-picker">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`pp-font-chip${f.id === params.base ? " pp-font-chip--active" : ""}`}
              onClick={() => onBaseChange(f.id)}
              title={f.blurb}
            >
              <span className="pp-font-chip-name">{f.label}</span>
              <span className="pp-font-chip-cat">{f.category}</span>
            </button>
          ))}
        </div>

        {def.axes.map((axis) => {
          const v = params.axes[axis.tag] ?? def.defaults[axis.tag] ?? axis.min;
          return (
            <div key={axis.tag}>
              <div className="pp-field-label">
                <span>{axis.label}{axis.hint ? ` · ${axis.hint}` : ""}</span>
                <b>{axis.fmt ? axis.fmt(v) : Math.round(v)}</b>
              </div>
              <input
                type="range"
                className="pp-range"
                min={axis.min}
                max={axis.max}
                step={axis.step}
                value={v}
                onChange={(e) => onAxisChange(axis.tag, parseFloat(e.target.value))}
              />
            </div>
          );
        })}

        <div className="pp-field-label">
          <span>Tracking · letter spacing</span>
          <b>{params.tracking > 0 ? `+${params.tracking}` : params.tracking}</b>
        </div>
        <input
          type="range"
          className="pp-range"
          min={-40}
          max={160}
          step={1}
          value={params.tracking}
          onChange={(e) => onTrackingChange(parseFloat(e.target.value))}
        />

        <div className="pp-shape-divider">
          <span>Generative geometry</span>
          <em>reshapes the actual curve points</em>
        </div>
        {SHAPE_SLIDERS.map((s) => {
          const v = params.shape[s.key];
          return (
            <div key={s.key}>
              <div className="pp-field-label">
                <span>{s.label}</span>
                <b>{s.fmt(v)}</b>
              </div>
              <input
                type="range"
                className="pp-range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={v}
                onChange={(e) => onShapeChange(s.key, parseFloat(e.target.value))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
