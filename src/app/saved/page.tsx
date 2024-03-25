import { auth } from "@/auth/auth";
import { fetchThemes } from "@/lib/data";
import Link from "next/link";

export default async function SavedThemesPage() {
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
    <main className="min-h-screen">
      <aside className="min-w-60 pb-20">
        <h2 className="text-2xl mt-6 ml-8 mb-2 text-neutral-600">Saved Themes</h2>
        <ul>
          {themes.map((theme) => (
            <li key={theme.id}>
              <Link
                href={`/saved/${theme.id}`}
                className="text-neutral-80 block border-b border-neutral-100 px-8 py-4 hover:bg-neutral-100"
              >
                <div className="flex justify-between items-center">

                {theme.name}
              <div style={{backgroundColor: theme.brandColor}} className="h-8 w-8 rounded-full border-4 border-white/80"></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      
    </main>
  );

}
