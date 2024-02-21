import {
    APCA_SHADES,
    SHADE_NUMBERS,
    TAILWIND_REFERENCE_COLORS,
} from "@/CONSTANTS";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";

type TailwindColorScale = {
  name: string;
  shades: { number: number; hexcode: string }[];
};

function getAverageOfTwoClosestTailwindScales(
  inputColor: string,
  tailwindColorScales: TailwindColorScale[],
  distanceMeasure: "regular" | "deltaE" = "deltaE"
) {
  let closestScale: TailwindColorScale = { name: "", shades: [] };
  let secondClosestScale: TailwindColorScale = { name: "", shades: [] };
  let closestDistance = Infinity;
  let secondClosestDistance = Infinity;

  tailwindColorScales.forEach((scale) => {
    scale.shades.forEach((shade) => {
      // Calculate distance based on the specified measure
      const distance =
        distanceMeasure === "deltaE"
          ? chroma.deltaE(inputColor, shade.hexcode)
          : chroma.distance(inputColor, shade.hexcode);

      if (distance < closestDistance) {
        secondClosestDistance = closestDistance;
        secondClosestScale = closestScale;

        closestDistance = distance;
        closestScale = scale;
      } else if (
        distance < secondClosestDistance &&
        scale.name !== closestScale?.name
      ) {
        secondClosestDistance = distance;
        secondClosestScale = scale;
      }
    });
  });

  const closestScaleHexCodes = closestScale.shades.map(
    (shade) => shade.hexcode
  );
  const secondClosestScaleHexCodes = secondClosestScale.shades.map(
    (shade) => shade.hexcode
  );

  const averageTwoScales = averageColorScales(
    closestScaleHexCodes,
    secondClosestScaleHexCodes
  );

  return averageTwoScales;
}

function averageColorScales(scaleA: string[], scaleB: string[]): string[] {
  // Ensure the scales are of the same length
  if (scaleA.length !== scaleB.length) {
    throw new Error("Scales must be of the same length to average them.");
  }

  // Generate the average scale
  const scaleAverage = scaleA.map((colorA, index) => {
    const colorB = scaleB[index];

    const colorALuminance = chroma(colorA).luminance() * 100;
    const colorBLuminance = chroma(colorB).luminance() * 100;

    const newH = chroma(colorA).get("hsl.h");
    const avgS =
      (chroma(colorA).get("hsl.s") + chroma(colorB).get("hsl.s")) / 2;
    const avgL =
      (chroma(colorA).get("hsl.l") + chroma(colorB).get("hsl.l")) / 2;

    return chroma.hsl(newH, avgS, avgL).hex();
  });

  return scaleAverage;
}

type ClosestTailwindColor = {
  color: string;
  shade: number;
  distance: number;
  hexcode: string;
  calibratedShade: number | null;
};

export function getClosestTailwindColor(
  inputColor: string,
  distanceMeasure: "regular" | "deltaE" = "regular"
): ClosestTailwindColor {
  // Initialize the closest color with default values
  let closestColor: ClosestTailwindColor = {
    color: "none",
    shade: 0,
    distance: Infinity,
    hexcode: "#000000",
    calibratedShade: null,
  };

  // Iterate over all Tailwind colors to find the closest match
  TAILWIND_REFERENCE_COLORS.forEach((tailwindColor) => {
    tailwindColor.shades.forEach((shade) => {
      // Calculate distance based on the specified measure
      const distance =
        distanceMeasure === "deltaE"
          ? chroma.deltaE(inputColor, shade.hexcode)
          : chroma.distance(inputColor, shade.hexcode);

      if (distance < closestColor.distance) {
        closestColor = {
          color: tailwindColor.name,
          shade: shade.number,
          distance,
          hexcode: shade.hexcode,
          calibratedShade: null,
        };
      }
    });
  });

  // Calibrate the closest color based on APCA contrast values
  return calibrateClosestTailwindColor(inputColor, closestColor);
}

function calibrateClosestTailwindColor(
  inputColor: string,
  closestColor: ClosestTailwindColor
): ClosestTailwindColor {
  // Calculate APCA contrast differences between input and closest Tailwind color
  const tailwindAPCA = +getAPCA(closestColor.hexcode);
  const { shade, inputAPCA, referenceAPCA } = getClosestAPCAShade(inputColor);
  const deltaAPCA = Math.abs(inputAPCA - referenceAPCA);
  const deltaTailwind = Math.abs(inputAPCA - tailwindAPCA);

  // Calibrate shade based on APCA contrast comparison
  if (deltaTailwind > deltaAPCA) {
    closestColor.calibratedShade = shade;
  }

  return closestColor;
}

