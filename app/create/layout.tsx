import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create",
  description: "Create a job",
};
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="">
      <div className="">{children}</div>
    </div>
  );
};

export default layout;
