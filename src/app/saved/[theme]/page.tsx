import { fetchThemeById } from "@/lib/data";
import { auth } from "@/auth/auth";

export default async function ThemePage({
  params,
}: {
  params: { theme: string };
}) {
  const theme = await fetchThemeById(params.theme);
  return (
    <>
      <h2 className="mb-6">Theme: {theme?.name}</h2>
      <ul>
        <li>Brand color: {theme?.brandColor}</li>
        <li>Neutral color: {theme?.neutralColor}</li>
        <li>Radius Mode: {theme?.radiusMode}</li>
        <li>Heading family: {theme?.headingFont}</li>
      </ul>
    </>
  );
}
