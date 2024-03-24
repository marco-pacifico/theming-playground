import { auth } from "../../auth/auth";
import Link from "next/link";

export default async function TopNav() {
  const session = await auth();
  return (
    <header>
      <nav
        className="flex items-start gap-4 border-b border-neutral-200 p-6 lg:px-8"
        aria-label="Global"
      >
        <Link href="/">Theming</Link>
        <Link href="/colors">Colors</Link>
      </nav>
      <div className="flex w-full justify-end">
        <p className="text-sm text-neutral-500">
          {session ? " Logged in" : "Logged out"}
        </p>
      </div>
    </header>
  );
}
