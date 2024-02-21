import ChromaColorScale from "@/components/chroma-color-scale";
import ColorScaleGenerator from "@/components/color-scale-generator";
import TailwindColorScales from "@/components/tailwind-color-scale";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <ColorScaleGenerator />
    </main>
  );
}
