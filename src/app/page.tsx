
import ColorScaleGenerator from "@/components/color-scale-generator";
export default function Home() {
  return (
    <main className="my-12 px-4 md:px-8 lg:max-w-7xl lg:px-8 mx-auto">
      <h1 className="text-4xl font-bold">Theming Playground</h1>
      <ColorScaleGenerator />
    </main>
  );
}
