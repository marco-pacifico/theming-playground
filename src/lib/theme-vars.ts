import { SHADE_NUMBERS } from "@/CONSTANTS";
import { ClosestColor, ColorSystem } from "./types";


type ColorMap = {
    [type: string]: {
        [role: string]: {
            [prominence: string]: number | string; // For numerical values and special strings   
        }; // For numerical values and special strings
    };
};

type ColorType = "text" | "bg" | "border" | "icon" | "link";
type ColorRole = "neutral" | "brand" | "on-brand" | "accent" | "success" | "warning" | "danger";
type ColorProminence = "primary" | "secondary" | "tertiary" | "hover" | "pressed" | "surface-0" | "surface-1" | "surface-2";

function getThemeColorMap(
  brandInputIndex: number,
  referenceColorSystem: ColorSystem,
  lockInputColor: boolean
): ColorMap {
  const THEME_COLOR_VAR_MAP = {
    tailwind: {
      text: {
        brand: {
          primary: 9,
          secondary: 8,
          hover: 7,
          foreground: 0,
        },
      },
      bg: {
        brand: {
          primary: lockInputColor ? brandInputIndex : 6,
          hover: lockInputColor ? brandInputIndex + 1 : 7,
          pressed: lockInputColor ? brandInputIndex + 2 : 8,
          "surface-0": 0,
          "surface-1": 1,
          "surface-2": 2,
        },
      },
      border: {
        brand: {
          primary: lockInputColor ? brandInputIndex : 6,
          hover: lockInputColor ? brandInputIndex + 1 : 7,
          pressed: lockInputColor ? brandInputIndex + 2 : 8,
          secondary: 2,
          tertiary: 1,
        },
      },
      icon: {
        brand: {
          primary: lockInputColor ? brandInputIndex : 6,
          hover: lockInputColor ? brandInputIndex + 1 : 7,
          pressed: lockInputColor ? brandInputIndex + 2 : 8,
          disabled: 2,
        },
      },
    },
    radix: {
      text: {
        brand: {
          primary: 11,
          secondary: 10,
          hover: 8,
          foreground: 0,
        },
      },
      bg: {
        brand: {
          primary: lockInputColor ? brandInputIndex : 8,
          hover: lockInputColor ? brandInputIndex + 1 : 9,
          pressed: lockInputColor ? brandInputIndex + 2 : 10,
          "surface-0": 0,
          "surface-1": 1,
          "surface-2": 2,
        },
      },
      border: {
        brand: {
          primary: lockInputColor ? brandInputIndex : 8,
          hover: lockInputColor ? brandInputIndex + 1 : 9,
          pressed: lockInputColor ? brandInputIndex + 2 : 10,
          secondary: 7,
          tertiary: 3,
        },
      },
      icon: {
        brand: {
          primary: lockInputColor ? brandInputIndex : 8,
          hover: lockInputColor ? brandInputIndex + 1 : 9,
          pressed: lockInputColor ? brandInputIndex + 2 : 10,
          disabled: 5,
        },
      },
    },
  };
  return THEME_COLOR_VAR_MAP[referenceColorSystem];
}

export function createCSSVariables(
  adjustedScale: string[],
  lockInputColor: boolean,
  closestColor: ClosestColor
) {
  // Clear existing variables
  Array.from(document.documentElement.style).forEach((variable) => {
    document.documentElement.style.removeProperty(variable);
    // }
  });

  // Convert adjusted scale to css variables in root element
  adjustedScale.forEach((shade, index) => {
    // if (lockInputColor && index === closestColor.inputIndex) {
    //   document.documentElement.style.setProperty(`--color-brand-input`, shade);
    // }
    document.documentElement.style.setProperty(
      `--color-brand-${SHADE_NUMBERS[index]}`,
      shade
    );
  });

  // Get color map used generate semantic theme variables names and values
  const THEME_COLOR_VAR_MAP: ColorMap = getThemeColorMap(
    closestColor.inputIndex,
    closestColor.referenceColorSystem,
    lockInputColor
  );

  // Color Type = text, bg, border, icon, link
  for (const colorType in THEME_COLOR_VAR_MAP) {
    // Color Role = neutral, brand, accent, success, warning, danger
    for (const colorRole in THEME_COLOR_VAR_MAP[colorType]) {
      // Color Prominence = primary, secondary, etc..
      for (const colorProminence in THEME_COLOR_VAR_MAP[colorType][colorRole]) {
        let variableName = colorType;
        // Don't add neutral to the variable name
        if (colorRole !== "neutral") {
          variableName += `-${colorRole}`;
        }
        // Don't add primary to the variable name
        if (colorProminence !== "primary") {
          variableName += `-${colorProminence}`;
        }

        // --color-text-brand = var(--color-brand-900);
        // --color-text-on-brand = var(--color-brand-0) || "white";

        // Check if the value is a number or a special string
        const prominenceValue = THEME_COLOR_VAR_MAP[colorType][colorRole][colorProminence];
        let variableValue;
        if (typeof prominenceValue === "number") {
            variableValue = `var(--color-${colorRole}-${SHADE_NUMBERS[prominenceValue]})`;
        } else {
            variableValue = prominenceValue;
        }
        document.documentElement.style.setProperty(
          `--color-${variableName}`,
          variableValue
        );

      }
    }
  }
}
