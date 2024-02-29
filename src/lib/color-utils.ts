import { SHADE_NUMBERS, TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";
import { ClosestColor, NewColor, ReferenceColor } from "./types";

export function generateColor(
  inputHex: string,
  referenceColors: ReferenceColor[] = TAILWIND_REFERENCE_COLORS,
  filterNeutrals: Boolean = true,
  lockInputColor: Boolean = true
): NewColor {
  // GET CLOESET COLOR FROM REFERENCE COLOR SCALES, USING THE SPECIFIED DISTANCE CALCULATION METHOD
  // DETERMINE WHAT INDEX THE INPUT COLOR SHOULD BE IN WITHIN THE CLOSEST COLOR SCALE, BASED ON THE SPECIFIED LIGHTNESS VALUE BY COLOR SPACE
  const closestColor = getClosestColor(
    inputHex,
    referenceColors,
    filterNeutrals
  );

  // ADJUST THE CLOSEST COLOR SCALE BASED ON THE INPUT COLOR
  // Go through the closest color scale and adjust each shade based on the input color
  // The closest shade will be replaced with the input color, and the other shades will be adjusted based on the input color
  const adjustedScale = adjustScaleUsingHSLDifference(
    inputHex,
    closestColor,
    lockInputColor
  );

  if (typeof window !== "undefined") {
    // Clear existing variables
    Array.from(document.documentElement.style).forEach((variable) => {
      document.documentElement.style.removeProperty(variable);
      // }
    });

    // Convert adjusted scale to css variables in root element

    adjustedScale.forEach((shade, index) => {
      if (lockInputColor && index === closestColor.inputIndex) {
        document.documentElement.style.setProperty(`--color-input, var(--color-brand-500)`, shade);
      }
      document.documentElement.style.setProperty(
        `--color-brand-${SHADE_NUMBERS[index]}`,
        shade
      );
    });
  }

  return {
    closestColor: closestColor,
    scale: adjustedScale,
  };
}

export function adjustScaleUsingHSLDifference(
  inputHex: string,
  closestColor: ClosestColor,
  lockInputColor: Boolean
) {
  // GET HUE DIFFERENCE between the input color and the closest color
  const hueDifference =
    chroma(inputHex).get("hsl.h") -
    (chroma(closestColor.indexHexcode).get("hsl.h") || 0); // Default to 0 if comparisonHue is undefined or NaN (e.g. white or black)

  // GET SATURATION RATIO between the input color and the closest color
  const saturationRatio =
    chroma(inputHex).get("hsl.s") /
    chroma(closestColor.indexHexcode).get("hsl.s");
    
  // ADJUST THE CLOSEST COLOR SCALE BASED ON THE INPUT COLOR HUE DIFFERENCE AND SATURATION RATIO
  const adjustedScale = closestColor.scale.map((shade, index) => {
    // If input color is locked, leave the input color unchanged, and place it in the correct index within the scale
    if (lockInputColor && index === closestColor.inputIndex) return inputHex;
    // Ajust the unlocked shades
    const referenceShadeHex = shade.hexcode;
    const referenceShadeContrast = Math.round(+getAPCA(referenceShadeHex) * 10);

    // Adjust saturation by the saturation ratio of input color to closest color
    const adjustedSaturation =
      chroma(referenceShadeHex).get("hsl.s") * saturationRatio;
    // Adjust hue by the difference in hue between input color and closest color
    let adjustedHue = chroma(referenceShadeHex).get("hsl.h") + hueDifference;
    // Correct hue to be within the 0-360 range, if it goes below 0 or above 360
    adjustedHue = (adjustedHue + 360) % 360;
    
    
    // Apply hue and saturation adjustments to the shade in the closest color scale
    let shadeHex = shade.hexcode;
    shadeHex = chroma(shadeHex)
    .set("hsl.s", adjustedSaturation)
    .hex();
    shadeHex = chroma(shadeHex).set("hsl.h", adjustedHue).hex();
    // Lightness in the adjusted scale is the same as the closest color scale
    shadeHex = chroma(shadeHex)
      .set("hsl.l", chroma(referenceShadeHex).get("hsl.l"))
      .hex();

    let constrastAjustedShadeHex = shadeHex;

    //TO-DO: Extract into a function
    //TO-DO: Check if contrast of shade needs to be adjusted at all before adjusting
    // - if the absolute lift in contrast is less than a certain amount, don't adjust
    // - e.g. 1056-1000 = 56, 56/1000 = 0.056, 0.056*100 = 5.6% lift in contrast
    // - e.g. 0 - 7 = -7, -7/7 = -1, -1*100 = -100% lift in contrast
    //TO-DO: Adjust lightness in direction/range needed, not 0 to 100

    // Adjust APCA of adjusted shade to roughly match APCA contrast of reference shade
    for (let lightness = 5; lightness <= 100; lightness++) {
      constrastAjustedShadeHex = chroma(constrastAjustedShadeHex)
      .set("oklch.l", lightness / 100)
      .hex();
      constrastAjustedShadeHex = chroma(constrastAjustedShadeHex)
      .set("oklch.c", chroma(shadeHex).get("oklch.c"))
      .hex();
      constrastAjustedShadeHex = chroma(constrastAjustedShadeHex).set("oklch.h", chroma(shadeHex).get("oklch.h")).hex();
      let shadeContrast = Math.round(+getAPCA(constrastAjustedShadeHex) * 10);
      if (Math.abs(shadeContrast - referenceShadeContrast) < 50) {
        return constrastAjustedShadeHex;
      }
    }

    return constrastAjustedShadeHex;
  });

  return adjustedScale;
}

// FIND THE CLOSEST HUE AND SHADE FROM ARRAY OF REFERENCE COLOR SCALES AND RETURN THE CLOSEST COLOR SCALE THAT WILL BE ADJUSTED BASE ON THE INPUT COLOR
// Function to get closest color based on distance
// Distance can be calculated on sum of HSL values or based on DeltaE
// Returns closest color object with closet hue name, closest shade number, closest shade distance, hexcode, index, and shades in the closest color scale

export function getClosestColor(
  inputHex: string,
  referenceColors: ReferenceColor[],
  filterNeutrals: Boolean
): ClosestColor {
  // Filter out neutrals if the option is enabled
  let colorsToCompareAgainst = referenceColors;
  if (filterNeutrals) {
    colorsToCompareAgainst = referenceColors.filter(
      (color) => !color.isNeutral
    );
  }
  // Initialize the closest color with default values
  let closestColor: ClosestColor = {
    hueName: "none",
    shadeNumber: 0,
    scale: [],
    distance: Infinity,
    hexcode: "#000000",
    inputIndex: 0,
    indexHexcode: "#000000",
  };
  // Go through every color and shade to find the closest match
  colorsToCompareAgainst.forEach((hue) => {
    hue.shades.forEach((shade) => {
      // Calculate distance based using deltaE
      const distance = chroma.deltaE(inputHex, shade.hexcode);
      // Update closest color if the current shade is closer
      if (distance < closestColor.distance) {
        closestColor = {
          ...closestColor,
          hueName: hue.name,
          shadeNumber: shade.number,
          scale: hue.shades,
          distance,
          hexcode: shade.hexcode,
        };
      }
    });
  });

  /// Find the index of the closest shade in the closest color scale by finding the shade with the closest lightness value,
  // in HSL color space
  const inputColorIndex = findInputColorShadeIndexBasedOnLightnessDifference(
    inputHex,
    closestColor
  );

  return {
    ...closestColor,
    inputIndex: inputColorIndex,
    indexHexcode: closestColor.scale[inputColorIndex].hexcode,
  };
}

// DETERMINE WHAT INDEX THE INPUT COLOR SHOULD BE IN WITH THE CLOSEST COLOR SCALE
// Function to get index of target color in the closest color scale
// Takes in input color and closest color scale
// Can get index based on closest HSL lightness
// Returns index of the closest shade in the closest color scale
function findInputColorShadeIndexBasedOnLightnessDifference(
  inputColor: string,
  closestColor: ClosestColor
) {
  let closestShadeIndex = 0;
  let smallestDifference = Infinity;
  const inputLightness = chroma(inputColor).get("hsl.l");
  closestColor.scale.forEach((shade, index) => {
    const itemLightness = chroma(shade.hexcode).get("hsl.l");
    const difference = Math.abs(inputLightness - itemLightness);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestShadeIndex = index;
    }
  });
  return closestShadeIndex;
}

