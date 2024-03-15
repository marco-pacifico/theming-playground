import { createNeutralCSSVariables } from "@/lib/theme-vars";
import { ClosestColor, ReferenceColor } from "@/lib/types";
import { useEffect, useState } from "react";

export default function NeutralsRadio({
  referenceColors,
  closestColor,
}: {
  referenceColors: ReferenceColor[];
  closestColor: ClosestColor;
}) {
  const [neutral, setNeutral] = useState<string>(closestColor.matchingNeutral); // default to the matching
  const neutralsRadioOptions = referenceColors
    .filter((color) => color.isNeutral)
    .map((color) => color.id);

  useEffect(() => {
    // CREATE CSS VARIABLES FOR THE NEUTRAL COLOR
    createNeutralCSSVariables(neutral, referenceColors);
  }, [neutral, referenceColors]);

  
  return (
    <>
      <p
        id={"neutral-color"}
        className="font-semibold text-neutral-800 mt-4 mb-2"
      >
        Neutral Color
      </p>
      <div role="group" aria-labelledby={"neutral-color"}>
        {neutralsRadioOptions.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="radio"
              className="mr-2"
              name="radio"
              value={option}
              checked={neutral === option}
              onChange={(event) => setNeutral(event.target.value)}
            />
            {option}
          </label>
        ))}
      </div>
    </>
  );
}
