import { signOut } from "@/auth/auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="rounded-full bg-white px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
      >
        Sign out
      </button>
    </form>
  );
}
