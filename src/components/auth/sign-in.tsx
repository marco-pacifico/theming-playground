"use client";
import SignInForm from "@/components/auth/sign-in-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SignIn() {
  return (
    <Dialog>
      <DialogTrigger asChild>
          <button className="rounded-full bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-950">
            Sign In
          </button>
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
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}
