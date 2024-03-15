type RadioInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title: string;
  options: string[];
  stateValue: string;
  setStateValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function Radio({
  title,
  options,
  stateValue,
  setStateValue,
  ...rest
}: RadioInputProps) {
  const id = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <p id={id} className="font-semibold text-neutral-800 mt-4 mb-2">
        {title}
      </p>
      <div role="group" aria-labelledby={id}>
        {options.map((option) => (
          <label key={option} className="flex items-center">
            <input
              {...rest}
              type="radio"
              className="mr-2"
              name="radio"
              value={option}
              checked={stateValue === option}
              onChange={(event) => setStateValue(event.target.value)}
            />
            {option}
          </label>
        ))}
      </div>
    </>
  );
}
