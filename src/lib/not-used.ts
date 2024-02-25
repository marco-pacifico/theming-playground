import { TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import chroma from "chroma-js";
import {
  getClosestColor,
  getHueDifference,
  getSaturationRatio,
} from "./color-utils";
import {
  ColorSpace,
  DistanceCalculationMethod,
  NewColor,
  ReferenceColor,
} from "./types";

// Experimental
export function generateColorUsingChromaScale(
  inputHex: string,
  referenceColors: ReferenceColor[] = TAILWIND_REFERENCE_COLORS,
  calculateDistanceUsing: DistanceCalculationMethod = "deltaE",
  getIndexUsing: ColorSpace = "HSL",
  filterNeutrals: Boolean = true
): NewColor {
  // Get the closest color and shade from the reference color scales
  const closestColor = getClosestColor(
    inputHex,
    referenceColors,
    filterNeutrals,
    calculateDistanceUsing,
    getIndexUsing
  );

  const hueDifference = getHueDifference(inputHex, closestColor.indexHexcode);
  const saturationRatio = getSaturationRatio(
    inputHex,
    closestColor.indexHexcode
  );

  let shadeAtIndex0 = closestColor.scale[0].hexcode;
  const adjustedSaturationAtIndex0 =
    chroma(closestColor.scale[0].hexcode).get("hsl.s") * saturationRatio;
  const shadeHueAtIndex0 = chroma(closestColor.scale[0].hexcode).get("hsl.h");
  let adjustedHueAtIndex0 = shadeHueAtIndex0 + hueDifference;
  if (adjustedHueAtIndex0 < 0) {
    adjustedHueAtIndex0 = adjustedHueAtIndex0 + 360;
  }
  if (adjustedHueAtIndex0 > 360) {
    adjustedHueAtIndex0 = adjustedHueAtIndex0 - 360;
  }
  // Apply hue and saturation adjustments
  shadeAtIndex0 = chroma(shadeAtIndex0)
    .set("hsl.s", adjustedSaturationAtIndex0)
    .hex();
  shadeAtIndex0 = chroma(shadeAtIndex0).set("hsl.h", adjustedHueAtIndex0).hex();

  let shadeAtIndexEnd =
    closestColor.scale[closestColor.scale.length - 1].hexcode;
  const adjustedSaturationAtIndexEnd =
    chroma(closestColor.scale[closestColor.scale.length - 1].hexcode).get(
      "hsl.s"
    ) * saturationRatio;
  const shadeHueAtIndexEnd = chroma(closestColor.scale[0].hexcode).get("hsl.h");
  let adjustedHueAtIndexEnd = shadeHueAtIndexEnd + hueDifference;
  if (adjustedHueAtIndexEnd < 0) {
    adjustedHueAtIndexEnd = adjustedHueAtIndexEnd + 360;
  }
  if (adjustedHueAtIndexEnd > 360) {
    adjustedHueAtIndexEnd = adjustedHueAtIndexEnd - 360;
  }
  // Apply hue and saturation adjustments
  shadeAtIndexEnd = chroma(shadeAtIndexEnd)
    .set("hsl.s", adjustedSaturationAtIndexEnd)
    .hex();
  shadeAtIndexEnd = chroma(shadeAtIndexEnd)
    .set("hsl.h", adjustedHueAtIndexEnd)
    .hex();

  // Create scale using chroma.scale and the adjusted saturation scale
  const scale = chroma
    .bezier([shadeAtIndex0, inputHex, shadeAtIndexEnd])
    .scale()
    .mode("hsl")
    .correctLightness()
    .colors(closestColor.scale.length);

  // Insert the input color at its closest shade index
  const scaleWithInputHex = scale.map((hex, index) => {
    if (index === closestColor.inputIndex) return inputHex;
    return hex;
  });

  return {
    closestColor: closestColor,
    scale: scaleWithInputHex,
  };
}
