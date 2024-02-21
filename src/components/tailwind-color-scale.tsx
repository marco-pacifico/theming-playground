import { TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import { getColorScalesFromReference } from "@/lib/color-utils";
import ColorScale from "./color-scale";

export default function TailwindColorScales({ closestColor } : { closestColor?: string } ) {
  const allTailwindColorScales = getColorScalesFromReference(TAILWIND_REFERENCE_COLORS);

  // Filter color scales based on the closestColor prop
  const filteredColorScales = closestColor
    ? allTailwindColorScales.filter(({ name }) => name === closestColor)
    : allTailwindColorScales;

  return (
    <div className="flex flex-col gap-10 mt-10">
      {filteredColorScales.map(({ name, colorScale }) => (
        <div key={name}>
          <h2>{name}</h2> {/* Display the name of the color */}
          <ColorScale colorScale={colorScale} />
        </div>
      ))}
    </div>
  );
}


