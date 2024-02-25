import { APCA_CONTRAST_TARGETS, RADIX_REFERENCE_COLORS } from "@/CONSTANTS";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";
import {
  ClosestColor,
  ColorSpace,
  DistanceCalculationMethod,
  NewColor,
  ReferenceColor,
} from "./types";

export function generateColor(
  inputHex: string,
  referenceColors: ReferenceColor[] = RADIX_REFERENCE_COLORS,
  calculateDistanceUsing: DistanceCalculationMethod = "deltaE",
  getIndexUsing: ColorSpace = "HSL",
  filterNeutrals: Boolean = true,
  adjustScaleUsing: ColorSpace = "HSL"
): NewColor {
  // GET CLOESET COLOR FROM REFERENCE COLOR SCALES, USING THE SPECIFIED DISTANCE CALCULATION METHOD
  // DETERMINE WHAT INDEX THE INPUT COLOR SHOULD BE IN WITHIN THE CLOSEST COLOR SCALE, BASED ON THE SPECIFIED LIGHTNESS VALUE BY COLOR SPACE
  const closestColor = getClosestColor(
    inputHex,
    referenceColors,
    filterNeutrals,
    calculateDistanceUsing,
    getIndexUsing
  );

  // ADJUST THE CLOSEST COLOR SCALE BASED ON THE INPUT COLOR
  // Go through the closest color scale and adjust each shade based on the input color
  // The closest shade will be replaced with the input color, and the other shades will be adjusted based on the input color
  // Adjustments can be made based on HSL, OKLAB, or OKLCH values

  let adjustedScale: string[] = [];
  if (adjustScaleUsing === "HSL") {
    adjustedScale = adjustScaleUsingHSLDifference(inputHex, closestColor);
  } else if (adjustScaleUsing === "OKLAB") {
    adjustedScale = aduadjustScaleUsingOKLABDifference(inputHex, closestColor);
  } else if (adjustScaleUsing === "OKLCH") {
    adjustedScale = aduadjustScaleUsingOKLCHDifference(inputHex, closestColor);
  } else {
    throw new Error("Invalid index calculation method");
  }

  // const adjustedScale = adjustScaleUsingHSLDifference(inputHex, closestColor);

  return {
    closestColor: closestColor,
    scale: adjustedScale,
  };
}

export function adjustScaleUsingHSLDifference(
  inputHex: string,
  closestColor: ClosestColor
) {
  const hueDifference = getHueDifference(inputHex, closestColor.indexHexcode);
  const saturationRatio = getSaturationRatio(
    inputHex,
    closestColor.indexHexcode
  );
  const adjustedScale = closestColor.scale.map((shade, index) => {
    // Leave the input color unchanged, and place it in the correct index within the scale
    if (index === closestColor.inputIndex) return inputHex;

    // Adjust the other shades based on the input color
    let shadeHex = shade.hexcode;
    const adjustedSaturation = chroma(shadeHex).get("hsl.s") * saturationRatio;
    const shadeHue = chroma(shadeHex).get("hsl.h");
    let adjustedHue = shadeHue + hueDifference;
    if (adjustedHue < 0) {
      adjustedHue = adjustedHue + 360;
    }
    if (adjustedHue > 360) {
      adjustedHue = adjustedHue - 360;
    }
    // Lightness in the adjusted scale is the same as the closest color scale
    // Apply hue and saturation adjustments
    shadeHex = chroma(shadeHex).set("hsl.s", adjustedSaturation).hex();
    shadeHex = chroma(shadeHex).set("hsl.h", adjustedHue).hex();

    return shadeHex;
  });

  return adjustedScale;
}

export function aduadjustScaleUsingOKLABDifference(
  inputHex: string,
  closestColor: ClosestColor
) {
  const lDifference = chroma(inputHex).get("oklab.l") - chroma(closestColor.indexHexcode).get("oklab.l");
  const aDifference = getADifference(inputHex, closestColor.indexHexcode);
  const bDifference = getBDifference(inputHex, closestColor.indexHexcode);

  const adjustedScale = closestColor.scale.map((shade, index) => {
    // Leave the input color unchanged, and place it in the correct index within the scale
    if (index === closestColor.inputIndex) return inputHex;

    // Adjust the other shades based on the input color
    let shadeHex = shade.hexcode;
    const adjustedL = chroma(shadeHex).get("oklab.l") + lDifference;
    const adjustedA = chroma(shadeHex).get("oklab.a") + aDifference;
    const adjustedB = chroma(shadeHex).get("oklab.b") + bDifference;
    // Lightness in the adjusted scale is the same as the closest color scale
    shadeHex = chroma(shadeHex).set("oklab.l", adjustedL).hex();
    shadeHex = chroma(shadeHex).set("oklab.a", adjustedA).hex();
    shadeHex = chroma(shadeHex).set("oklab.b", adjustedB).hex();

    return shadeHex;
  });
  return adjustedScale;
}

