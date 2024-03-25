"use client";
import SaveThemeForm from "@/components/forms/save-theme-form";
import SignInForm from "@/components/forms/sign-in-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Session } from "next-auth";
import { forwardRef } from "react";

export default function SaveThemeDialog({
  session,
}: {
  session: Session | null;
}) {
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
            {session ? "Save theme" : "Sign in"}
          </DialogTitle>

          <DialogDescription className="text-lg text-neutral-500">
            {session
              ? "Name your theme to save it"
              : "Save, view, and edit your themes"}
          </DialogDescription>
        </DialogHeader>
        {session ? <SaveThemeForm /> : <SignInForm />}
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
