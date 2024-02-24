import {
  APCA_CONTRAST_TARGETS,
  TAILWIND_NEUTRALS,
  TAILWIND_REFERENCE_COLORS
} from "@/CONSTANTS";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";
import {
  ClosestColor,
  ColorSpace,
  DistanceCalculationMethod,
  ReferenceColorScale,
} from "./types";

// FIND THE CLOSEST HUE AND SHADE FROM ARRAY OF REFERENCE COLOR SCALES AND RETURN THE CLOSEST COLOR SCALE THAT WILL BE ADJUSTED BASE ON THE INPUT COLOR
// Function to get closest color based on distance
// Distance can be calculated on sum of HSL values or based on DeltaE
// Returns closest color object with closet hue name, closest shade number, closest shade distance, hexcode, index, and shades in the closest color scale

export function getClosestColor(
  inputColor: string,
  referenceColors: ReferenceColorScale[] = TAILWIND_REFERENCE_COLORS,
  filterNeutrals: Boolean = true,
  distanceCalculationMethod: DistanceCalculationMethod = "deltaE"
): ClosestColor {
  // Filter out neutrals if the option is enabled
  let colorsToCompareAgainst = referenceColors;
  if (filterNeutrals) {
    colorsToCompareAgainst = referenceColors.filter(
      (color) => !TAILWIND_NEUTRALS.includes(color.id)
    );
  }
  // Initialize the closest color with default values
  let closestColor: ClosestColor = {
    hueName: "none",
    shadeNumber: 0,
    colorRamp: [],
    distance: Infinity,
    hexcode: "#000000",
  };
  // Go through every color and shade to find the closest match
  colorsToCompareAgainst.forEach((hue) => {
    hue.shades.forEach((shade) => {
      // Calculate distance based on the specified distance calculation method
      let distance = getDistanceBetweenColors(
        inputColor,
        shade.hexcode,
        distanceCalculationMethod
      );
      // Update closest color if the current shade is closer
      if (distance < closestColor.distance) {
        closestColor = {
          hueName: hue.name,
          shadeNumber: shade.number,
          colorRamp: hue.shades,
          distance,
          hexcode: shade.hexcode,
        };
      }
    });
  });

  return closestColor;
}

function getDistanceBetweenColors(
  inputColor: string,
  shadeHex: string,
  distanceCalculationMethod: DistanceCalculationMethod
) {
  if (distanceCalculationMethod === "deltaE") {
    return chroma.deltaE(inputColor, shadeHex);
  }
  const inputHSL = chroma(inputColor).hsl();
  const shadeHSL = chroma(shadeHex).hsl();
  const deltaH = Math.abs(inputHSL[0] - shadeHSL[0]);
  const deltaS = Math.abs(inputHSL[1] - shadeHSL[1]);
  const deltaL = Math.abs(inputHSL[2] - shadeHSL[2]);

  return deltaH + deltaS + deltaL;
}

// DETERMINE WHAT INDEX THE INPUT COLOR SHOULD BE IN WITH THE CLOSEST COLOR SCALE
// Function to get index of target color in the closest color scale
// Takes in input color and closest color scale
// Can get index based on closest HSL lightness, closest OKLAB lightness, or closest OKLCH lightness
// Returns index of the closest shade in the closest color scale
function findInputColorShadeIndexBasedOnLightnessDifference(
  inputColor: string,
  closestColor: ClosestColor,
  colorSpace: ColorSpace = "HSL"
) {
  let closestShadeIndex = 0;
  let smallestDifference = Infinity;
  const inputLightness = getLightnessValue(
    inputColor,
    colorSpace
  );
  closestColor.colorRamp.forEach((shade, index) => {
    const itemLightness = getLightnessValue(
      shade.hexcode,
      colorSpace
    );
    const difference = Math.abs(inputLightness - itemLightness);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestShadeIndex = index;
    }
  });
  return closestShadeIndex;
}

function getLightnessValue(hex: string, colorSpace: ColorSpace) {
  if (colorSpace === "HSL") {
    return chroma(hex).get("hsl.l");
  } else if (colorSpace === "OKLAB") {
    return chroma(hex).get("oklab.l");
  } else if (colorSpace === "OKLCH") {
    return chroma(hex).get("oklch.l");
  } else {
    throw new Error("Invalid index calculation method");
  }
}

// ADJUST THE CLOSEST COLOR SCALE BASED ON THE INPUT COLOR
// Function to adjust the closest color scale based on the input color
// Ajustment can be made by adjusting HSL values, OKLAB values, or OKLCH values, or by using Chroma's scale method
// Returns the adjusted color scale

