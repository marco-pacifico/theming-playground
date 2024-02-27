import { SHADE_NUMBERS } from "@/CONSTANTS";
import { getAPCA, printHSL } from "@/lib/color-utils";
import chroma from "chroma-js";

type ColorScaleProps = {
  scale: string[];
  inputHex?: string; // Added prop for the inputHex to compare with
};

export default function ColorScale({ scale, inputHex }: ColorScaleProps) {
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
          <p className="text-xs mt-4 w-2">{color}</p>
          <p className="mt-3 w-2">{SHADE_NUMBERS[index]}</p>
          <p className="mt-3 w-2">C{Math.round(+getAPCA(color)*10)}</p>
          <p className="mt-3 w-2">{printHSL(color)}</p>
          <p className="mt-3 w-2">
            Lm{Math.round(chroma(color).luminance() * 100)}
          </p>
        </div>
      ))}
    </div>
  );
}
