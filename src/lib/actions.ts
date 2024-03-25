"use server";
import { AuthError } from 'next-auth';
import { signIn } from "../auth/auth";
import prisma from '../../prisma/db';
import { createSlug } from './utils';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// Function to create a theme
// export async function createTheme(prevState: string | undefined,
//   formData: FormData,) {
  
//   const data = Object.fromEntries(formData.entries())
//   const { name, authorId, brandColor, neutralColor, radiusMode, headingFont } = data;

//   const theme = await prisma.theme.create({
//       data: {
//           id,
//           name,
//           authorId,
//           brandColor,
//           neutralColor,
//           radiusMode,
//           headingFont
//           // Add other fields as necessary
//       },
//   });
//   return theme;
// }