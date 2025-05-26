import { auth } from "@/auth";
import JobApplicationTracker from "@/components/applied/JobApplicationTracker";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <JobApplicationTracker session={session} />
    </>
  );
};

export default page;
