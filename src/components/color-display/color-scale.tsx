import { SHADE_NUMBERS } from "@/data/CONSTANTS";
import { getAPCA, printHSL, printOKLCH } from "@/lib/color-utils";
import chroma from "chroma-js";

type ColorScaleProps = {
  scale: string[];
  inputHex?: string; // Added prop for the inputHex to compare with
  printColorSpace?: "hsl" | "oklch"
};

export default function ColorScale({ scale, inputHex, printColorSpace = "hsl" }: ColorScaleProps) {
  return (
    <div className="flex mt-4 space-x-2 w-full">
      {scale.map((color, index) => (
        <div key={index} className="flex flex-col flex-1">
          <div
            className={`w-full h-36 rounded shadow ${
              color === inputHex ? "ring-8 ring-[rgb(var(--foreground-rgb))]" : ""
            }`}
            style={{ backgroundColor: color }}
            title={`Color ${index}: ${color}`}
          ></div>
          <p className="hidden md:inline md:text-xs mt-4 w-2">{color.toUpperCase()}</p>
          <p className="text-xs md:text-base  mt-3 w-2">{SHADE_NUMBERS[index]}</p>
          <p className="hidden md:inline  mt-3 w-2">C{Math.round(+getAPCA(color)*10)}</p>
          <p className="hidden md:inline  w-2">
            L{Math.round(chroma(color).luminance() * 100)}
          </p>
          <p className="hidden md:inline md:text-base mt-3 w-2 ">{printColorSpace === "hsl" ? printHSL(color) : printOKLCH(color)}</p>
        </div>
      ))}
    </div>
  );
}
