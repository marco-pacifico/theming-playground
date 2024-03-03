import { TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import { getColorScalesFromReference } from "@/lib/color-utils";
import ColorScale from "./color-scale";
import { ReferenceColor } from "@/lib/types";

export default function ReferenceColorScales({
  closestColor,
  referenceColors = TAILWIND_REFERENCE_COLORS,
  printColorSpace,
}: {
  closestColor?: string;
  referenceColors: ReferenceColor[];
  printColorSpace: "hsl" | "oklch";
}) {
  const allReferenceColorScales = getColorScalesFromReference(referenceColors);

  // Filter color scales based on the closestColor prop
  const filteredColorScales = closestColor
    ? allReferenceColorScales.filter(({ name }) => name === closestColor)
    : allReferenceColorScales;

  return (
    <div className="flex flex-col gap-10 mt-10 pt-4 w-full">
      {filteredColorScales.map(({ name, scale }) => (
        <div key={name}>
          <h2>{name}</h2> {/* Display the name of the color */}
          <ColorScale scale={scale} printColorSpace={printColorSpace} />
        </div>
      ))}
    </div>
  );
}
