import SignIn from "@/components/auth/sign-in-button";
import SignOut from "@/components/auth/sign-out-button";
import Link from "next/link";
import { auth } from "@/auth/auth";

export default async function TopNav() {
  const session = await auth();
  return (
    <header>
      <nav
        className="flex items-center gap-4 border-b border-neutral-200 py-4 pl-6 pr-3 lg:px-8"
        aria-label="Global"
      >
        <Link href="/">Theming</Link>
        <Link href="/colors">Colors</Link>
        <div className="flex w-full justify-end">
          {session ? <SignOut /> : <SignIn />}
        </div>
      </nav>
    </header>
  );
}
