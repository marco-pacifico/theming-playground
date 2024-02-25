export type ReferenceColor = {
  name: string;
  id: string;
  isNeutral: boolean;
  shades: ShadeObject[];
};

export type ShadeObject = {
  number: number;
  hexcode: string;
};

export type ClosestColor = {
  hueName: string;
  shadeNumber: number;
  hexcode: string;
  scale: ShadeObject[];
  distance: number;
  inputIndex: number;
  indexHexcode: string;
};

export type DistanceCalculationMethod = "deltaE" | "SumHSL" | "SumOKLAB" | "SumOKLCH";

export type ColorSpace = "HSL" | "OKLAB" | "OKLCH"; // For determining which color space to use for lightness calculations
// This doesn't actually make a difference, index is always the same no matter the color space

export type NewColor = {
    closestColor: ClosestColor;
    scale: string[]
}
