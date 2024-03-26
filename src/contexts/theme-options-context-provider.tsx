"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type ThemeOptionsContextType = {
  brandColor: string;
  setBrandColor: (color: string) => void;
  neutralColor: string;
  setNeutralColor: (color: string) => void;
  radiusMode: string;
  setRadiusMode: (mode: string) => void;
  headingFont: string;
  setHeadingFont: (font: string) => void;
};

const ThemeOptionsContext = createContext<ThemeOptionsContextType | undefined>(
  undefined
);

type ThemeOptionsProviderProps = {
  children: ReactNode;
};

export function ThemeOptionsProvider({
  children,

}: ThemeOptionsProviderProps) {
  const [brandColor, setBrandColor] = useState<string>("#a56f8e");
  const [neutralColor, setNeutralColor] = useState<string>("slate");
  const [radiusMode, setRadiusMode] = useState<string>("full");
  const [headingFont, setHeadingFont] = useState<string>("inter");

  return (
    <ThemeOptionsContext.Provider
      value={{
        brandColor,
        setBrandColor,
        neutralColor,
        setNeutralColor,
        radiusMode,
        setRadiusMode,
        headingFont,
        setHeadingFont,
      }}
    >
      {children}
    </ThemeOptionsContext.Provider>
  );
}

export function useThemeOptions() {
  const context = useContext(ThemeOptionsContext);
  if (!context) {
    throw new Error("useThemeOptions must be used within a ThemeOptionsProvider");
  }
  return context;
}