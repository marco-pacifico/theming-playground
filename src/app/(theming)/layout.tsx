import ThemeOptions from "@/components/theme-options";
import Link from "next/link";

export default function ThemingLaout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen flex flex-col-reverse md:flex-row">
      <section className="flex-1 mb-12">
       <nav className="flex items-start gap-4 p-6 lg:px-8" aria-label="Global">
        <Link href="/">Ecommerce</Link>
        <Link href="/ui-sample">UI Components</Link>
      </nav>
      <div className="mt-4 px-6 md:px-8">
        { children }
      </div>
      </section>
      <aside className="md:max-w-[512px] p-8 md:border-l border-b border-neutral-200 ">
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
