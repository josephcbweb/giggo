import DashNav from "@/components/Navbar/DashNav";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashNav />
      {children}
    </div>
  );
};

export default layout;
