import {
  CONTRAST_TARGETS,
  TAILWIND_REFERENCE_COLORS
} from "@/CONSTANTS";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";
import { createCSSVariables, createNeutralCSSVariables } from "./theme-vars";
import { ClosestColor, NewColor, ReferenceColor } from "./types";

export function generateColor(
  inputHex: string,
  referenceColors: ReferenceColor[] = TAILWIND_REFERENCE_COLORS,
  filterNeutrals: boolean = true,
  lockInputColor: boolean = true,
  adjustContrast: boolean = true,
  neutral: string = "gray"
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
  let adjustedScale = adjustScaleUsingHSLDifference(
    inputHex,
    closestColor,
    lockInputColor
  );

  // OPTIONALLY ADJUST THE CONTRAST OF THE ADJUSTED SCALE TO MATCH THE REFERENCE SCALE CONTRAST
  if (adjustContrast) {
    // adjustedScale = adjustContrastBasedOnAPCATargets(
    //   inputHex,
    //   closestColor.inputIndex,
    //   lockInputColor,
    //   adjustedScale
    // );
    adjustedScale = adjustScaleContrast(
      inputHex,
      closestColor,
      lockInputColor,
      adjustedScale
    );
  }

  // CREATE CSS VARIABLES FOR THE ADJUSTED SCALE
  if (typeof window !== "undefined") {

    createNeutralCSSVariables(neutral, referenceColors);

    createCSSVariables(
      adjustedScale,
      lockInputColor,
      closestColor
    );
  }

  return {
    closestColor: closestColor,
    scale: adjustedScale,
  };
}

function adjustScaleUsingHSLDifference(
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
      chroma(closestColor.indexHexcode).get("hsl.s") || 1;
  // ADJUST THE CLOSEST COLOR SCALE BASED ON THE INPUT COLOR HUE DIFFERENCE AND SATURATION RATIO
  const adjustedScale = closestColor.scale.map((shade, index) => {
    // If input color is locked, leave the input color unchanged, and place it in the correct index within the scale
    if (lockInputColor && index === closestColor.inputIndex) return inputHex;
    // Ajust the unlocked shades
    let shadeHex = shade.hexcode;
    // Adjust saturation by the saturation ratio of input color to closest color
    const adjustedSaturation = chroma(shadeHex).get("hsl.s") * saturationRatio;
    // Adjust hue by the difference in hue between input color and closest color
    let adjustedHue = chroma(shadeHex).get("hsl.h") + hueDifference;
    // Correct hue to be within the 0-360 range, if it goes below 0 or above 360
    adjustedHue = (adjustedHue + 360) % 360;
    // Apply hue and saturation adjustments to the shade in the closest color scale
    shadeHex = chroma(shadeHex).set("hsl.s", adjustedSaturation).hex();
    shadeHex = chroma(shadeHex).set("hsl.h", adjustedHue).hex();
    // Lightness in the adjusted scale is the same as the closest color scale
    shadeHex = chroma(shadeHex)
      .set("hsl.l", chroma(shade.hexcode).get("hsl.l"))
      .hex();
    return shadeHex;
  });

  return adjustedScale;
}

function adjustContrastBasedOnAPCA(
  inputHex: string,
  inputIndex: number,
  lockInputColor: boolean,
  HSLAdjustedScale: string[]
) {
  const contrastAdjustedScale = HSLAdjustedScale.map((shade, index) => {
    // If input color is locked, leave the input color unchanged, and place it in the correct index within the scale
    if (lockInputColor && index === inputIndex) return inputHex;

    // DOES CONTRAST NEED TO BE ADJUSTED?
    let targetContrast = CONTRAST_TARGETS[index];
    const HSLAdjustedShadeContrast = Math.round(+getAPCA(shade) * 10);
    const THRESHOLD = 30;
    const LIFT =
      Math.abs((HSLAdjustedShadeContrast - targetContrast) / targetContrast) *
      100;
    if (LIFT < THRESHOLD) {
      return shade;
    } else {
      let contrastAdjustedShade = shade;
      for (let lightness = 1; lightness <= 100; lightness++) {
        // Incrementally adjust OKLCH lightness of the HSL adjusted shade
        let contrastAdjustedShade = chroma(shade)
          .set("oklch.l", lightness / 100)
          .hex();

        let newContrast = Math.round(+getAPCA(contrastAdjustedShade) * 10); // Contrast is an integer like 0, 1, 8, 1058)

        let lift =
          Math.abs((newContrast - targetContrast) / targetContrast) * 100;
        const CONTRAST_LIFT_THRESHOLD = 5;
        if (lift < CONTRAST_LIFT_THRESHOLD) {
          return contrastAdjustedShade;
        }
      }
      return contrastAdjustedShade;
    }
  });
  return contrastAdjustedScale;
}

