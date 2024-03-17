"use client";
import { TAILWIND_REFERENCE_COLORS } from "@/CONSTANTS";
import ReferenceColorScales from "@/components/reference-color-scale";
import { useState } from "react";

export default function RadixColors() {
    const [printColorSpace, setPrintColorSpace] = useState<"hsl" | "oklch">("hsl");
    return (
      <>
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
      </>
    );
  }
  