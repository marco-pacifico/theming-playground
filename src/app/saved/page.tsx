import { auth } from "@/auth/auth";
import SavedThemes from "./saved-thems";

export default async function SavedThemesPage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col-reverse md:flex-row">
      {session ? (
        <SavedThemes />
      ) : (
        <div className="w-full px-6 py-80">
          <p className="text-center text-lg text-neutral-500">Sign in to view saved themes</p>
        </div>
      )}
    </main>
  );
}
