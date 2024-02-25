"use client";
import { SHADE_NUMBERS, TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import chroma from "chroma-js";
import { useState } from "react";
import {
  generateColor,
  getAPCA,
  printHSL
} from "../lib/color-utils";
import { NewColor } from "../lib/types";
import ColorScale from "./color-scale";
import ReferenceColorScales from "./reference-color-scale";

function ColorScaleGenerator() {
  const [inputColor, setInputColor] = useState<string>("#a56f8e");
  const [newColor, setNewColor] = useState<NewColor>(
    generateColor(inputColor)
  );
  const closestColor = newColor.closestColor;

  return (
    <div className="pt-4 w-full">
      <input
        type="color"
        value={inputColor}
        onChange={(e) => {
          setInputColor(e.target.value);
          setNewColor(generateColor(
            e.target.value
          ));
        }}
        className="w-20 h-10 border-2 border-gray-300 rounded-md shadow-sm"
      />
      <ColorScale scale={newColor.scale} inputHex={inputColor}/>
      {closestColor && (
        <div className="mt-4 flex flex-col gap-4">
          <table className="w-full">
            <thead className="text-left">
              <tr>
                <th>Source</th>
                <th>Color</th>
                <th>HSL</th>
                <th>APCA</th>
                <th>Luminance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Input</td>
                <td>{inputColor}</td>
                <td>{printHSL(inputColor)}</td>
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
                <td>
                  {SHADE_NUMBERS[closestColor.inputIndex]}
                </td>
                <td>{printHSL(closestColor.indexHexcode)}</td>
                <td>{Math.round(+getAPCA(closestColor.indexHexcode))}</td>
                <td>
                  {Math.round(chroma(closestColor.indexHexcode).luminance() * 100)}
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Delta E Distance:</strong> {closestColor.distance}
          </p>
        </div>
      )}
      <ReferenceColorScales closestColor={closestColor.hueName} referenceColors={TAILWIND_REFERENCE_COLORS}/>
    </div>
  );
}

export default ColorScaleGenerator;