function adjustScaleContrast(
  inputHex: string,
  closestColor: ClosestColor,
  lockInputColor: boolean,
  HSLAdjustedScale: string[]
) {
  const contrastAdjustedScale = HSLAdjustedScale.map((shade, index) => {
    // If input color is locked, leave the input color unchanged, and place it in the correct index within the scale
    if (lockInputColor && index === closestColor.inputIndex) return inputHex;

    // DOES CONTRAST NEED TO BE ADJUSTED?
    // Get contrast of the reference shade from the closest color scale
    const referenceShadeContrast = Math.round(
      +getAPCA(closestColor.scale[index].hexcode) * 10
    );
    // Get contrast of the adjusted shade
    const HSLAdjustedShadeContrast = Math.round(+getAPCA(shade) * 10);
    // If referenceShadeContrast is 0, don't adjust
    if (referenceShadeContrast === 0) return shade;
    // If absolute lift in contrast is less than a certain amount, don't adjust
    const contrastLift =
      (Math.abs(HSLAdjustedShadeContrast - referenceShadeContrast) /
        referenceShadeContrast) *
      100;
    const LIFT_THRESHOLD = 5;
    if (contrastLift < LIFT_THRESHOLD) return shade;

    // ADJUST OKLCH LIGHTNESS OF SHADE TO MATCH CONTRAST OF REFERENCE SHADE
    let contrastAdjustedShade = shade;

    if (HSLAdjustedShadeContrast > referenceShadeContrast) {
      const referenceShadeLightness = chroma(
        closestColor.scale[index].hexcode
      ).get("oklch.l");
      // If the adjusted shade has higher contrast than the reference shade, decrease the lightness
      for (
        let lightness = referenceShadeLightness * 100;
        lightness >= 0;
        lightness--
      ) {
        // Incrementally adjust OKLCH lightness of the HSL adjusted shade
        contrastAdjustedShade = chroma(contrastAdjustedShade)
          .set("oklch.l", lightness / 100)
          .hex();
        // Set the OKLCH chroma to match the HSLadjusted shade
        contrastAdjustedShade = chroma(contrastAdjustedShade)
          .set("oklch.c", chroma(shade).get("oklch.c"))
          .hex();
        // Set the OKLCH hue to match the input color
        // contrastAdjustedShade = chroma(contrastAdjustedShade).set("oklch.h", chroma(inputHex).get("oklch.h")).hex();
        // Set the OKLCH hue to match the HSL adjusted shade
        contrastAdjustedShade = chroma(contrastAdjustedShade)
          .set("oklch.h", chroma(shade).get("oklch.h"))
          .hex();

        // When the contrast is close to the reference shade, return the adjusted shade
        const CONTRAST_THRESHOLD = 50;
        let adjustedShadeContrast = Math.round(
          +getAPCA(contrastAdjustedShade) * 10
        ); // Contrast is an integer like 0, 1, 8, 1058)

        if (
          Math.abs(adjustedShadeContrast - referenceShadeContrast) <
          CONTRAST_THRESHOLD
        ) {
          return contrastAdjustedShade;
        }
      }
    }

    if (HSLAdjustedShadeContrast < referenceShadeContrast) {
      const referenceShadeLightness = chroma(
        closestColor.scale[index].hexcode
      ).get("oklch.l");
      // If the adjusted shade has lower contrast than the reference shade, increase the lightness
      for (
        let lightness = referenceShadeLightness * 100;
        lightness <= 100;
        lightness++
      ) {
        // Incrementally adjust OKLCH lightness of the HSL adjusted shade
        contrastAdjustedShade = chroma(contrastAdjustedShade)
          .set("oklch.l", lightness / 100)
          .hex();
        // Set the OKLCH chroma to match the HSLadjusted shade
        contrastAdjustedShade = chroma(contrastAdjustedShade)
          .set("oklch.c", chroma(shade).get("oklch.c"))
          .hex();
        // Set the OKLCH hue to match the input color
        // contrastAdjustedShade = chroma(contrastAdjustedShade).set("oklch.h", chroma(inputHex).get("oklch.h")).hex();
        // Set the OKLCH hue to match the HSL adjusted shade
        contrastAdjustedShade = chroma(contrastAdjustedShade)
          .set("oklch.h", chroma(shade).get("oklch.h"))
          .hex();

        // When the contrast is close to the reference shade, return the adjusted shade
        const CONTRAST_THRESHOLD = 50;
        let adjustedShadeContrast = Math.round(
          +getAPCA(contrastAdjustedShade) * 10
        ); // Contrast is an integer like 0, 1, 8, 1058)
        if (
          Math.abs(adjustedShadeContrast - referenceShadeContrast) <
          CONTRAST_THRESHOLD
        ) {
          return contrastAdjustedShade;
        }
      }
    }
    return contrastAdjustedShade;
  });
  return contrastAdjustedScale;
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
    referenceColorSystem: referenceColors === TAILWIND_REFERENCE_COLORS ? "tailwind" : "radix",
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
  const l = Math.round(oklch[0] * 100); // Default hue to 0 if NaN
  const c = Math.round(oklch[1] * 100);
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
