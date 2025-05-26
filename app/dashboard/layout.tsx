import DashNav from "@/components/Navbar/DashNav";
import { Metadata } from "next";
import { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Explore jobs",
};
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen overflow-y-hidden flex flex-col">
      <div className="">
        <DashNav />
      </div>
      <div className="overflow-y-hidden ">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
