import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // callbacks: {
  //   authorized({ auth }) {
  //     const isLoggedIn = !!auth?.user;
  //     if (isLoggedIn) return true
  //     else return false;
  //   },
  // },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
