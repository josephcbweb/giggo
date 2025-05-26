"use server";

import { hash } from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import {User} from "@/models/User";
import { signIn } from "@/auth";

interface signUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const submitSignupForm = async (formData: signUpData) => {
  const name = formData.name as string;
  const password = formData.password as string;
  const confirmPassword = formData.confirmPassword as string;
  const email = formData.email as string;
  await connectMongoDB();
  const existingUser = await User.findOne({ email });

  if (password !== confirmPassword) {
    return "Passwords don't match";
  }
  if (existingUser) return "Account already exists";

  if (!password) return "Password is required";
  const hashedPassword = await hash(password, 12);

  await User.create({ name, email, password: hashedPassword });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
};

export { submitSignupForm };
