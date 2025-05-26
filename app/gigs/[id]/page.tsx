import { auth } from "@/auth";
import GigDetailsPage from "@/components/gigDetails/GigDetailsPage";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <GigDetailsPage session={session} />
    </div>
  );
};

export default page;
