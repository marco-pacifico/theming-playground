import { fetchThemeById } from "@/lib/data";
import { auth } from "@/auth/auth";
import ThemeOptions from "@/components/theme-options/theme-options";

export default async function ThemePage({
  params,
}: {
  params: { theme: string };
}) {
  const theme = await fetchThemeById(params.theme);
  return (
    <>
      <h2 className="text-2xl mb-8 text-neutral-600">{theme?.name}</h2>
      <ThemeOptions
        initialBrandColor={theme?.brandColor}
        initialNeutralColor={theme?.neutralColor}
        initialRadiusMode={theme?.radiusMode}
        initialHeadingFont={theme?.headingFont}
      />
    </>
  );
}
