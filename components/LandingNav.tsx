"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/studio", label: "studio" },
  { href: "/studio", label: "community" },
] as const;

export default function LandingNav() {
  const pathname = usePathname();

  return (
    <header className="mockup-nav">
      <nav className="mockup-nav-inner" aria-label="Main">
        {LINKS.map(({ href, label }, i) => {
          const active =
            label === "home" ? pathname === "/" : label === "studio" ? pathname.startsWith("/studio") : false;
          return (
            <span key={label} className="mockup-nav-item">
              {i > 0 && <span className="mockup-nav-sep" aria-hidden>|</span>}
              <Link href={href} className={active ? "is-active" : undefined}>
                {label}
              </Link>
            </span>
          );
        })}
      </nav>
    </header>
  );
}
