"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  variant?: "light" | "dark";
}

export default function GlobalNav({ variant = "light" }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHero = variant === "light";

  return (
    <>
      <header className="site-chrome">
        <Link href="/" className={`wordmark ${isHero ? "wordmark--light" : "wordmark--dark"}`}>
          Glyph Atelier
        </Link>
        <button
          className="menu-trigger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {open && (
        <nav
          className="hairline-frame"
          style={{
            position: "fixed",
            top: 80,
            right: 40,
            zIndex: 200,
            background: "var(--color-pure-white)",
            padding: "var(--spacing-20)",
            minWidth: 200,
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-16)",
          }}
        >
          <Link
            href="/"
            className={pathname === "/" ? "link-accent" : ""}
            onClick={() => setOpen(false)}
            style={pathname !== "/" ? { fontSize: "var(--text-body-sm)", fontWeight: 600 } : undefined}
          >
            Home
          </Link>
          <Link
            href="/studio"
            className={pathname.startsWith("/studio") ? "link-accent" : ""}
            onClick={() => setOpen(false)}
            style={!pathname.startsWith("/studio") ? { fontSize: "var(--text-body-sm)", fontWeight: 600 } : undefined}
          >
            Open Studio
          </Link>
          <Link
            href="/#community"
            className="link-accent link-accent--vermillion"
            onClick={() => setOpen(false)}
          >
            Community
          </Link>
        </nav>
      )}
    </>
  );
}