function getTailwindColorScaleByName(colorName: string) {
  // Find the color family object that matches the provided color name
  const colorFamily = TAILWIND_REFERENCE_COLORS.find(
    (color) => color.name === colorName
  );

  // If the color family is found, map its shades to an array of hex codes
  if (colorFamily) {
    return colorFamily.shades.map((shade) => shade.hexcode);
  } else {
    // Optionally, return an empty array or a message if the color name is not found
    return `No color scale found for "${colorName}".`;
  }
}

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
    shade: APCA_SHADES[0].number, // Default to the first shade as a starting comparison point
    inputAPCA,
    referenceAPCA: APCA_SHADES[0][apcaOn],
  };
  let smallestDifference = Math.abs(inputAPCA - APCA_SHADES[0][apcaOn]); // Initialize with the first shade difference

  APCA_SHADES.forEach((shade) => {
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
type Shade = {
  number: number;
  hexcode: string;
};
type ColorRamp = {
  name: string;
  id: string;
  shades: Shade[];
};

export function getColorScalesFromReference(colorRamps: ColorRamp[]) {
  return colorRamps.map((colorRamp) => ({
    name: colorRamp.name,
    colorScale: colorRamp.shades.map((shade) => shade.hexcode),
  }));
}

export function generateColorScaleUsingAPCA(
  inputHex: string,
  background: "onWhite" | "onBlack" = "onWhite",
  steps: number = 11
) {
  // Initialize the scale array with a fixed size, filled initially with a placeholder
  let scale = Array(steps).fill("#000000"); // Assuming black as a placeholder

  // Find the index of the input color's closest shade number, if applicable
  const inputShadeIndex = SHADE_NUMBERS.indexOf(
    getClosestAPCAShade(inputHex, background)?.shade || 0
  );

  // Logic to populate the scale array based on the input color and its index
  // This is a simplified placeholder logic
  scale = scale.map((_, index) => {
    if (index === inputShadeIndex) return inputHex; // Input color at its position
    return index < inputShadeIndex ? "#ffffff" : "#000000"; // Lighter or darker
  });

  return scale;
}

export function findIndexBasedOnLightness(inputHex: string, scale: string[]) {
  if (chroma.valid(inputHex) === false) {
    throw new Error("Invalid input color");
  }

  const inputLightness = chroma(inputHex).get("hsl.l");
  let closestIndex = 0;
  let smallestDifference = Infinity;

  scale.forEach((hex, index) => {
    const itemLightness = chroma(hex).get("hsl.l");
    const difference = Math.abs(inputLightness - itemLightness);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = index;
    }
  });

  return closestIndex;
}

export function findIndexBasedOnOKLAB(inputHex: string, scale: string[]) {
  if (chroma.valid(inputHex) === false) {
    throw new Error("Invalid input color");
  }

  const inputLightness = chroma(inputHex).get("oklab.l");
  let closestIndex = 0;
  let smallestDifference = Infinity;

  scale.forEach((hex, index) => {
    const itemLightness = chroma(hex).get("oklab.l");
    const difference = Math.abs(inputLightness - itemLightness);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = index;
    }
  });

  return closestIndex;
}

export function findIndexBasedOnOKLCH(inputHex: string, scale: string[]) {
    if (chroma.valid(inputHex) === false) {
      throw new Error("Invalid input color");
    }
  
    const inputLightness = chroma(inputHex).get("oklch.l");
    let closestIndex = 0;
    let smallestDifference = Infinity;
  
    scale.forEach((hex, index) => {
      const itemLightness = chroma(hex).get("oklch.l");
      const difference = Math.abs(inputLightness - itemLightness);
  
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestIndex = index;
      }
    });
  
    return closestIndex;
  }

function findIndexBasedOnDistance(closestTailwindColor: ClosestTailwindColor) {
  const shadeToUse =
    closestTailwindColor.calibratedShade !== null
      ? closestTailwindColor.calibratedShade
      : closestTailwindColor.shade;

  return SHADE_NUMBERS.indexOf(shadeToUse);
}

