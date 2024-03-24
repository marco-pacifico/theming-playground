"use client";
import {
  RADIX_REFERENCE_COLORS,
  SHADE_NUMBERS,
  TAILWIND_REFERENCE_COLORS,
} from "@/data/CONSTANTS";
import { capitalizeFirstLetter } from "@/lib/helpers";
import chroma from "chroma-js";
import { useState } from "react";
import {
  generateColor,
  getAPCA,
  printHSL,
  printOKLCH,
} from "../lib/color-utils";
import { NewColor, ReferenceColor } from "../lib/types";
import ButtonToggle from "./theme-options/button-toggle";
import ColorScale from "./color-display/color-scale";
import ReferenceColorScales from "./color-display/reference-color-scale";


export default function ColorPlayground() {
  const [inputColor, setInputColor] = useState<string>("#a56f8e");
  const [referenceColors, setReferenceColors] = useState<ReferenceColor[]>(
    TAILWIND_REFERENCE_COLORS
  );
  const [lockInputColor, setLockInputColor] = useState<boolean>(true);
  const [filterNeutrals, setFilterNeutrals] = useState<boolean>(true);
  const [adjustContrast, setAdjustContrast] = useState<boolean>(true);
  const [printColorSpace, setPrintColorSpace] = useState<"hsl" | "oklch">(
    "hsl"
  );

  const newColor: NewColor = generateColor(
    inputColor,
    referenceColors,
    filterNeutrals,
    lockInputColor,
    adjustContrast
  );
  const closestColor = newColor.closestColor;

  return (
    <div className="pt-4">
      <div className="mt-4 mb-6 flex gap-3">
       {/* Reference colors toggle */}
       <button
         className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
         onClick={() => {
           setReferenceColors(
             referenceColors === TAILWIND_REFERENCE_COLORS
               ? RADIX_REFERENCE_COLORS
               : TAILWIND_REFERENCE_COLORS
           );
         }}
       >
         Using{" "}
         {referenceColors === TAILWIND_REFERENCE_COLORS ? "Tailwind" : "Radix"}
       </button>
       {/* Print Color Space Toggle */}
       <button
         className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
         onClick={() => {
           setPrintColorSpace(printColorSpace === "hsl" ? "oklch" : "hsl");
         }}
       >
         {printColorSpace === "hsl" ? "Displaying HSL" : "Displaying OKLCH"}
       </button>
     </div>
      <label
        htmlFor="color-picker"
        className="mt-4 flex flex-col gap-1 font-semibold text-neutral-800"
      >
        Brand Color
        <input
          type="color"
          value={inputColor}
          onChange={(e) => {
            setInputColor(e.target.value);
          }}
          className="w-10 h-10 border-4 border-[var(--color-brand-950)] rounded-full shadow-sm overflow-hidden"
          style={{ backgroundColor: inputColor }}
        />
      </label>
      <ColorScale
        scale={newColor.scale}
        inputHex={inputColor}
        printColorSpace={printColorSpace}
      />
       
      <div className="mt-6 mb-10 flex justify-center gap-3 flex-wrap">
        {/* Lock Input Color Toggle */}
        <ButtonToggle
          stateValue={lockInputColor}
          setStateValue={setLockInputColor}
        >
          Input Locked
        </ButtonToggle>
        {/* Adjust Contrast Toggle */}
        <ButtonToggle
          stateValue={adjustContrast}
          setStateValue={setAdjustContrast}
        >
          Adjust Contrast
        </ButtonToggle>
        {/* Filter neutrals color toggle */}
        <ButtonToggle
          stateValue={filterNeutrals}
          setStateValue={setFilterNeutrals}
        >
          Neutrals filtered
        </ButtonToggle>
      </div>


        
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Closest Color</h2>
            <table className="w-full">
              <thead className="text-left">
                <tr>
                  <th></th>
                  <th>Color</th>
                  <th>{printColorSpace === "hsl" ? "HSL" : "OKLCH"}</th>
                  <th>APCA</th>
                  <th>Luminance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Input</td>
                  <td>{inputColor.toUpperCase()}</td>
                  <td>
                    {printColorSpace === "hsl"
                      ? printHSL(inputColor)
                      : printOKLCH(inputColor)}
                  </td>
                  <td>{Math.round(+getAPCA(inputColor))}</td>
                  <td>{Math.round(chroma(inputColor).luminance() * 100)}</td>
                </tr>
                <tr>
                  <td>Closest Color</td>
                  <td>
                    {closestColor.hueName} {closestColor.shadeNumber}
                  </td>
                  <td>{printHSL(closestColor.hexcode)}</td>
                  <td>{Math.round(+getAPCA(closestColor.hexcode))}</td>
                  <td>
                    {Math.round(chroma(closestColor.hexcode).luminance() * 100)}
                  </td>
                </tr>
                <tr>
                  <td>Lightness Index</td>
                  <td>{SHADE_NUMBERS[closestColor.inputIndex]}</td>
                  <td>{printHSL(closestColor.indexHexcode)}</td>
                  <td>{Math.round(+getAPCA(closestColor.indexHexcode))}</td>
                  <td>
                    {Math.round(
                      chroma(closestColor.indexHexcode).luminance() * 100
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>Delta E Distance:</strong> {closestColor.distance}
            </p>
            <p><strong>Matching neutral:</strong> {capitalizeFirstLetter(closestColor.matchingNeutral)}</p>

          </div>
          <ReferenceColorScales
            closestColor={closestColor.hueName}
            referenceColors={referenceColors}
            printColorSpace={printColorSpace}
          />
    </div>
  );
}

