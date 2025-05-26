import DashNav from "@/components/Navbar/DashNav";
import React from "react";

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="border-b-2">
        <DashNav />
      </div>

      {children}
    </div>
  );
};

export default layout;
