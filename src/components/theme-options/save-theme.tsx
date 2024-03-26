import { auth } from "@/auth/auth";
import SaveThemeDialog from "./save-theme-dialog";

export default async function SaveTheme() {
  const session = await auth();
  if (session) {
    return <SaveThemeDialog session={session} />;
  } else {
    return (
      <footer className="sticky bottom-0 mt-12 flex justify-end bg-white/60 px-8 pb-6 pt-2 backdrop-blur-sm">
        <button
          disabled
          className="inline-flex w-full items-center 
justify-center whitespace-nowrap rounded-full border border-neutral-100 bg-neutral-50 px-4 py-3 text-lg font-medium text-neutral-400 shadow-sm cursor-not-allowed"
        >
          Sign in to save theme
        </button>
      </footer>
    );
  }
}
