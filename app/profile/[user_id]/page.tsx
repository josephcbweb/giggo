import { auth } from "@/auth";
import ProfilePage from "@/components/Profile/ProfilePage";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { user_id: string } }) => {
  const data = await params;
  const user = data.user_id;
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <ProfilePage user_id={user} />
    </div>
  );
};

export default page;
