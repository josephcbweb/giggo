import { auth } from "@/auth";
import ProfileLanding from "@/components/Profile/ProfileLanding";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ user_id?: string }>;
}) => {
  const { user_id } = await searchParams;
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <div>
      <ProfileLanding
        user_id={user_id || session?.user?.id}
        session={session}
      />
    </div>
  );
};

export default page;
