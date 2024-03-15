"use client";

import { TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import { generateColor } from "@/lib/color-utils";
import { createCSSVariables } from "@/lib/theme-vars";
import { NewColor, ReferenceColor } from "@/lib/types";
import { useEffect, useState } from "react";
import NeutralsRadio from "./neutrals-radio";
import SmallColorScale from "./small-color-scale";
import ButtonToggle from "./button-toggle";

export default function ThemeOptions() {
  const [brandColor, setBrandColor] = useState<string>("#a56f8e");
  const [referenceColors, setReferenceColors] = useState<ReferenceColor[]>(
    TAILWIND_REFERENCE_COLORS
  );
  const [lockInputColor, setLockInputColor] = useState<boolean>(true);
  const [filterNeutrals, setFilterNeutrals] = useState<boolean>(true);
  const [adjustContrast, setAdjustContrast] = useState<boolean>(true);
  const newBrandColor: NewColor = generateColor(
    brandColor,
    referenceColors,
    filterNeutrals,
    lockInputColor,
    adjustContrast
  );
  useEffect(() => {
    // CREATE CSS VARIABLES FOR THE ADJUSTED SCALE
    createCSSVariables(newBrandColor, lockInputColor);
  }, [newBrandColor, lockInputColor]);
  return (
    <div className="flex flex-col gap-12">
    <div>
      <p id="brand-color" className="font-semibold text-neutral-800 mb-2">
        Brand Color
      </p>
      <label className="inline-flex items-center gap-4 text-sm text-neutral-600 cursor-pointer">
        <input
          className="w-[60px] h-[60px] rounded-full border-neutral-950/30 border-[6px] overflow-hidden"
          style={{ background: brandColor }}
          type="color"
          name="brandColor"
          value={brandColor}
          onChange={(event) => setBrandColor(event.target.value)}
        />
        {brandColor.toLocaleUpperCase()}
      </label>
      <SmallColorScale inputHex={brandColor} scale={newBrandColor.scale} />
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        {/* Lock Input Color Toggle */}
        <ButtonToggle
          stateValue={lockInputColor}
          setStateValue={setLockInputColor}
        >
          Input Locked
        </ButtonToggle>
        {/* Adjust Contrast Toggle */}
        <ButtonToggle
          stateValue={adjustContrast}
          setStateValue={setAdjustContrast}
        >
          Adjust Contrast
        </ButtonToggle>
        {/* Filter neutrals color toggle */}
        <ButtonToggle
          stateValue={filterNeutrals}
          setStateValue={setFilterNeutrals}
        >
          Neutrals filtered
        </ButtonToggle>
      </div>
      </div>

      <NeutralsRadio
        key={newBrandColor.closestColor.matchingNeutral}
        referenceColors={referenceColors}
        closestColor={newBrandColor.closestColor}
      />
    </div>
  );
}
