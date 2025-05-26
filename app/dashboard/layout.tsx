import DashMain from "@/components/dashboard/DashMain";
import DashNav from "@/components/Navbar/DashNav";
import { ReactNode } from "react";

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
