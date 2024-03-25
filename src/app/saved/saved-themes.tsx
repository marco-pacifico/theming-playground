import { fetchThemes } from "@/lib/data";

export default async function SavedThemes() {
  const themes = await fetchThemes();
  return (
    <main className="min-h-screen flex flex-col-reverse md:flex-row">
      <aside className="p-6 min-w-64">
        <h2 className="mb-6">List of themes</h2>
        <ul>
          {themes.map((theme) => (
            <li key={theme.id}>{theme.name}</li>
          ))}
        </ul>
      </aside>
      <section className="mb-12 flex-1 md:border-l p-6">
        view sameple ui with theme vars applied
      </section>
      <aside className="flex flex-1 flex-col border-b border-neutral-200 bg-white md:max-w-[512px] md:border-l p-6">
        - Select a theme - View theme details - Option to update theme (if
        changes are made) - Option to delete theme
      </aside>
    </main>
  );
}
