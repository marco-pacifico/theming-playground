"use client";
import { RADIX_REFERENCE_COLORS } from "@/CONSTANTS";
import chroma from "chroma-js";
import { useState } from "react";
import {
  generateColor,
  getAPCA,
  getClosestAPCAShade,
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
  const closestAPCA = getClosestAPCAShade(inputColor);
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
                <td>Closest Tailwind</td>
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
                <td>APCA Shade</td>
                <td>{closestAPCA && closestAPCA.shade}</td>
                <td>N/A</td>
                <td>{closestAPCA && closestAPCA.referenceAPCA}</td>
                <td>
                  N/A
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Tailwind Distance:</strong> {closestColor.distance}
          </p>
        </div>
      )}
      <ReferenceColorScales closestColor={closestColor.hueName} referenceColors={RADIX_REFERENCE_COLORS}/>
    </div>
  );
}

export default ColorScaleGenerator;