
import ColorScaleGenerator from "@/components/color-scale-generator";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12">
      <h1 className="text-4xl font-bold">Theming Playground</h1>
      <ColorScaleGenerator />
    </main>
  );
}
