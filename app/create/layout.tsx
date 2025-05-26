import Navbar from "@/components/Navbar/Navbar";
import React from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="">
      <div className="">{children}</div>
    </div>
  );
};

export default layout;
