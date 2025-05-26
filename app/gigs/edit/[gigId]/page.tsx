import GigEdit from "@/components/edit/GigEdit";
import React from "react";

const page = async ({ params }: { params: Promise<{ gigId: string }> }) => {
  const data = await params;
  const { gigId } = data;
  return (
    <div>
      <GigEdit gigId={gigId} />
    </div>
  );
};

export default page;
