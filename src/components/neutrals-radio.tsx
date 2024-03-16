import { capitalizeFirstLetter } from "@/lib/helpers";
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
    .map((color) => {
      return {
        id: color.id,
        hexcode: color.shades[5].hexcode,
      };
    });

  useEffect(() => {
    // CREATE CSS VARIABLES FOR THE NEUTRAL COLOR
    createNeutralCSSVariables(neutral, referenceColors);
  }, [neutral, referenceColors]);

  return (
    <div>
      <h2
        id="neutral-color"
        className="font-semibold text-neutral-800 mb-2"
      >
        Neutral Color
      </h2>
      <div
        role="group"
        aria-labelledby="neutral-color"
        className="flex gap-4 flex-wrap"
      >
        {neutralsRadioOptions.map((option) => (
          <label
            key={option.id}
            className="flex flex-col items-center gap-2 text-sm text-neutral-600 cursor-pointer "
          >
            <input
              className="appearance-none absolute"
              type="radio"
              name="radio"
              value={option.id}
              checked={neutral === option.id}
              onChange={(event) => setNeutral(event.target.value)}
            />
            <div
              className={`w-12 h-12 rounded-full  ${
                neutral === option.id
                  ? "ring-neutral-950 ring-[6px]"
                  : "border-neutral-950/30 border-4"
              }`}
              style={{ background: option.hexcode }}
            ></div>
            <div className="flex flex-col relative items-center">
              {capitalizeFirstLetter(option.id)}
              {option.id === closestColor.matchingNeutral && (
                <span className="text-xs text-green-600 absolute top-5 text-center w-20">Best match</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
