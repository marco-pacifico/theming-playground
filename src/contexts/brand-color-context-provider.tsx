import { createContext, ReactNode, useContext, useState } from "react";

type BrandColorContextValueType = {
  brandColor: string;
  setBrandColor: (color: string) => void;
};