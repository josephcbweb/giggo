import React from "react";
import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "@/auth";

const SignUpButtons = () => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <Button variant="outline" className="w-full">
            <FaGithub />
            Signup with Github
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button variant="outline" className="w-full">
            <FaGoogle />
            Signup with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpButtons;
