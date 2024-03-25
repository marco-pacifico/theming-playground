import { auth } from "@/auth/auth";
import { fetchThemes } from "@/lib/data";
import Link from "next/link";

export default async function SavedThemesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    return (
      <main className="w-full bg-white px-6 py-80">
        <p className="text-center text-lg text-neutral-500">
          Sign in to view saved themes
        </p>
      </main>
    );
  }

  const themes = await fetchThemes();

  if (themes.length === 0) {
    return (
      <main className="w-full bg-white px-6 py-80">
        <p className="text-center text-lg text-neutral-500">
          No saved themes
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col-reverse lg:flex-row">
      <aside className="min-w-60 pb-20 bg-neutral-50 hidden md:block">
    
          <h2 className="font-medium mt-6 ml-8 mb-2 text-neutral-800">Saved Themes</h2>
          <ul>
            {themes.map((theme) => (
              <li key={theme.id}>
                <Link
                  href={`/saved/${theme.id}`}
                  className="text-neutral-80 block border-b border-neutral-100 px-8 py-4 hover:bg-neutral-100"
                >
                  {theme.name}
                </Link>
              </li>
            ))}
          </ul>
       
      </aside>
      <section className="mb-12 flex-1 p-6 md:border-l">
        Sample UI goes here...
      </section>
      <aside className="flex flex-1 flex-col border-b border-neutral-200 bg-white p-8 lg:max-w-[512px] lg:border-l">
        {children}
      </aside>
    </main>
  );
}
