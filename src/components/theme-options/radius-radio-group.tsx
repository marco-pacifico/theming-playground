import { capitalizeFirstLetter } from "@/lib/utils";
import { createRadiusCSSVariables } from "@/lib/theme-vars";
import { useEffect, useState } from "react";

export default function RadiusRadioGroup() {
  const RADIUS_OPTIONS = [
    { id: "none", specimenSize: 0 },
    { id: "small", specimenSize: 6 },
    { id: "medium", specimenSize: 12 },
    { id: "large", specimenSize: 16 },
    { id: "full", specimenSize: 9999 },
  ];
  const [radius, setRadius] = useState<string>("medium");

  useEffect(() => {
    // CREATE CSS VARIABLES FOR THE RADIUS
    createRadiusCSSVariables(radius);
  }, [radius]);

  return (
    <div>
      <h2 id="corner-radius" className="font-semibold text-neutral-800 mb-2">
        Corner Radius
      </h2>
      <div
        role="group"
        aria-labelledby="corner-radius"
        className="flex gap-4 flex-wrap"
      >
        {RADIUS_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex flex-col items-center gap-2 text-sm text-neutral-600 cursor-pointer"
          >
            <input
              className="appearance-none absolute"
              type="radio"
              name="radio"
              value={option.id}
              checked={radius === option.id}
              onChange={(event) => setRadius(event.target.value)}
            />
            <div
              className={`w-16 h-16 bg-neutral-100 ${
                radius === option.id
                  ? "border-neutral-950/70 border-4 scale-110"
                  : "border-neutral-950/30 border-2 hover:-translate-y-1 transition-transform"
              }`}
              style={{ borderRadius: option.specimenSize }}
            ></div>
            {capitalizeFirstLetter(option.id)}
          </label>
        ))}
      </div>
    </div>
  );
}
