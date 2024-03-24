'use client';
// import { authenticate } from "@/lib/actions";
import { Label } from "@radix-ui/react-label";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "../ui/input";

export default function SaveThemeForm() {
  // const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    // action={dispatch}
    <form >
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
  );
}

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
