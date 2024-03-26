import { useState } from "react";
import SmallColorScale from "../color-display/small-color-scale";
import ButtonToggle from "./button-toggle";

export default function BrandColorSelection({
  brandColor,
  setBrandColor,
  lockInputColor,
  setLockInputColor,
  filterNeutrals,
  setFilterNeutrals,
  adjustContrast,
  setAdjustContrast,
  scale,
}: {
  brandColor: string;
  setBrandColor: React.Dispatch<React.SetStateAction<string>>;
  lockInputColor: boolean;
  setLockInputColor: React.Dispatch<React.SetStateAction<boolean>>;
  filterNeutrals: boolean;
  setFilterNeutrals: React.Dispatch<React.SetStateAction<boolean>>;
  adjustContrast: boolean;
  setAdjustContrast: React.Dispatch<React.SetStateAction<boolean>>;
  scale: string[];
}) {
  const [showBrandOptions, setShowBrandOptions] = useState<boolean>(true);

  return (
    <div>
      <h2 id="brand-color" className="mb-2 font-semibold text-neutral-800">
        Brand Color
      </h2>
      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-4 text-sm text-neutral-600">
          <input
            className="h-[60px] w-[60px] cursor-pointer overflow-hidden rounded-full border-[6px] border-neutral-950/30 transition-colors hover:border-neutral-950/40"
            style={{ background: brandColor }}
            type="color"
            name="brandColor"
            value={brandColor}
            onChange={(event) => setBrandColor(event.target.value)}
          />
        </label>
        <p className="text-sm text-neutral-600">
          {brandColor.toLocaleUpperCase()}
        </p>
        <button
          onClick={() => setShowBrandOptions(!showBrandOptions)}
          className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          {showBrandOptions ? "Hide" : "Show"} Options
        </button>
      </div>
      {showBrandOptions && (
        <>
          <SmallColorScale inputHex={brandColor} scale={scale} />
          <div className="mt-6 flex flex-wrap justify-center gap-2">
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
        </>
      )}
    </div>
  );
}
