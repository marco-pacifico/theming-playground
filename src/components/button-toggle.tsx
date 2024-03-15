import React from "react";

// Using `type` for props definition
type ButtonToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  stateValue: boolean;
  setStateValue: React.Dispatch<React.SetStateAction<boolean>>;
};

function ButtonToggle({
  stateValue,
  setStateValue,
  onClick,
  children,
  ...rest
}: ButtonToggleProps) {
  // Updated handleToggle function
  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStateValue(!stateValue);
    // Now passing the event to the original onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-full border border-transparent text-sm ${
        stateValue
          ? "bg-neutral-600 text-white"
          : "bg-white text-neutral-600 border-neutral-200 border"
      }`}
      onClick={handleToggle}
    >
      {children || "Toggle Button"}
    </button>
  );
}

export default ButtonToggle;
