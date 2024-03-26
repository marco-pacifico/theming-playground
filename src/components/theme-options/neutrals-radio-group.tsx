import { ReferenceColor } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useState } from "react";

export default function NeutralsRadio({
  referenceColors,
  matchingNeutral,
  neutral,
  setNeutral,
}: {
  referenceColors: ReferenceColor[];
  matchingNeutral: string;
  neutral: string;
  setNeutral: React.Dispatch<React.SetStateAction<string>>;
}) {
  

  const neutralsRadioOptions = referenceColors
    .filter((color) => color.isNeutral)
    .map((color) => {
      return {
        id: color.id,
        hexcode: color.shades[5].hexcode,
      };
    });

  return (
    <div >
      <h2 id="neutral-color" className="mb-2 font-semibold text-neutral-800">
        Neutral Color
      </h2>
      <div
        role="group"
        aria-labelledby="neutral-color"
        className="flex flex-wrap gap-4"
      >
        {neutralsRadioOptions.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer flex-col items-center gap-2 text-sm text-neutral-600"
          >
            <input
              className="absolute appearance-none"
              type="radio"
              name="radio"
              value={option.id}
              checked={neutral === option.id}
              onChange={(event) => setNeutral(event.target.value)}
            />
            <div
              className={`h-12 w-12 rounded-full  ${
                neutral === option.id
                  ? "ring-[6px] ring-neutral-950/80"
                  : "border-4 border-neutral-950/30 transition-transform hover:-translate-y-1"
              }`}
              style={{ background: option.hexcode }}
            ></div>
            <div className="relative flex flex-col items-center">
              {capitalizeFirstLetter(option.id)}
              {option.id === matchingNeutral && (
                <span className="absolute top-5 w-20 text-center text-xs text-green-600">
                  Best match
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
