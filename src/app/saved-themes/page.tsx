
export default async function SavedThemes() {

  return (
    <main className="min-h-screen flex flex-col-reverse md:flex-row">
      <section className="flex-1 mb-12">
        view sameple ui with theme vars applied
      </section>
      <aside className="md:max-w-[512px] flex-1 md:border-l border-b border-neutral-200 flex flex-col bg-white">
        - Select a theme
        - View theme details
        - Option to update theme (if changes are made)
        - Option to delete theme
      </aside>
    </main>
  );
}