import { capitalizeFirstLetter } from "@/lib/helpers";
import { createHeadingFontVariables } from "@/lib/theme-vars";
import { useEffect, useState } from "react";

export default function HeadingFontRadioGroup() {
  const FONT_OPTIONS = [
    { id: "inter", varName: "var(--font-inter)" },
    { id: "Roobert", varName: "var(--font-roobert)" },
    { id: "Playfair", varName: "var(--font-playfair)" },
    { id: "louize", varName: "var(--font-louize)" },
    { id: "space Mono", varName: "var(--font-space-mono)" },
  ];
  const [font, setFont] = useState<string>("inter");

  useEffect(() => {
    const varName =
      FONT_OPTIONS.find((option) => option.id === font)?.varName ||
      FONT_OPTIONS[0].varName;
    // CREATE CSS VARIABLES FOR THE RADIUS
    createHeadingFontVariables(varName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [font]);

  return (
    <div>
      <h2 id="heading-font" className="font-semibold text-neutral-800 mb-2">
        Heading Font Family
      </h2>
      <div
        role="group"
        aria-labelledby="heading-font"
        className="flex gap-4 flex-wrap"
      >
        {FONT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex flex-col items-center gap-2 text-sm text-neutral-600 cursor-pointer"
          >
            <input
              className="appearance-none absolute"
              type="radio"
              name="radio"
              value={option.id}
              checked={font === option.id}
              onChange={(event) => setFont(event.target.value)}
            />
            <div
              className={`w-full h-14  px-6 rounded-lg grid place-items-center ${
                font === option.id
                  ? "border-neutral-600  border bg-neutral-600 text-white"
                  : "border-neutral-200 border hover:bg-neutral-100 transition-colors"
              }`}
              style={{ fontFamily: option.varName }}
            >
              <p className="text-2xl" style={{ fontFamily: option.varName }}>
                {capitalizeFirstLetter(option.id)}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
