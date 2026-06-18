"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPromptBar() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const go = () => {
    const t = prompt.trim();
    router.push(t ? `/studio?prompt=${encodeURIComponent(t)}` : "/studio");
  };

  return (
    <div className="mockup-prompt-col">
      <p className="mockup-prompt-label">enter your prompt for your custom font.</p>
      <div className="mockup-search-row">
        <input
          className="mockup-search-input"
          type="text"
          placeholder="clean, soft font"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          aria-label="Describe your font"
        />
        <button type="button" className="mockup-go-btn" onClick={go}>
          Go
        </button>
      </div>
    </div>
  );
}
