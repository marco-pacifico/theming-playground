"use client";

import { TAILWIND_REFERENCE_COLORS } from "@/lib/CONSTANTS";
import { generateColor } from "@/lib/color-utils";
import {
  HEADING_FONT_OPTIONS,
  createCSSVariables,
  createHeadingFontVariables,
  createNeutralCSSVariables,
  createRadiusCSSVariables,
} from "@/lib/theme-vars";
import { NewColor } from "@/lib/types";
import { useEffect, useState } from "react";
import BrandColorSelection from "./brand-color-selection";
import HeadingFontRadioGroup from "./heading-font-radio-group";
import NeutralsRadio from "./neutrals-radio-group";
import RadiusRadioGroup from "./radius-radio-group";
import SaveThemeNew from "./save-theme-new";
import { Session } from "next-auth";

type ThemeOptionsProps = {
  initialBrandColor?: string;
  initialNeutralColor?: string;
  initialRadiusMode?: string;
  initialHeadingFont?: string;
  session: Session | null;
};

export default function ThemeOptions({
  initialBrandColor,
  initialNeutralColor,
  initialRadiusMode,
  initialHeadingFont,
  session,
}: ThemeOptionsProps) {
  const referenceColors = TAILWIND_REFERENCE_COLORS;

  // BRAND COLOR STATE
  const [brandColor, setBrandColor] = useState<string>(
    initialBrandColor || "#a56f8e",
  );
  const [lockInputColor, setLockInputColor] = useState<boolean>(true);
  const [filterNeutrals, setFilterNeutrals] = useState<boolean>(true);
  const [adjustContrast, setAdjustContrast] = useState<boolean>(true);
  const newBrandColor: NewColor = generateColor(
    brandColor,
    referenceColors,
    filterNeutrals,
    lockInputColor,
    adjustContrast,
  );
  // NEUTRAL COLOR STATE
  const matchingNeutral = newBrandColor.closestColor.matchingNeutral;
  const [neutral, setNeutral] = useState<string>(
    initialNeutralColor || matchingNeutral,
  ); // default to the matching

  // RADIUS MODE STATE
  const [radius, setRadius] = useState<string>(initialRadiusMode || "medium");
  // HEADINGS FONT STATE
  const [font, setFont] = useState<string>(initialHeadingFont || "inter");

  // CREATE BRAND COLOR CSS VARIABLES
  useEffect(() => {
    // CREATE CSS VARIABLES FOR THE ADJUSTED SCALE
    createCSSVariables(newBrandColor, lockInputColor);
  }, [newBrandColor, lockInputColor]);
  // CREATE NEUTRAL COLOR CSS VARIABLES
  useEffect(() => {
    createNeutralCSSVariables(neutral, referenceColors);
  }, [neutral, referenceColors]);
  // CREATE RADIUS CSS VARIABLES
  useEffect(() => {
    createRadiusCSSVariables(radius);
  }, [radius]);
  // CREATE HEADING FONT CSS VARIABLES
  useEffect(() => {
    const varName =
      HEADING_FONT_OPTIONS.find((option) => option.id === font)?.varName ||
      HEADING_FONT_OPTIONS[0].varName;
    createHeadingFontVariables(varName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [font]);

  return (
    <div className="sticky top-10 flex flex-col gap-12">
      <BrandColorSelection
        brandColor={brandColor}
        setBrandColor={setBrandColor}
        lockInputColor={lockInputColor}
        setLockInputColor={setLockInputColor}
        filterNeutrals={filterNeutrals}
        setFilterNeutrals={setFilterNeutrals}
        adjustContrast={adjustContrast}
        setAdjustContrast={setAdjustContrast}
        scale={newBrandColor.scale}
      />
      <NeutralsRadio
        referenceColors={referenceColors}
        matchingNeutral={matchingNeutral}
        neutral={neutral}
        setNeutral={setNeutral}
      />

      <RadiusRadioGroup radius={radius} setRadius={setRadius} />
      <HeadingFontRadioGroup font={font} setFont={setFont} />
      <footer className="sticky bottom-0 mt-12 flex justify-end bg-white/60 pb-6 pt-2 backdrop-blur-sm">
        {session ? (
          <SaveThemeNew
            brandColor={brandColor}
            neutralColor={neutral}
            radiusMode={radius}
            headingFont={font}
          />
        ) : (
          <button
            disabled
            className="inline-flex w-full cursor-not-allowed 
items-center justify-center whitespace-nowrap rounded-full border border-neutral-100 bg-neutral-50 px-4 py-3 text-lg font-medium text-neutral-400 shadow-sm"
          >
            Sign in to save theme
          </button>
        )}
      </footer>
    </div>
  );
}
