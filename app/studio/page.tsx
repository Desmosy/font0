"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DEFAULT_PARAMS, sanitizeParams, type FontParams } from "@/lib/types";
import {
  FONT_BY_ID,
  DEFAULT_FONT_ID,
  fontFaceStyle,
  weightName,
  UPPERCASE,
  LOWERCASE,
  DIGITS,
  SYMBOLS,
} from "@/lib/fontCatalog";
import { PRESETS } from "@/lib/presets";
import type { GlyphEdits, GlyphOutline } from "@/lib/glyphOutline";
import { hashSeed, isIdentityShape, IDENTITY_SHAPE } from "@/lib/genShape";
import DesignPanel from "@/components/DesignPanel";
import DesignPrompt from "@/components/DesignPrompt";
import FontSpecimen from "@/components/FontSpecimen";
import GlyphInspector from "@/components/GlyphInspector";

const GLYPH_COUNT = UPPERCASE.length + LOWERCASE.length + DIGITS.length + SYMBOLS.length;

function BrandMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="3.5" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="16"
          cy="8"
          rx="3.2"
          ry="6.5"
          fill="currentColor"
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
    </svg>
  );
}

function Studio() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<FontParams>(DEFAULT_PARAMS);
  const [selected, setSelected] = useState("A");
  const [edits, setEdits] = useState<GlyphEdits>({});
  const [renderedFamily, setRenderedFamily] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const didInit = useRef(false);
  const editFaceRef = useRef<FontFace | null>(null);

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (data?.params) {
        const sp = sanitizeParams(data.params);
        sp.shape = { ...sp.shape, seed: hashSeed(text) };
        setParams(sp);
        setEdits({});
        setSource(data.source ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const presetName = searchParams.get("preset");
    const p = searchParams.get("prompt");
    if (presetName) {
      const found = PRESETS.find((x) => x.name === presetName);
      if (found) {
        setParams(found.params);
        setSource("preset");
        return;
      }
    }
    if (p) {
      setPrompt(p);
      generate(p);
    }
  }, [searchParams, generate]);

  const setBase = (id: string) => {
    const def = FONT_BY_ID[id] ?? FONT_BY_ID[DEFAULT_FONT_ID];
    setEdits({});
    setParams((p) => sanitizeParams({ ...p, base: id, axes: { ...def.defaults } }));
  };
  const setAxis = (tag: string, value: number) =>
    setParams((p) => sanitizeParams({ ...p, axes: { ...p.axes, [tag]: value } }));
  const setTracking = (value: number) => setParams((p) => sanitizeParams({ ...p, tracking: value }));
  const setShape = (key: keyof typeof IDENTITY_SHAPE, value: number) =>
    setParams((p) => sanitizeParams({ ...p, shape: { ...p.shape, [key]: value } }));
  const setFamilyName = (_key: "familyName", value: string) =>
    setParams((p) => ({ ...p, familyName: value.slice(0, 48) }));

  const editGlyph = (char: string, outline: GlyphOutline) =>
    setEdits((prev) => ({ ...prev, [char]: outline }));
  const resetGlyph = (char: string) =>
    setEdits((prev) => {
      const next = { ...prev };
      delete next[char];
      return next;
    });

  const needsRebuild = Object.keys(edits).length > 0 || !isIdentityShape(params.shape);
  useEffect(() => {
    let cancelled = false;
    if (!needsRebuild) {
      if (editFaceRef.current) {
        document.fonts.delete(editFaceRef.current);
        editFaceRef.current = null;
      }
      setRenderedFamily(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { buildEditedFont } = await import("@/lib/glyphOutline");
        const bytes = await buildEditedFont(params, edits, params.shape);
        if (cancelled) return;
        const fam = `gen-${Date.now()}`;
        const face = new FontFace(fam, bytes);
        await face.load();
        if (cancelled) return;
        document.fonts.add(face);
        if (editFaceRef.current) document.fonts.delete(editFaceRef.current);
        editFaceRef.current = face;
        setRenderedFamily(fam);
      } catch (e) {
        console.error("generative font build failed", e);
      }
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [params, edits, needsRebuild]);

  const download = async () => {
    setExporting(true);
    try {
      const rebuilt = needsRebuild;
      const bytes = rebuilt
        ? await (await import("@/lib/glyphOutline")).buildEditedFont(params, edits, params.shape)
        : await (await import("@/lib/instanceFont")).instanceFont(params);
      const ext = rebuilt ? "otf" : "ttf";
      const blob = new Blob([bytes], { type: rebuilt ? "font/otf" : "font/ttf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(params.familyName || "Untitled").replace(/\s+/g, "")}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("export failed", e);
    } finally {
      setExporting(false);
    }
  };

  const liveStyle: React.CSSProperties = renderedFamily
    ? { fontFamily: `"${renderedFamily}", sans-serif`, letterSpacing: `${(params.tracking || 0) / 1000}em` }
    : fontFaceStyle(params.base, params.axes, params.tracking);
  const def = FONT_BY_ID[params.base] ?? FONT_BY_ID[DEFAULT_FONT_ID];
  const weight = weightName(params.axes.wght ?? 400);

  return (
    <div className="studio-page fq-studio">
      <header className="fq-hero">
        <div className="fq-hero-top">
          <Link href="/" className="fq-brand">
            <BrandMark />
            <span>Glyph Atelier</span>
          </Link>
          <nav className="fq-nav" aria-label="Studio">
            <Link href="/">home</Link>
            <span aria-hidden className="fq-nav-sep">|</span>
            <Link href="/studio" className="is-active">studio</Link>
          </nav>
          <button type="button" className="fq-btn fq-btn--dark" onClick={download} disabled={exporting}>
            {exporting ? "Exporting…" : "Download .ttf"}
          </button>
        </div>
        <div className="fq-hero-body">
          <div className="fq-hero-info">
            <p className="fq-eyebrow">Typeface specimen</p>
            <h1 className="fq-title" style={liveStyle}>{params.familyName}</h1>
            <p className="fq-subtitle">
              {def.label} · {weight}
              {source ? ` · ${source}` : ""}
              {Object.keys(edits).length > 0 ? ` · ${Object.keys(edits).length} edited` : ""}
            </p>
          </div>
          <DesignPrompt
            prompt={prompt}
            loading={loading}
            onPromptChange={setPrompt}
            onGenerate={() => generate(prompt)}
          />
        </div>
      </header>

      <main className="fq-main">
        <div className="fq-workspace-row">
          <section className="fq-card fq-card--olive fq-workspace-glyphs">
            <p className="fq-card-eyebrow">Glyphs</p>
            <h2 className="fq-card-title">Character map</h2>
            <p className="fq-card-desc">{GLYPH_COUNT} characters · select to inspect</p>
            <GlyphInspector
              params={params}
              selected={selected}
              onSelect={setSelected}
              liveStyle={liveStyle}
              edits={edits}
              shape={params.shape}
              onEdit={editGlyph}
              onReset={resetGlyph}
            />
          </section>

          <section className="fq-card fq-card--cream fq-workspace-params">
            <p className="fq-card-eyebrow">Design</p>
            <h2 className="fq-card-title">Parameters</h2>
            <p className="fq-card-desc">
              {source === "nemotron"
                ? "Chosen by Nemotron."
                : source === "preset"
                  ? "Loaded preset."
                  : source
                    ? "Keyword fallback."
                    : "Pick a base and tune axes."}
            </p>
            <DesignPanel
              params={params}
              onParamChange={setFamilyName}
              onBaseChange={setBase}
              onAxisChange={setAxis}
              onTrackingChange={setTracking}
              onShapeChange={setShape}
            />
          </section>
        </div>

        <FontSpecimen params={params} liveStyle={liveStyle} glyphCount={GLYPH_COUNT} source={source} />
      </main>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="studio-page fq-studio">
          <div className="fq-main">
            <div className="fq-card fq-card--lavender">Loading studio…</div>
          </div>
        </div>
      }
    >
      <Studio />
    </Suspense>
  );
}
