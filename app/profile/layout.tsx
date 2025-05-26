import DashNav from "@/components/Navbar/DashNav";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Profile",
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashNav />
      {children}
    </div>
  );
};

export default layout;
