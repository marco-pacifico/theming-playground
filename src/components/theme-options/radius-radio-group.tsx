import { capitalizeFirstLetter } from "@/lib/utils";

export default function RadiusRadioGroup({
  radius,
  setRadius,
}: {
  radius: string;
  setRadius: React.Dispatch<React.SetStateAction<string>>
}) {
  const RADIUS_OPTIONS = [
    { id: "none", specimenSize: 0 },
    { id: "small", specimenSize: 6 },
    { id: "medium", specimenSize: 12 },
    { id: "large", specimenSize: 16 },
    { id: "full", specimenSize: 9999 },
  ];
  return (
    <div>
      <h2 id="corner-radius" className="mb-2 font-semibold text-neutral-800">
        Corner Radius
      </h2>
      <div
        role="group"
        aria-labelledby="corner-radius"
        className="flex flex-wrap gap-4"
      >
        {RADIUS_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer flex-col items-center gap-2 text-sm text-neutral-600"
          >
            <input
              className="absolute appearance-none"
              type="radio"
              name="radio"
              value={option.id}
              checked={radius === option.id}
              onChange={(event) => setRadius(event.target.value)}
            />
            <div
              className={`h-16 w-16 bg-neutral-100 ${
                radius === option.id
                  ? "scale-110 border-4 border-neutral-950/70"
                  : "border-2 border-neutral-950/30 transition-transform hover:-translate-y-1"
              }`}
              style={{ borderRadius: option.specimenSize }}
            ></div>
            {capitalizeFirstLetter(option.id)}
          </label>
        ))}
      </div>
    </div>
  );
}
