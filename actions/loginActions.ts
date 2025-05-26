"use server";

import { signIn } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import {User} from "@/models/User";
import { compare } from "bcryptjs";

export const submitLoginForm = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return "Please provide both email and password";
  }

  await connectMongoDB();
  const user = await User.findOne({ email }).select("+password");

  if (!user) return "Account doesn't exist";

  const isMatched = await compare(password, user.password);

  if (!isMatched) {
    return "Password is incorrect ";
  }

  await signIn("credentials", {
    redirect: false,
    callbackUrl: "/dashboard",
    email,
    password,
  });

  return "";
};
