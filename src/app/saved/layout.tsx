import { auth } from "@/auth/auth";
import { fetchThemes } from "@/lib/data";
import Link from "next/link";

export default async function SavedThemesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    return (
      <main className="w-full px-6 py-80 bg-white">
        <p className="text-center text-lg text-neutral-500">
          Sign in to view saved themes
        </p>
      </main>
    );
  }

  const themes = await fetchThemes();
  return (
    <main className="flex min-h-screen flex-col-reverse md:flex-row">
      <aside className="min-w-64 flex-1 py-4">
        <ul>
          {themes.map((theme) => (
            <li key={theme.id}>
              <Link href={`/saved/${theme.id}`} className="px-5 py-4 border-b border-neutral-100 text-neutral-80 hover:bg-neutral-100 block">{theme.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
      {/* <section className="mb-12 flex-1 p-6 md:border-l">
        view sameple ui with theme vars applied
      </section> */}
      <aside className="flex flex-1 flex-col border-b border-neutral-200 bg-white p-8 md:max-w-[512px] md:border-l">
        {children}
      </aside>
    </main>
  );
}
