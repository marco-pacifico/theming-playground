import bcrypt from "bcrypt";
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '../../prisma/db';

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    // If needed, transform the user object here to match the NextAuth User type
    if (user) {
      return {
        ...user,
        id: user.id.toString(), // Assuming you need to convert id to string to match the NextAuth User type
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  // ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            // Ensure the returned object matches the expected User type
            return {
              id: user.id, // Ensure this is a string if that's what your User type expects
              email: user.email,
              name: user.name,
              // You might not want to include the password in the returned user object for security reasons
            };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