export function aduadjustScaleUsingOKLCHDifference(inputHex: string, closestColor: ClosestColor) {
  // OKLCH color space is a cylindrical version of the CIELAB color space and is designed to be more perceptually uniform than CIELAB.
  // Need to adjust L in OKLCH color space since L reflects perceived lightness
  // E.g. In Oklch, sRGB blue is  oklch(0.452 0.313 264.1) while sRGB yellow is  oklch(0.968 0.211 109.8). 
  // The Oklch Lightnesses of 0.452 and 0.968 clearly reflect the visual lightnesses of the two colors.
  const lDifference = chroma(inputHex).get("oklch.l") - chroma(closestColor.indexHexcode).get("oklch.l");
  // 
  const cRatio = getCRatio(inputHex, closestColor.indexHexcode);
  const hDifference = getHDifference(inputHex, closestColor.indexHexcode);
  const adjustedScale = closestColor.scale.map((shade, index) => {
    // Leave the input color unchanged, and place it in the correct index within the scale
    if (index === closestColor.inputIndex) return inputHex;

    // Adjust the other shades based on the input color
    let shadeHex = shade.hexcode;
    const adjustedC = chroma(shadeHex).get("oklch.c") * cRatio;
    let adjustedH = chroma(shadeHex).get("oklch.h") + hDifference;
    if (adjustedH < 0) {
      adjustedH = adjustedH + 360;
    }
    if (adjustedH > 360) {
      adjustedH = adjustedH - 360;
    }
    const adjustedL = chroma(shadeHex).get("oklch.l") + lDifference;
    // Apply a and b adjustments
    shadeHex = chroma(shadeHex).set("oklch.l", adjustedL).hex();
    shadeHex = chroma(shadeHex).set("oklch.c", adjustedC).hex();
    shadeHex = chroma(shadeHex).set("oklch.h", adjustedH).hex();

    return shadeHex;
  });
  return adjustedScale;

}

function getCRatio(inputHex: string, comparisonHex: string) {
  const cRatio = chroma(inputHex).get("oklch.c") / chroma(comparisonHex).get("oklch.c");
  return cRatio;
}
function getHDifference(inputHex: string, comparisonHex: string) {
  const hDifference = chroma(inputHex).get("oklch.h") - chroma(comparisonHex).get("oklch.h");
  return hDifference;
}
function getADifference(inputHex: string, comparisonHex: string) {
  const aDelta = chroma(inputHex).get("oklab.a") - chroma(comparisonHex).get("oklab.a");
  let aDifference;
  if (aDelta < 0) {
   aDifference = -Math.sqrt(Math.pow(chroma(inputHex).get("oklab.a"), 2) + Math.pow(chroma(comparisonHex).get("oklab.a"), 2));
  } else if (aDelta > 0) {
    aDifference = Math.sqrt(Math.pow(chroma(inputHex).get("oklab.a"), 2) + Math.pow(chroma(comparisonHex).get("oklab.a"), 2));
  } else {
    aDifference = 0;
  }
  return aDifference;
}
function getBDifference(inputHex: string, comparisonHex: string) {
  const bDelta = chroma(inputHex).get("oklab.b") - chroma(comparisonHex).get("oklab.b");
  let bDifference;
  if (bDelta < 0) {
   bDifference = -Math.sqrt(Math.pow(chroma(inputHex).get("oklab.b"), 2) + Math.pow(chroma(comparisonHex).get("oklab.b"), 2));
  } else if (bDelta > 0) {
    bDifference = Math.sqrt(Math.pow(chroma(inputHex).get("oklab.b"), 2) + Math.pow(chroma(comparisonHex).get("oklab.b"), 2));
  } else {
    bDifference = 0;
  }
  return bDifference;
}
export function getSaturationRatio(inputHex: string, comparisonHex: string) {
  let saturationRatio =
    chroma(inputHex).get("hsl.s") / chroma(comparisonHex).get("hsl.s");
  return saturationRatio;
}

export function getHueDifference(inputHex: string, comparisonHex: string) {
  const inputHueValue = chroma(inputHex).get("hsl.h");
  const comparisonHueValue = chroma(comparisonHex).get("hsl.h");
  let hueDifference = inputHueValue - (comparisonHueValue || 0); // Default to 0 if comparisonHue is undefined or NaN (e.g. white or black)
  return hueDifference;
}

// FIND THE CLOSEST HUE AND SHADE FROM ARRAY OF REFERENCE COLOR SCALES AND RETURN THE CLOSEST COLOR SCALE THAT WILL BE ADJUSTED BASE ON THE INPUT COLOR
// Function to get closest color based on distance
// Distance can be calculated on sum of HSL values or based on DeltaE
// Returns closest color object with closet hue name, closest shade number, closest shade distance, hexcode, index, and shades in the closest color scale

