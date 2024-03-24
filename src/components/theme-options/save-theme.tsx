import SaveThemeForm from "./save-theme-form";
import { auth } from "@/auth/auth";

export default async function SaveTheme() {
  const session = await auth();
  return (
    <SaveThemeForm session={session} />
  );
}

