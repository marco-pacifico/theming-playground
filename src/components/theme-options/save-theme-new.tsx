"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createTheme } from "@/lib/actions";
import { Label } from "@radix-ui/react-label";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "../ui/input";

export default function SaveThemeNew({
  brandColor,
  neutralColor,
  radiusMode,
  headingFont,
}: {
  brandColor: string;
  neutralColor: string;
  radiusMode: string;
  headingFont: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <footer className="sticky bottom-0 mt-12 flex justify-end bg-white/60 px-8 pb-6 pt-2 backdrop-blur-sm"> */}
          <SaveThemeButton />
        {/* </footer> */}
      </DialogTrigger>
      <DialogContent className="rounded-2xl bg-neutral-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-neutral-900">
            Save theme
          </DialogTitle>

          <DialogDescription className="text-lg text-neutral-500">
            Save, view, and edit your themes
          </DialogDescription>
        </DialogHeader>
        <form action={createTheme}>
      <div className="flex flex-col gap-4 pt-2 pb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-neutral-900">
            Name theme
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Enter theme name"
            required={true}
          />
        </div>
        <input type="hidden" name="brandColor" value={brandColor}/>
        <input type="hidden" name="neutralColor" value={neutralColor.toLocaleLowerCase()}/>
        <input type="hidden" name="radiusMode" value={radiusMode}/>
        <input type="hidden" name="headingFont" value={headingFont}/>
      </div>
      

      {/* SIGN IN BUTTON */}
      <SaveButton />

      {/* ERROR MESSAGE */}
      {/* {errorMessage && (
      <div
        className="flex pt-6 justify-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-red-600">{errorMessage}</p>
      </div>)} */}

    </form>
        
      </DialogContent>
    </Dialog>
  );
}

const SaveThemeButton = forwardRef<HTMLButtonElement>(function SaveThemeButton(
  { ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      className="inline-flex w-full items-center 
justify-center whitespace-nowrap rounded-full border border-neutral-200 bg-neutral-50 px-4 py-3 text-lg font-medium text-neutral-600 shadow-sm transition-colors hover:bg-neutral-800 hover:text-neutral-50 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
    >
      Save theme new
    </button>
  );
});


function SaveButton() {
    const { pending } = useFormStatus();
    return (
      <button
        aria-disabled={pending}
        disabled={pending}
        className="mt-4 inline-flex w-full items-center 
  justify-center whitespace-nowrap rounded-full  bg-neutral-800 px-4 py-3 text-lg font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-950 hover:text-neutral-50 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? 'Saving...' : 'Save theme'}
  
      </button>
    );
  }
  