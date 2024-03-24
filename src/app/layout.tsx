import type { Metadata } from "next";
import { Inter, Playfair, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/app-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter"});
const playfair = Playfair({ subsets: ["latin"], variable: "--font-playfair"});
const spacemono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] ,variable: "--font-space-mono"});

const Louize = localFont({
  src: [
    { path: "../fonts/Louize-Bold.woff", weight: "700", style: "normal" },
    { path: "../fonts/Louize-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Louize-Regular.woff", weight: "400", style: "normal" },
  ],
  display: "swap",
  variable: "--font-louize",
});
const Roobert = localFont({
  src: [
    { path: "../fonts/Roobert.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Roobert.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Roobert.woff2", weight: "400", style: "normal" },
  ],
  display: "swap",
  variable: "--font-roobert",
});

export const metadata: Metadata = {
  title: "Theme Playground",
  description: "Configure, save, and edit themes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.variable} ${Louize.variable} ${playfair.variable} ${Roobert.variable} ${spacemono.variable} overflow-y-scroll`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
