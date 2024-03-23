"use client";
import { TAILWIND_REFERENCE_COLORS } from "@/data/CONSTANTS";
import ReferenceColorScales from "@/components/color-display/reference-color-scale";
import { useState } from "react";

export default function RadixColors() {
    const [printColorSpace, setPrintColorSpace] = useState<"hsl" | "oklch">("hsl");
    return (
      <main className="my-12 px-4 md:px-8 lg:max-w-7xl lg:px-8 mx-auto">
        <h1 className="text-4xl font-bold mb-20">Tailwind Colors</h1>
        <button
          className="px-4 py-2 bg-slate-100 rounded-full shadow-sm text-gray-950"
          onClick={() => {
            setPrintColorSpace(printColorSpace === "hsl" ? "oklch" : "hsl");
          }}
        >
          {printColorSpace === "hsl" ? "Displaying HSL" : "Displaying OKLCH"}
        </button>

        <ReferenceColorScales referenceColors={TAILWIND_REFERENCE_COLORS} printColorSpace={printColorSpace}/>
      </main>
    );
  }
  