import { auth } from "@/auth";
import CreateJob from "@/components/create/CreateJob";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (!session) redirect("login");
  return (
    <div>
      <CreateJob />
    </div>
  );
};

export default page;