export function generateColorScaleUsingTailwindOKLCH(inputHex: string) {
    if (chroma.valid(inputHex) === false) {
      throw new Error("Invalid input color");
    }
  
    // Get the closest tailwind color and its scale based on deltaE distance
    // returns object with color, shade, distance, hexcode, calibratedShade
    const closestTailwindColor = getClosestTailwindColor(inputHex, "deltaE");
  
    // Get the closest Tailwind scale based on closestTailwindColor
    const tailwindColorScale = getTailwindColorScaleByName(
      closestTailwindColor?.color
    );
    // If the tailwindColorScale is a string, throw an error
    if (typeof tailwindColorScale === "string") {
      throw new Error(tailwindColorScale);
    }
  
    const inputShadeIndex = findIndexBasedOnOKLCH(inputHex, tailwindColorScale);
  
    // Calculate the delta between input color and the closest tailwind color
    const inputOKLCH = chroma(inputHex).oklch();
    const closestTailwindColorOKLCH = chroma(
      closestTailwindColor?.hexcode
    ).oklch();
  
    const deltaC = inputOKLCH[1] - closestTailwindColorOKLCH[1];
    const deltaH = inputOKLCH[2] - closestTailwindColorOKLCH[2];
  
    // Create empty array of length tailwindColorScale.length
    let scale: string[] = Array(tailwindColorScale.length).fill(null);
  
    scale = scale.map((_, index) => {
      //  Keep the input color at its position, do not modify it
      if (index === inputShadeIndex) return inputHex;
  
      const tailwindIndexColorOKLCH= chroma(tailwindColorScale[index]).oklch();
      // Keep same L value as cloesest tailwind color scale
      const newL = tailwindIndexColorOKLCH[0];
      // Adjust C
      const newC = tailwindIndexColorOKLCH[1] + deltaC;
      // Adjust H
      const newH = tailwindIndexColorOKLCH[2] + deltaH;
      
      return chroma.oklch(newL, newC, newH).hex();
    });
  
    return scale;
  }
  

export function generateColorScaleUsingTailwindOKLAB(inputHex: string) {
  if (chroma.valid(inputHex) === false) {
    throw new Error("Invalid input color");
  }

  // Get the closest tailwind color and its scale based on deltaE distance
  // returns object with color, shade, distance, hexcode, calibratedShade
  const closestTailwindColor = getClosestTailwindColor(inputHex, "deltaE");

  // Get the closest Tailwind scale based on closestTailwindColor
  const tailwindColorScale = getTailwindColorScaleByName(
    closestTailwindColor?.color
  );
  // If the tailwindColorScale is a string, throw an error
  if (typeof tailwindColorScale === "string") {
    throw new Error(tailwindColorScale);
  }

  const inputShadeIndex = findIndexBasedOnOKLAB(inputHex, tailwindColorScale);

  // Calculate the delta between input color and the closest tailwind color
  const inputOKLAB = chroma(inputHex).oklab();
  const closestTailwindColorOKLAB = chroma(
    closestTailwindColor?.hexcode
  ).oklab();

  const deltaA = inputOKLAB[1] - closestTailwindColorOKLAB[1];
  const deltaB = inputOKLAB[2] - closestTailwindColorOKLAB[2];

  // Create empty array of length tailwindColorScale.length
  let scale: string[] = Array(tailwindColorScale.length).fill(null);

  scale = scale.map((_, index) => {
    //  Keep the input color at its position, do not modify it
    if (index === inputShadeIndex) return inputHex;

    const tailwindIndexColorOKLAB = chroma(tailwindColorScale[index]).oklab();
    // Keep same L value as cloesest tailwind color scale
    const newL = tailwindIndexColorOKLAB[0];
    // Adjust A
    const newA = tailwindIndexColorOKLAB[1] + deltaA;
    // Adjust B
    const newB = tailwindIndexColorOKLAB[2] + deltaB;
    
    return chroma.oklab(newL, newA, newB).hex();
  });

  return scale;
}

