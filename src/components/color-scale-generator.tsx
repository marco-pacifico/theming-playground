"use client";
import chroma from "chroma-js";
import { useState } from "react";
import {
    generateColorScaleUsingTailwindLightness,
    getAPCA,
    getClosestAPCAShade,
    getClosestTailwindColor,
    printHSL,
} from "../lib/color-utils";
import ColorScale from "./color-scale";
import TailwindColorScales from "./tailwind-color-scale";

function ColorScaleGenerator() {
  const [inputColor, setInputColor] = useState<string>("#ff8647");
  const [colorScale, setColorScale] = useState<string[]>(
    generateColorScaleUsingTailwindLightness(inputColor)
  );
  const closestColor = getClosestTailwindColor(inputColor, "deltaE");
  const closestAPCA = getClosestAPCAShade(inputColor);
  return (
    <div className="pt-4 w-full">
      <input
        type="color"
        value={inputColor}
        onChange={(e) => {
          setInputColor(e.target.value);
          const newScale = generateColorScaleUsingTailwindLightness(
            e.target.value
          );
          setColorScale(newScale);
        }}
        className="w-20 h-10 border-2 border-gray-300 rounded-md shadow-sm"
      />
      <ColorScale colorScale={colorScale} inputHex={inputColor}/>
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
                <td>Tailwind</td>
                <td>
                  {closestColor.color} {closestColor.shade}
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
      <TailwindColorScales closestColor={closestColor.color} />
    </div>
  );
}

export default ColorScaleGenerator;

// const generateColorScale = (baseHex: string): void => {
//     const targetContrast = 50; // Example target contrast value
//     let scale: string[] = [baseHex]; // Initialize scale with base color

//     const hue = chroma(baseHex).get('hsl.h');
//     const saturation = chroma(baseHex).get('hsl.s');
//     let lightness = chroma(baseHex).get('hsl.l');

//     // Adjust lightness up and down to generate colors
//     for (let step = 1; step <= 10; step++) {
//       let adjustedLightnessUp = lightness + step * 0.05; // Lighten
//       let adjustedLightnessDown = lightness - step * 0.05; // Darken

//       // Ensure lightness is within [0, 1]
//       adjustedLightnessUp = Math.min(1, adjustedLightnessUp);
//       adjustedLightnessDown = Math.max(0, adjustedLightnessDown);

//       // Generate colors with adjusted lightness
//       const colorUp = chroma.hsl(hue, saturation, adjustedLightnessUp).hex();
//       const colorDown = chroma.hsl(hue, saturation, adjustedLightnessDown).hex();

//       // Add to scale if they meet some APCA contrast criteria (placeholder logic)
//       if (calculateAPCAContrast(colorUp, baseHex) >= targetContrast) {
//         scale.push(colorUp);
//       }
//       if (calculateAPCAContrast(colorDown, baseHex) >= targetContrast) {
//         scale.unshift(colorDown); // Add darker colors to the beginning
//       }
//     }

// import React, { useState } from "react";
// import chroma from "chroma-js";

// const ColorScaleGenerator: React.FC = () => {
//     const [baseColor, setBaseColor] = useState<string>('#ff8647');
//     const [colorScale, setColorScale] = useState<string[]>([]);

//     const generateColorScale = (hex: string): void => {
//       const baseHSL = chroma(hex).hsl();
//       const lightestL = 95; // Lightest lightness
//       const darkestL = 10; // Darkest lightness
//       const steps = 11; // Including the base color

//       const scale = Array.from({ length: steps }, (_, index) => {
//         // Calculate new lightness for each step
//         const stepL = darkestL + (lightestL - darkestL) * (index / (steps - 1));
//         return chroma.hsl(baseHSL[0], baseHSL[1], stepL / 100).hex();
//       });

//       setColorScale(scale);
//   };

//   const handleColorChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ): void => {
//     const newColor: string = event.target.value;
//     setBaseColor(newColor);
//     generateColorScale(newColor);
//   };

//   return (
//     <div className="p-4">
//       <input
//         type="color"
//         value={baseColor}
//         onChange={handleColorChange}
//         className="w-20 h-10 border-2 border-gray-300 rounded-md"
//       />
//       <div className="flex mt-4 space-x-2">
//         {colorScale.map((color, index) => (
//           <div
//             key={index}
//             className="w-10 h-10 rounded shadow"
//             style={{ backgroundColor: color }}
//           ></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ColorScaleGenerator;
