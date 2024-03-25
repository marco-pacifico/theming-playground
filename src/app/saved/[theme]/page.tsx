import ThemeOptions from "@/components/theme-options/theme-options";
import deleteTheme from "@/lib/actions";
import { fetchThemeById } from "@/lib/data";

export default async function ThemePage({
  params,
}: {
  params: { theme: string };
}) {
  const theme = await fetchThemeById(params.theme);
  return (
    <>
      <div className="flex-grow mb-8">
        <h2 className="mb-8 text-2xl text-neutral-600">{theme?.name}</h2>
        <ThemeOptions
          initialBrandColor={theme?.brandColor}
          initialNeutralColor={theme?.neutralColor}
          initialRadiusMode={theme?.radiusMode}
          initialHeadingFont={theme?.headingFont}
        />
      </div>
      <form action={deleteTheme}>
        <input type="hidden" name="id" value={theme?.id} />
        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-neutral-800 px-4 py-3 text-lg font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-950 hover:text-neutral-50 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
        >
          Delete theme
        </button>
      </form>
    </>
  );
}
