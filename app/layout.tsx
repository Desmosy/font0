import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "Glyph Atelier — make any font from a prompt",
  description:
    "A curator's atelier for type design. Describe a typeface in plain words — generate, edit, and download an original font.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${bricolage.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
