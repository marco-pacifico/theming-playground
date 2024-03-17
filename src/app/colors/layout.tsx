import Link from "next/link";

export default function ColorPlaygroundLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <nav className="flex items-start gap-4 p-6 lg:px-8" aria-label="Global">
        <Link href="/colors">Playground</Link>
        <Link href="/colors/tailwind-colors">Tailwind Colors</Link>
        <Link href="/colors/radix-colors">Radix Colors</Link>
      </nav>
      <main className="mt-4 mb-12 px-6 md:px-8 lg:max-w-7xl lg:px-8 mx-auto">
        {children}
      </main>
    </>
  );
}
