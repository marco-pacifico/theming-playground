"use client";
import {
  RADIX_REFERENCE_COLORS,
  SHADE_NUMBERS,
  TAILWIND_REFERENCE_COLORS,
} from "@/CONSTANTS";
import chroma from "chroma-js";
import { useEffect, useState } from "react";
import {
  generateColor,
  getAPCA,
  printHSL,
  printOKLCH,
} from "../lib/color-utils";
import { NewColor, ReferenceColor } from "../lib/types";
import BuyBoxTailwind from "./buy-box-tailwind";
import ColorScale from "./color-scale";
import HeroSectionTailwind from "./hero-section-tailwind";
import ReferenceColorScales from "./reference-color-scale";
import ShoppingCartTailwind from "./shopping-cart-tailwind";

function ColorScaleGenerator() {
  const [inputColor, setInputColor] = useState<string>("#a56f8e");
  const [referenceColors, setReferenceColors] = useState<ReferenceColor[]>(
    TAILWIND_REFERENCE_COLORS
  );
  const [lockInputColor, setLockInputColor] = useState<boolean>(true);
  const [filterNeutrals, setFilterNeutrals] = useState<boolean>(true);
  const [showClosestColor, setShowClosestColor] = useState<boolean>(true);
  const [adjustContrast, setAdjustContrast] = useState<boolean>(true);
  const [printColorSpace, setPrintColorSpace] = useState<"hsl" | "oklch">(
    "hsl"
  );
  const [newColor, setNewColor] = useState<NewColor>(
    generateColor(
      inputColor,
      referenceColors,
      filterNeutrals,
      lockInputColor,
      adjustContrast
    )
  );
  const closestColor = newColor.closestColor;

  // Watch for changes in input color, reference colors, and filterNeutrals
  useEffect(() => {
    setNewColor(
      generateColor(
        inputColor,
        referenceColors,
        filterNeutrals,
        lockInputColor,
        adjustContrast
      )
    );
  }, [
    inputColor,
    referenceColors,
    filterNeutrals,
    lockInputColor,
    adjustContrast,
  ]);

  return (
    <div className="pt-4 w-full lg:max-w-7xl lg:px-8">
      <input
        type="color"
        value={inputColor}
        onChange={(e) => {
          const newHex = e.target.value;
          setInputColor(newHex);
        }}
        className="w-20 h-10 border-2 border-gray-300 rounded-md shadow-sm"
      />
      <ColorScale
        scale={newColor.scale}
        inputHex={inputColor}
        printColorSpace={printColorSpace}
      />
      <div className="my-10 flex justify-center gap-3 flex-wrap">
        {/* Show closest color toggle */}
        <button
          className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
          onClick={() => {
            setShowClosestColor(!showClosestColor);
          }}
        >
          {showClosestColor ? "Hide" : "Show"} Closest Color
        </button>
        {/* Filter neutrals color toggle */}
        <button
          className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
          onClick={() => {
            setFilterNeutrals(!filterNeutrals);
          }}
        >
          Neutrals {filterNeutrals ? "Filtered" : "Included"}
        </button>
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
        {/* Lock Input Color Toggle */}
        <button
          className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
          onClick={() => {
            setLockInputColor(!lockInputColor);
          }}
        >
          Input Color {lockInputColor ? "Locked" : "Unlocked"}
        </button>
        {/* Adjust Contrast Toggle */}
        <button
          className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
          onClick={() => {
            setAdjustContrast(!adjustContrast);
          }}
        >
          Contrast {adjustContrast ? "Adjusted" : "Not Adjusted"}
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
      {showClosestColor && closestColor && (
        <>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Closest Color Information</h2>
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
          </div>
          <ReferenceColorScales
            closestColor={closestColor.hueName}
            referenceColors={referenceColors}
            printColorSpace={printColorSpace}
          />
        </>
      )}
      <div className="mt-16">
        <h2 className="mb-8 text-xl font-semibold">Sample UI</h2>
        <HeroSectionTailwind />
        <BuyBoxTailwind />
        <ShoppingCartTailwind />
      </div>
    </div>
  );
}

export default ColorScaleGenerator;
