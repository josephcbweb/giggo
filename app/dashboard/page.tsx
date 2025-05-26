import { auth } from "@/auth";
import DashMain from "@/components/dashboard/DashMain";
import { redirect } from "next/navigation";
import React from "react";

interface userData {
  name: string;
  email: string;
  image: string;
}

const page = async () => {
  const session = await auth();
  if (!session) redirect("/login");
  const name = session?.user?.name as string;
  const email = session?.user?.email as string;
  const image = session?.user?.image as string;
  const userInfo: userData = {
    name,
    email,
    image,
  };
  return (
    <div className=" ">
      <DashMain userInfo={userInfo} />
    </div>
  );
};

export default page;
