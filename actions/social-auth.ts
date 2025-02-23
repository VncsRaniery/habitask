"use server";

import { signIn } from "@/auth";

export async function signInWithGithub() {
  await signIn("github", {
    redirectTo: "/dashboard",
  });
}

export async function signInWithGoogle() {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}