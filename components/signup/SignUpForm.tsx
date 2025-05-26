"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { submitSignupForm } from "@/actions/signInActions";
import { redirect } from "next/navigation";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const errorMessage = await submitSignupForm({
      name,
      email,
      password,
      confirmPassword,
    });
    if (errorMessage) {
      setError(errorMessage);
      setIsLoading(false);
    } else {
      redirect("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Mary Jane"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              name="name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="lakshmi@gmail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="*********"
              name="password"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Confirm Password</Label>
            </div>
            <Input
              id="confirmPassword"
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="*********"
              name="confirmPassword"
            />
          </div>
          <Button
            type="submit"
            className="w-full hover:scale-105 transition-transform"
          >
            {isLoading ? "Signing Up" : "Sign Up"}
          </Button>
        </div>
        {error && (
          <p className="text-center bg-red-500 text-white text-sm p-1 rounded-md ">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
