import DashNav from "@/components/Navbar/DashNav";
import { Metadata } from "next";
import React from "react";
import { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Job Listings",
};
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <DashNav />
      <div className="border-t-2">{children}</div>
    </div>
  );
};

export default layout;
