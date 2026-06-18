"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CHIPS = [
  "friendly rounded font for a kids app",
  "sharp brutalist display",
  "elegant high-contrast fashion serif",
  "bold condensed sports headline",
];

export default function LandingPrompt() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const go = (text: string) => {
    const t = text.trim();
    router.push(t ? `/studio?prompt=${encodeURIComponent(t)}` : "/studio");
  };

  return (
    <div className="prompt-panel">
      <div className="prompt-panel-head">
        <div>
          <p className="prompt-label">Generate a typeface</p>
          <p className="prompt-sub">Describe mood, use, or personality — we&apos;ll build the full glyph set.</p>
        </div>
      </div>
      <div className="prompt-row">
        <input
          className="prompt-field"
          placeholder="e.g. elegant high-contrast serif for editorial headlines"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go(prompt)}
        />
        <button className="pill pill-cobalt" onClick={() => go(prompt)}>
          Generate
        </button>
      </div>
      <div className="chips">
        <span className="chips-label">Try:</span>
        {CHIPS.map((c) => (
          <button key={c} type="button" className="chip" onClick={() => go(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
