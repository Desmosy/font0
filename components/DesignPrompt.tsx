"use client";

interface Props {
  prompt: string;
  loading: boolean;
  onPromptChange: (v: string) => void;
  onGenerate: () => void;
}

export default function DesignPrompt({ prompt, loading, onPromptChange, onGenerate }: Props) {
  return (
    <div className="fq-hero-prompt">
      <p className="fq-hero-prompt-title">Prompt</p>
      <p className="fq-hero-prompt-hint">Regenerate the whole face from words.</p>
      <div className="fq-hero-prompt-row">
        <input
          className="fq-hero-prompt-input"
          type="text"
          placeholder="describe a typeface…"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onGenerate()}
          aria-label="Describe a typeface"
          disabled={loading}
        />
        <button
          type="button"
          className={`fq-btn fq-btn--dark fq-hero-prompt-btn${loading ? " fq-hero-prompt-btn--loading" : ""}`}
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? (
            <span className="fq-gen-loading">
              <span className="fq-gen-spinner" aria-hidden />
              <span>Generating</span>
              <span className="fq-gen-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            </span>
          ) : (
            "Generate"
          )}
        </button>
      </div>
      <div className={`fq-gen-bar${loading ? " fq-gen-bar--on" : ""}`} aria-hidden>
        <span />
      </div>
    </div>
  );
}
