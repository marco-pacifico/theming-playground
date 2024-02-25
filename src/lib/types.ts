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

export type NewColor = {
    closestColor: ClosestColor;
    scale: string[]
}
