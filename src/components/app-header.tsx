import SignIn from "@/components/auth/sign-in";
import SignOut from "@/components/auth/sign-out";
import Link from "next/link";
import { auth } from "@/auth/auth";

export default async function Header() {
  const session = await auth();
  return (
    <header>
      <nav
        className="flex items-center gap-4 border-b border-neutral-200 py-4 pl-6 pr-3 lg:px-8"
        aria-label="Global"
      >
        <Link href="/">Create</Link>
        <Link href="/saved-themes">Saved Themes</Link>
        <Link href="/colors">Colors</Link>
        <div className="flex flex-1 justify-end">
          {session ? <SignOut /> : <SignIn />}
        </div>
      </nav>
    </header>
  );
}
