"use client"

import Link from "next/link"


export default function TopNav() {
    return (
        <header>
          <nav
            className="flex items-start gap-4 p-6 lg:px-8 border-b border-neutral-200"
            aria-label="Global"
          >
            <Link href="/">Theming</Link>
            <Link href="/colors">Colors</Link>
          </nav>
        </header>
    )
}