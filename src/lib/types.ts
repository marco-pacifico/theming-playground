export type ReferenceColorScale = {
  name: string;
  id: string;
  shades: Shade[];
};

export type Shade = {
  number: number;
  hexcode: string;
};

export type ClosestColor = {
  hueName: string;
  shadeNumber: number;
  hexcode: string;
  colorRamp: Shade[];
  distance: number;
};

export type DistanceCalculationMethod = "HSL" | "deltaE";

export type ColorSpace = "HSL" | "OKLAB" | "OKLCH";
