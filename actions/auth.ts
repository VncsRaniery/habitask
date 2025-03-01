"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import {
  SignInSchema,
  SignInSchemaType,
  SignUpSchema,
  SignUpSchemaType,
} from "@/schemas";
import { db } from "@/lib/db";

export const userSignIn = async (data: SignInSchemaType) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const validatedFields = SignInSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.message,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.cause?.err?.message || "Ocorreu um erro",
      };
    }

    throw error;
  }
};

export const userSingUp = async (data: SignUpSchemaType) => {
  const validatedFields = SignUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.message,
    };
  }

  const { name, email, password } = validatedFields.data;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return {
      error: "O usuário já existe",
    };
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  await userSignIn({
    email,
    password,
  });
};