export function getClosestColor(
  inputHex: string,
  referenceColors: ReferenceColor[],
  filterNeutrals: Boolean,
  calculateDistanceUsing: DistanceCalculationMethod,
  calculateLightnessUsing: ColorSpace
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
      // Calculate distance based on the specified distance calculation method
      let distance = getDistanceBetweenColors(
        inputHex,
        shade.hexcode,
        calculateDistanceUsing
      );
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
  // based on the specified color space
  // const inputColorIndex = findInputColorShadeIndexBasedOnAPCADifference(
  //   inputHex,
  //   closestColor,
  //   calculateLightnessUsing
  // );
  const inputColorIndex = findInputColorShadeIndexBasedOnLightnessDifference(
    inputHex,
    closestColor,
    calculateLightnessUsing
  );

  return {
    ...closestColor,
    inputIndex: inputColorIndex,
    indexHexcode: closestColor.scale[inputColorIndex].hexcode,
  };
}

function getDistanceBetweenColors(
  inputHex: string,
  shadeHex: string,
  calculateDistanceUsing: DistanceCalculationMethod
) {
  if (calculateDistanceUsing === "deltaE") {
    return chroma.deltaE(inputHex, shadeHex);
  } else if (calculateDistanceUsing === "SumHSL") {
    const inputHSL = chroma(inputHex).hsl();
    const shadeHSL = chroma(shadeHex).hsl();
    const deltaH = Math.abs(inputHSL[0] - shadeHSL[0]);
    const deltaS = Math.abs(inputHSL[1] - shadeHSL[1]) * 100;
    const deltaL = Math.abs(inputHSL[2] - shadeHSL[2]) * 100;
    return deltaH + deltaS + deltaL;
  } else if (calculateDistanceUsing === "SumOKLAB") {
    const inputOKLAB = chroma(inputHex).oklab();
    const shadeOKLAB = chroma(shadeHex).oklab();
    const deltaL = Math.abs(inputOKLAB[0] - shadeOKLAB[0]);
    const deltaA = Math.abs(inputOKLAB[1] - shadeOKLAB[1]);
    const deltaB = Math.abs(inputOKLAB[2] - shadeOKLAB[2]);
    return deltaL + deltaA + deltaB;
  } else if (calculateDistanceUsing === "SumOKLCH") {
    const inputOKLCH = chroma(inputHex).oklch();
    const shadeOKLCH = chroma(shadeHex).oklch();
    const deltaL = Math.abs(inputOKLCH[0] - shadeOKLCH[0]);
    const deltaC = Math.abs(inputOKLCH[1] - shadeOKLCH[1]);
    const deltaH = Math.abs(inputOKLCH[2] - shadeOKLCH[2]);
    return deltaL + deltaC + deltaH;
  } else {
    throw new Error("Invalid distance calculation method");
  }
}

// DETERMINE WHAT INDEX THE INPUT COLOR SHOULD BE IN WITH THE CLOSEST COLOR SCALE
// Function to get index of target color in the closest color scale
// Takes in input color and closest color scale
// Can get index based on closest HSL lightness, closest OKLAB lightness, or closest OKLCH lightness
// Returns index of the closest shade in the closest color scale
function findInputColorShadeIndexBasedOnAPCADifference(
  inputColor: string,
  closestColor: ClosestColor,
  getLightnessUsing: ColorSpace = "HSL"
) {
  let closestShadeIndex = 0;
  let smallestDifference = Infinity;
  const inputAPCA = +calcAPCA(inputColor, "#ffffff");
  closestColor.scale.forEach((shade, index) => {
    const itemAPCA = +calcAPCA(shade.hexcode, "#ffffff");
    const difference = Math.abs(inputAPCA - itemAPCA);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestShadeIndex = index;
    }
  });
  return closestShadeIndex;
}
function findInputColorShadeIndexBasedOnLightnessDifference(
  inputColor: string,
  closestColor: ClosestColor,
  getLightnessUsing: ColorSpace = "HSL"
) {
  let closestShadeIndex = 0;
  let smallestDifference = Infinity;
  const inputLightness = getLightnessValue(inputColor, getLightnessUsing);
  closestColor.scale.forEach((shade, index) => {
    const itemLightness = getLightnessValue(shade.hexcode, getLightnessUsing);
    const difference = Math.abs(inputLightness - itemLightness);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestShadeIndex = index;
    }
  });
  return closestShadeIndex;
}

function getLightnessValue(hex: string, getLightnessUsing: ColorSpace) {
  if (getLightnessUsing === "HSL") {
    return chroma(hex).get("hsl.l");
  } else if (getLightnessUsing === "OKLAB") {
    return chroma(hex).get("oklab.l");
  } else if (getLightnessUsing === "OKLCH") {
    return chroma(hex).get("oklch.l");
  } else {
    throw new Error("Invalid index calculation method");
  }
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
  referenceColorScales: ReferenceColor[]
) {
  return referenceColorScales.map((scale) => ({
    name: scale.name,
    scale: scale.shades.map((shade) => shade.hexcode),
  }));
}
