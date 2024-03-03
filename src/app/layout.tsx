import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} overflow-y-scroll`}>
        <header>
          <nav
            className="flex items-start gap-4 p-6 lg:px-8"
            aria-label="Global"
          >
            <Link href="/">Theming</Link>
            <Link href="/tailwind-colors">Tailwind Colors</Link>
            <Link href="/radix-colors">Radix Colors</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
