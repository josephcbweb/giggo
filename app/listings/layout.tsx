import DashNav from "@/components/Navbar/DashNav";
import React from "react";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <DashNav />
      <div className="border-t-2">{children}</div>
    </div>
  );
};

export default layout;
