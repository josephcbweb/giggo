"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { IoLogOut } from "react-icons/io5";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

const LogOutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      redirect("/");
    } catch (error) {
      setIsLoggingOut(false);
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleSignOut}
        variant={"ghost"}
        className="hover:text-red-700 hover:bg-transparent h-10 w-14 relative"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <motion.div
            className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IoLogOut className="text-lg" />
          </motion.div>
        )}
      </Button>
    </div>
  );
};

export default LogOutButton;
