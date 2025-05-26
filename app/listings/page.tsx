import { auth } from "@/auth";
import ListingsMain from "@/components/listings/ListingsMain";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return redirect("/login");
  }
  return (
    <div>
      <ListingsMain userId={userId || ""} />
    </div>
  );
};

export default page;
