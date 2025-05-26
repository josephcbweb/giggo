import React from "react";
import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "@/auth";

const SignInButtons = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[350px] mx-auto">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
        className="w-full"
      >
        <Button
          variant="outline"
          className="w-full py-6 px-4 border border-gray-300 hover:bg-gray-50 transition-colors rounded-3xl flex items-center justify-center gap-3"
        >
          <FaGoogle className="w-5 h-5 text-black" />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </Button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
        className="w-full"
      >
        <Button
          variant="outline"
          className="w-full py-6 px-4 border border-gray-300 hover:bg-gray-50 transition-colors rounded-3xl flex items-center justify-center gap-3"
        >
          <FaGithub className="w-5 h-5 text-gray-800" />
          <span className="text-gray-700 font-medium">
            Continue with GitHub
          </span>
        </Button>
      </form>
    </div>
  );
};

export default SignInButtons;
