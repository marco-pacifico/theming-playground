import SampleUI from "@/components/sample-ui";
import ThemeOptions from "@/components/theme-options";

export default function Home() {
  return (
    <main className="min-h-screen flex">
      <section className="flex-1 my-12 px-4 md:px-8">
        <SampleUI />
      </section>
      <aside className="w-[512px] p-8 border-l border-neutral-200 ">
          <h2 className="text-2xl mb-8 text-neutral-600">Theme</h2>
        <ThemeOptions />
      </aside>
      {/* <aside className="w-[512px] p-8 border-t border-l rounded-s-2xl border-neutral-200 fixed bg-white right-0 z-50 bottom-0 mb-4 shadow-lg">
          <h2 className="text-2xl mb-8">Theme</h2>
        <ThemeOptions />
      </aside> */}
    </main>
  );
}
