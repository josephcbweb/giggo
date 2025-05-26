import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Edit",
  description: "Edit a job",
};
const layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
