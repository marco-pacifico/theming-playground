import chroma from "chroma-js";
import ColorScale from "./color-scale";

export default function ChromaColorScale() {
  const scale = chroma.brewer.Blues;

  return (
    <div className="mt-4 ">
      <h2>Chroma Color Scale (Blues)</h2>
      <div className="flex space-x-2 overflow-x-auto">
        <ColorScale colorScale={scale} />
      </div>
    </div>
  );
}
