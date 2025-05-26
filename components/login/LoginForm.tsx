"use client";
import { submitLoginForm } from "@/actions/loginActions";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const errorMessage = await submitLoginForm(formData);

    if (errorMessage) {
      setError(errorMessage);
      setIsLoading(false);
    } else {
      redirect("/dashboard");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
        <div className="w-full md:w-[350px]">
          <div className="flex items-center bg-white p-2 mb-4 rounded-lg relative border-b-2 border-gray-300">
            <i className="bi bi-person text-gray-500 text-lg absolute left-3">
              <FaRegUser />
            </i>
            <input
              className="w-full p-3 pl-10 bg-transparent text-base focus:outline-none "
              name="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center bg-white p-2 mb-4 rounded-lg relative border-b-2 border-gray-300">
            <i className="bi bi-file-lock2 text-gray-500 text-lg absolute left-3">
              <RiLockPasswordLine />
            </i>
            <input
              className="w-full p-3 pl-10 bg-transparent text-base focus:outline-none "
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-black w-[350px] text-white py-3 px-5 rounded-3xl mt-6 hover:scale-105 transition-transform"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="flex justify-center">
        {error && (
          <p className="mt-6 w-[350px] font-semibold text-center bg-red-500 text-white text-sm p-1 rounded-md">
            {typeof error === "string" ? error : "An error occurred"}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
