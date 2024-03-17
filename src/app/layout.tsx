import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter"});
const DMSans = localFont({
  src: [
    { path: "../fonts/DMSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/DMSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/DMSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/DMSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-dm-sans",
});

const Louize = localFont({
  src: [
    { path: "../fonts/Louize-Bold.woff", weight: "700", style: "normal" },
    { path: "../fonts/Louize-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Louize-Regular.woff", weight: "400", style: "normal" },
  ],
  display: "swap",
  variable: "--font-louize",
});

export const metadata: Metadata = {
  title: "Theme Playground",
  description: "A playground for theme development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${DMSans.variable} ${Louize.variable} overflow-y-scroll`}>
        <header>
          <nav
            className="flex items-start gap-4 p-6 lg:px-8 border-b border-neutral-200"
            aria-label="Global"
          >
            <Link href="/">Theming</Link>
            <Link href="/color-playground">Color Playground</Link>
            <Link href="/tailwind-colors">Tailwind Colors</Link>
            <Link href="/radix-colors">Radix Colors</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
