import { SHADE_NUMBERS } from "@/CONSTANTS";
import { ColorSystem, NewColor, ReferenceColor } from "./types";

type ColorMap = {
  [type: string]: {
    [role: string]: {
      [prominence: string]: number | string; // number is the index of the shade, string is white
    };
  };
};

type RadiusMap = {
  [mode: string]: {
    [size: string]: string;
  };
};

type ColorType = "text" | "bg" | "border" | "icon" | "link";
type ColorRole =
  | "neutral"
  | "brand"
  | "on-brand"
  | "accent"
  | "success"
  | "warning"
  | "danger";
type ColorProminence =
  | "primary"
  | "secondary"
  | "tertiary"
  | "hover"
  | "pressed"
  | "surface-0"
  | "surface-1"
  | "surface-2";

function getThemeColorMap(
  brandInputIndex: number,
  referenceColorSystem: ColorSystem,
  lockInputColor: boolean
): ColorMap {
  const THEME_COLOR_VAR_MAP = {
    tailwind: {
      text: {
        neutral: {
          primary: 8,
          secondary: 5,
          hover: 7,
          foreground: "white",
          disabled: 3,
        },
        brand: {
          primary: 9,
          secondary: 8,
          hover: 7,
          foreground: 0,
        },
      },
      bg: {
        neutral: {
          "surface-0": 0,
          "surface-1": 1,
          "surface-2": 2,
        },
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
        neutral: {
          strong: 6,
          primary: 3,
          secondary: 2,
          tertiary: 1,
        },
        brand: {
          primary: lockInputColor ? brandInputIndex : 6,
          hover: lockInputColor ? brandInputIndex + 1 : 7,
          pressed: lockInputColor ? brandInputIndex + 2 : 8,
          secondary: 2,
          tertiary: 1,
        },
      },
      icon: {
        neutral: {
          primary: 9,
          secondary: 4,
          hover: 7,
          disabled: 3,
        },
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
        neutral: {
          primary: 11,
          secondary: 10,
          hover: 8,
          foreground: 0,
          disabled: 3,
        },
        brand: {
          primary: 11,
          secondary: 10,
          hover: 8,
          foreground: 0,
        },
      },
      bg: {
        neutral: {
          primary: 8,
          "surface-0": 0,
          "surface-1": 1,
          "surface-2": 2,
        },
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
        neutral: {
          primary: 8,
          secondary: 7,
          tertiary: 3,
        },
        brand: {
          primary: lockInputColor ? brandInputIndex : 8,
          hover: lockInputColor ? brandInputIndex + 1 : 9,
          pressed: lockInputColor ? brandInputIndex + 2 : 10,
          secondary: 7,
          tertiary: 3,
        },
      },
      icon: {
        neutral: {
          primary: 8,
          disabled: 3,
        },
        brand: {
          primary: lockInputColor ? brandInputIndex : 8,
          hover: lockInputColor ? brandInputIndex + 1 : 9,
          pressed: lockInputColor ? brandInputIndex + 2 : 10,
          disabled: 3,
        },
      },
    },
  };
  return THEME_COLOR_VAR_MAP[referenceColorSystem];
}

const THEME_RADIUS_VAR_MAP = {
  none: {
    base: "none",
    xs: "none",
    sm: "none",
    md: "none",
    lg: "none",
  },
  small: {
    base: "0.125rem", // 2px or 0.125rem
    xs: "0.125rem", // 2px or 0.125rem
    sm: "0.25rem", // 4px or 0.25rem
    md: "0.5rem", // 8px or 0.5rem
    lg: "1rem", // 16px or 1rem
  },
  medium: {
    base: "0.375rem", // 6px or 0.375rem
    xs: "0.25rem", // 4px or 0.25rem
    sm: "0.5rem", // 8px or 0.5rem
    md: "0.75rem", // 12px or 0.75rem
    lg: "1.25rem", // 20px or 1.25rem
  },
  large: {
    base: "0.5rem", // 0.5rem or 8px
    xs: "0.25rem", // 0.25rem or 4px
    sm: "0.5rem", // 0.5rem or 8px
    md: "1rem", // 1rem or 16px
    lg: "1.5rem", // 24px or 1.5rem
  },
  full: {
    base: "9999px", // 9999px
    xs: "0.25rem", // 0.25rem or 4px
    sm: "0.5rem", // 0.5rem or 8px
    md: "1rem", // 1rem or 16px
    lg: "1.5rem", // 1.5rem or 24px
  },
} as RadiusMap;

export function createRadiusCSSVariables(radiusMode: string) {
  const radiusValues = THEME_RADIUS_VAR_MAP[radiusMode];

  for (const radiusSizeKey in radiusValues) {
    // Don't add base to the variable name
    if (radiusSizeKey === "base") {
      document.documentElement.style.setProperty(
        `--radius`,
        radiusValues[radiusSizeKey]
      );
    }

    document.documentElement.style.setProperty(
      `--radius-${radiusSizeKey}`,
      radiusValues[radiusSizeKey]
    );
  }
}

export function createNeutralCSSVariables(
  neutral: string,
  referenceColors: ReferenceColor[]
) {
  // Get array of hex codes from the reference color system that matches the neutral color
  const neutrals = referenceColors
    .find((color) => color.id === neutral)
    ?.shades.map((shade) => shade.hexcode);
  if (!neutrals) {
    console.error("Neutral color not found");
    return;
  }

  // Convert adjusted scale to css variables in root element
  neutrals.forEach((shade, index) => {
    document.documentElement.style.setProperty(
      `--color-neutral-${SHADE_NUMBERS[index]}`,
      shade
    );
  });
}

export function createCSSVariables(
  newColor: NewColor,
  lockInputColor: boolean
) {
  // adjustedScale: string[],
  // lockInputColor: boolean,
  // closestColor: ClosestColor

  // Clear existing variables
  // Array.from(document.documentElement.style).forEach((variable) => {
  //   document.documentElement.style.removeProperty(variable);
  //   // }
  // });

  // Convert adjusted scale to css variables in root element
  newColor.scale.forEach((shade, index) => {
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
    newColor.closestColor.inputIndex,
    newColor.closestColor.referenceColorSystem,
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

        // Check if the value is a number or a special string
        const prominenceValue =
          THEME_COLOR_VAR_MAP[colorType][colorRole][colorProminence];
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
