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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SaveTheme() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form submitted");
    alert("Form submitted");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <footer className="sticky bottom-0 mt-12 flex justify-end bg-white/60 px-8 pb-6 pt-2 backdrop-blur-sm">
          <SaveThemeButton />
        </footer>
      </DialogTrigger>

      <DialogContent className="rounded-2xl bg-neutral-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-neutral-900">
            Sign in
          </DialogTitle>
          <DialogDescription className="text-lg text-neutral-500">
            Save, view, and edit your themes
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-neutral-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-neutral-900">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center 
justify-center whitespace-nowrap rounded-full  bg-neutral-800 px-4 py-3 text-lg font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-950 hover:text-neutral-50 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            Sign in
          </button>
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
      Save theme
    </button>
  );
});
