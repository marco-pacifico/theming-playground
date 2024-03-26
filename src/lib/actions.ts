"use server";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../prisma/db";
import { signIn } from "../auth/auth";
import { createSlug } from "./utils";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// Function to create a theme
export async function createTheme(
  // prevState: string | undefined,
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const brandColor = formData.get("brandColor") as string;
  const neutralColor = formData.get("neutralColor") as string;
  const radiusMode = formData.get("radiusMode") as string;
  const headingFont = formData.get("headingFont") as string;
  const id = createSlug(name);

  try {
    await prisma.theme.create({
      data: {
        id,
        name,
        authorId: 1,
        brandColor,
        neutralColor,
        radiusMode,
        headingFont,
      },
    });
    revalidatePath(`/saved/${id}`);
    redirect(`/saved/${id}`);
  } catch (error) {
    throw error;
  }
}

export default async function deleteTheme(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await prisma.theme.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/saved`);
    redirect(`/saved`);
  } catch (error) {
    throw error;
  }
}
