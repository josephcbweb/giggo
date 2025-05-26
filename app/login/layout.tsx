import { title } from "process";
import React, { Suspense } from "react";
import Loading from "./loading";

export const metadata = {
  title: "Login",
  description: "Login to giggo",
};

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

export default layout;
