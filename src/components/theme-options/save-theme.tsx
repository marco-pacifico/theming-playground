"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { forwardRef } from "react";

export default function SaveTheme() {
  return (
    <Dialog>
      <footer className="sticky bottom-0 mt-12 flex justify-end bg-white/60 px-8 pb-6 pt-2 backdrop-blur-sm">
        <DialogTrigger asChild>
          <SaveThemeButton />
        </DialogTrigger>
      </footer>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign in</DialogTitle>
          <DialogDescription className="text-lg">
            Sign in to save a theme.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">Sign in options go here...</div>
        {/* <DialogFooter>Dialog Footer</DialogFooter> */}
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
      Save theme
    </button>
  );
});
