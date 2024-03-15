export default function SmallColorScale({
  inputHex,
  scale,
}: {
  inputHex: string;
  scale: string[];
}) {
  return (
    <div className="flex mt-4 space-x-1 w-full">
      {scale.map((color, index) => (
        <div
          key={index}
          className={`w-full h-16 rounded shadow ${
            color === inputHex ? "ring-[6px] ring-[rgb(var(--foreground-rgb))] z-10" : ""
          }`}
          style={{ backgroundColor: color }}
          title={`Color ${index}: ${color}`}
        ></div>
      ))}
    </div>
  );
}
