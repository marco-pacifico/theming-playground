
import ColorScaleGenerator from "@/components/color-scale-generator";
export default function ColorPlayground() {
  return (
    <main className="my-12 px-4 md:px-8 lg:max-w-7xl lg:px-8 mx-auto">
      <h1 className="text-4xl font-bold">Color Playground</h1>
      <ColorScaleGenerator />
    </main>
  );
}
