import { auth } from "@/auth/auth";
import SignIn from "@/components/auth/sign-in-dialog";
import SignOut from "@/components/auth/sign-out-button";
import Link from "next/link";

export default async function Header() {
  const session = await auth();
  return (
    <header>
      <nav
        className="flex items-center gap-6 border-b border-neutral-200 py-4 pl-6 pr-3"
        aria-label="Global"
      >
        <Link href="/">Create</Link>
        <Link href="/saved">Saved</Link>
        <Link href="/colors">Colors</Link>
        <div className="flex flex-1 justify-end">
          {session ? <SignOut /> : <SignIn />}
        </div>
      </nav>
    </header>
  );
}
