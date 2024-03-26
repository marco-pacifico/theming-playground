import { HEADING_FONT_OPTIONS } from "@/lib/theme-vars";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function HeadingFontRadioGroup({
  font,
  setFont,
}: {
  font: string;
  setFont: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <h2 id="heading-font" className="mb-2 font-semibold text-neutral-800">
        Heading Font Family
      </h2>
      <div
        role="group"
        aria-labelledby="heading-font"
        className="flex flex-wrap gap-4"
      >
        {HEADING_FONT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer flex-col items-center gap-2 text-sm text-neutral-600"
          >
            <input
              className="absolute appearance-none"
              type="radio"
              name="radio"
              value={option.id}
              checked={font === option.id}
              onChange={(event) => setFont(event.target.value)}
            />
            <div
              className={`grid h-14  w-full place-items-center rounded-lg px-6 ${
                font === option.id
                  ? "border  border-neutral-600 bg-neutral-600 text-white"
                  : "border border-neutral-200 transition-colors hover:bg-neutral-100"
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