export function generateColorScale(
  inputColor: string,
  referenceColors: ReferenceColorScale[] = TAILWIND_REFERENCE_COLORS,
  distanceCalculationMethod: DistanceCalculationMethod = "deltaE",
  colorSpace: ColorSpace = "HSL",
  filterNeutrals: Boolean = true
) {
  
  // Get the closest color and shade from the reference color scales
  const closestColor = getClosestColor(inputColor, referenceColors, filterNeutrals, distanceCalculationMethod);
  // Find the index of the closest shade in the closest color scale by finding the shade with the closest lightness value, 
  // based on the specified color space
  const inputColorIndex = findInputColorShadeIndexBasedOnLightnessDifference(
    inputColor,
    closestColor,
    colorSpace
  );

  // Go through the closest color scale and adjust each shade based on the input color
  // The closest shade will be replaced with the input color, and the other shades will be adjusted based on the input color
  // Adjustments can be made based on HSL, OKLAB, or OKLCH values

  const hueDifference = getHueDifference(inputColor, closestColor.hexcode);
  const saturationRatio = getSaturationRatio(inputColor, closestColor.hexcode);

  const adjustedScale = closestColor.colorRamp.map((shade, index) => {

    // Leave the input color unchanged, and place it in the correct index within the scale
    if (index === inputColorIndex) return inputColor;

    let shadeHex = shade.hexcode;
    const adjustedSaturation = chroma(shadeHex).get('hsl.s') * saturationRatio;
    const shadeHue = chroma(shadeHex).get('hsl.h');
    let adjustedHue = chroma(shadeHex).get('hsl.h') + hueDifference;
    if (adjustedHue < 0) {
      adjustedHue = adjustedHue + 360;
    }
    if (adjustedHue > 360) {
      adjustedHue = adjustedHue - 360;
    }
    // Apply hue and saturation adjustments
    shadeHex = chroma(shadeHex).set('hsl.s', adjustedSaturation).hex();
    shadeHex = chroma(shadeHex).set('hsl.h', adjustedHue).hex();

    const newHue = chroma(shadeHex).get('hsl.h');
    console.log({index, shadeHue, hueDifference, newHue})

    return shadeHex;
  });

  return adjustedScale;
}


function getSaturationRatio(inputColor: string, comparisonColor: string) {
  let saturationRatio = chroma(inputColor).get('hsl.s') / chroma(comparisonColor).get('hsl.s');
  return saturationRatio
}

function getHueDifference(inputColor: string, comparisonColor: string) {
  const inputHue = chroma(inputColor).get('hsl.h');
  const comparisonHue = chroma(comparisonColor).get('hsl.h');
  let hueDifference = inputHue - (comparisonHue || 0); // Default to 0 if comparisonHue is undefined or NaN (e.g. white or black)
  // Adjust for the fact that hue is a circle, negative values are adjusted to be at the end of the circle
  // if (hueDifference < 0) {
  //   hueDifference = 360 + hueDifference;
  // }
  console.log({inputColor, comparisonColor, inputHue, comparisonHue, hueDifference})
  return hueDifference;
}



// DISPLAY PURPOSES
// Get the closest APCA shade for a given color
type ClosestAPCAShade = {
  shade: number;
  inputAPCA: number;
  referenceAPCA: number;
};
export function getClosestAPCAShade(
  inputHex: string,
  background: "onWhite" | "onBlack" = "onWhite"
): ClosestAPCAShade {
  const backgroundHex = background === "onWhite" ? "#ffffff" : "#000000";
  const inputAPCA = +calcAPCA(inputHex, backgroundHex);

  const apcaOn = background === "onWhite" ? "apcaOnWhite" : "apcaOnBlack";
  let closestShade = {
    shade: APCA_CONTRAST_TARGETS[0].number, // Default to the first shade as a starting comparison point
    inputAPCA,
    referenceAPCA: APCA_CONTRAST_TARGETS[0][apcaOn],
  };
  let smallestDifference = Math.abs(
    inputAPCA - APCA_CONTRAST_TARGETS[0][apcaOn]
  ); // Initialize with the first shade difference

  APCA_CONTRAST_TARGETS.forEach((shade) => {
    const difference = Math.abs(inputAPCA - shade[apcaOn]);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestShade = {
        shade: shade.number,
        inputAPCA,
        referenceAPCA: shade[apcaOn],
      };
    }
  });

  return closestShade;
}
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

  return `${hue} ${saturation}% ${lightness}%`;
}

  // Get Color Scales from a tailwind reference families object
// Define the types for your color ramps and shades
export function getColorScalesFromReference(
  referenceColorScales: ReferenceColorScale[]
) {
  return referenceColorScales.map((scale) => ({
    name: scale.name,
    colorScale: scale.shades.map((shade) => shade.hexcode),
  }));
}