// DISPLAY PURPOSES
// Get the APCA contrast ratio between two colors
export function getAPCA(
  foregroundColor: string,
  backgroundColor: string = "#ffffff"
) {
  return calcAPCA(foregroundColor, backgroundColor);
}
// Print the HSL value of a color
export function printHSL(hex: string) {
  const hsl = chroma(hex).hsl();
  const hue = isNaN(hsl[0]) ? 0 : Math.round(hsl[0]); // Default hue to 0 if NaN
  const saturation = Math.round(hsl[1] * 100);
  const lightness = Math.round(hsl[2] * 100);

  return `H${hue} S${saturation}% L${lightness}%`;
}

export function printOKLCH(hex: string) {
  const oklch = chroma(hex).oklch();
  const l = Math.round(oklch[0]*100); // Default hue to 0 if NaN
  const c = Math.round(oklch[1]*100);
  const h = isNaN(oklch[2]) ? 0 : Math.round(oklch[2]); // Default hue to 0 if NaN

  return `L${l} C${c} H${h}`;
}

// Get Color Scales from a tailwind reference families object
// Define the types for your color ramps and shades
export function getColorScalesFromReference(
  referenceColorScales: ReferenceColor[]
) {
  return referenceColorScales.map((scale) => ({
    name: scale.name,
    scale: scale.shades.map((shade) => shade.hexcode),
  }));
}
