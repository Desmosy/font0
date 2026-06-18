"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/studio", label: "studio" },
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
            <Fragment key={label}>
              {i > 0 && <span className="mockup-nav-sep" aria-hidden>|</span>}
              <Link href={href} className={active ? "is-active" : undefined}>
                {label}
              </Link>
            </Fragment>
          );
        })}
      </nav>
    </header>
  );
}

