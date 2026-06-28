"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/studio", label: "studio" },
] as const;

const GITHUB_URL = "https://github.com/Desmosy/font0";
const GITHUB_API_URL = "https://api.github.com/repos/Desmosy/font0";

function formatStars(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return String(count);
}

export default function LandingNav() {
  const pathname = usePathname();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GITHUB_API_URL, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="mockup-nav">
      <nav className="mockup-nav-inner" aria-label="Main">
        {LINKS.map(({ href, label }, i) => {
          const active =
            label === "home" ? pathname === "/" : label === "studio" ? pathname.startsWith("/studio") : false;
          return (
            <Fragment key={label}>
              {i > 0 && <span className="mockup-nav-sep" aria-hidden>|</span>}
              <Link href={href} className={active ? "is-active" : undefined}>
                {label}
              </Link>
            </Fragment>
          );
        })}
        <span className="mockup-nav-sep" aria-hidden>|</span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="mockup-github-link">
          <span>github</span>
          {stars !== null && <span className="mockup-github-stars">★ {formatStars(stars)}</span>}
        </a>
      </nav>
    </header>
  );
}