export function generateColorScaleUsingTailwindLightness(inputHex: string) {
  if (chroma.valid(inputHex) === false) {
    throw new Error("Invalid input color");
  }
  // Get the closest tailwind color and its scale
  const closestTailwindColor = getClosestTailwindColor(inputHex, "deltaE");
  let tailwindColorScale: string[] | string = [];
  if (closestTailwindColor.distance > 110) {
    console.log("Using average of two closest scales");
    tailwindColorScale = getAverageOfTwoClosestTailwindScales(
      inputHex,
      TAILWIND_REFERENCE_COLORS,
      "deltaE"
    );
  } else {
    tailwindColorScale = getTailwindColorScaleByName(
      closestTailwindColor?.color
    );
  }

  if (typeof tailwindColorScale === "string") {
    throw new Error(tailwindColorScale);
  }

  const inputShadeIndex = findIndexBasedOnLightness(
    inputHex,
    tailwindColorScale
  );

  // Create empty array of length tailwindColorScale.length
  let scale: string[] = Array(tailwindColorScale.length).fill(null);

  // Calculate the delta H and S between the input color and the closest tailwind color
  const inputHSL = chroma(inputHex).hsl();

  if (chroma.valid(closestTailwindColor?.hexcode) === false) {
    throw new Error("Invalid closest tailwind color");
  }
  const closestTailwindColorHSL = chroma(closestTailwindColor?.hexcode).hsl();
  const deltaH = inputHSL[0] - closestTailwindColorHSL[0];
  const deltaS = inputHSL[1] - closestTailwindColorHSL[1];

  scale = scale.map((_, index) => {
    //  Keep the input color at its position, do not modify it
    if (index === inputShadeIndex) return inputHex;

    const tailwindHSLatIndex = chroma(tailwindColorScale[index]).hsl();
    // Adjust H by adding the delta H
    const inputH = inputHSL[0];
    const tailwindH_atIndex = tailwindHSLatIndex[0] || 0; // If tailwind hue is 0 chroma returns undefined, so default to 0
    const indexDeltaH = inputH - tailwindH_atIndex;
    let newH;
    if (tailwindH_atIndex === 0 && index < tailwindColorScale.length - 2) {
      const nextH =
        chroma(tailwindColorScale[index + 1]).hsl()[0] ||
        chroma(tailwindColorScale[index + 2]).hsl()[0];
      newH = nextH + deltaH;
    } else {
      newH = (tailwindH_atIndex + deltaH + 360) % 360;
    }

    // Adjust S by adding the delta S (with a minimum of 0.05)
    const indexDeltaS = inputHSL[1] - tailwindHSLatIndex[1];
    const newS = Math.min(
      1,
      Math.max(0.05, tailwindHSLatIndex[1] + indexDeltaS)
    );
    // const newS = Math.min(1, Math.max(0.05, tailwindHSLatIndex[1] + deltaS));
    // Keep L as is
    const newL = tailwindHSLatIndex[2];
    return chroma.hsl(newH, newS, newL).hex();
  });

  return scale;
}

export function generateColorScaleUsingTailwindDelta(
  inputHex: string,
  steps: number = 11
) {
  let scale = Array(steps).fill(null);

  const closestTailwindColor = getClosestTailwindColor(inputHex);
  const tailwindColorScale = getTailwindColorScaleByName(
    closestTailwindColor?.color || ""
  );
  const inputShadeIndex = SHADE_NUMBERS.indexOf(
    closestTailwindColor?.shade || 0
  );

  const inputHSL = chroma(inputHex).hsl();
  const closestTailwindColorHSL = chroma(closestTailwindColor?.hexcode).hsl();
  const deltaH = inputHSL[0] - closestTailwindColorHSL[0];
  const deltaS = inputHSL[1] - closestTailwindColorHSL[1];
  const deltaL = inputHSL[2] - closestTailwindColorHSL[2];

  // First pass: Apply deltas and initial conversion
  scale = scale.map((_, index) => {
    if (index === inputShadeIndex) return chroma(inputHex); // Use Chroma object for consistency

    const tailwindHSLatIndex = chroma(tailwindColorScale[index]).hsl();
    const newH = (tailwindHSLatIndex[0] + deltaH + 360) % 360;
    const newS = Math.min(1, Math.max(0, tailwindHSLatIndex[1] + deltaS));
    const newL = Math.min(0.96, Math.max(0, tailwindHSLatIndex[2] + deltaL));

    return chroma.hsl(newH, newS, newL); // Keep as Chroma object for now
  });

  // Second pass: Check and adjust L values, then convert to HEX
  for (let index = 0; index < scale.length - 1; index++) {
    const currentL = scale[index].get("hsl.l");
    const nextIndex = index + 1 < scale.length ? index + 1 : null;
    const nextNextIndex = index + 2 < scale.length ? index + 2 : null;

    if (nextIndex !== null && nextNextIndex !== null) {
      let nextL = scale[nextIndex].get("hsl.l");
      const nextNextL = scale[nextNextIndex].get("hsl.l");

      if (currentL === nextL) {
        const newNextL = (currentL + nextNextL) / 2;
        scale[nextIndex] = chroma(scale[nextIndex]).set("hsl.l", newNextL); // Update with new L
      }
    }
  }

  // Convert all Chroma objects in the scale to HEX strings
  return scale.map((color) => color.hex());
}

// Generate a color scale from a base color, only by adjusting lightness from a min to max value

export function generateColorScale(inputColor: string) {
  const baseHSL = chroma(inputColor).hsl();
  const lightestL = 95; // Lightest lightness
  const darkestL = 10; // Darkest lightness
  const steps = 11; // Including the base color

  const scale = Array.from({ length: steps }, (_, index) => {
    // Calculate new lightness for each step
    // const stepL = darkestL + (lightestL - darkestL) * (index / (steps - 1));
    const stepL = lightestL - (lightestL - darkestL) * (index / (steps - 1));

    return chroma.hsl(baseHSL[0], baseHSL[1], stepL / 100).hex();
  });

  return scale;
}
