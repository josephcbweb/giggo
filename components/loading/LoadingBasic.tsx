import Image from "next/image";
import React from "react";

const LoadingBasic = () => {
  return (
    <div className="flex h-screen justify-center items center bg-white">
      <Image
        src="/loading/loading-blue-dot.gif"
        width={40}
        height={40}
        alt="loading"
        className="p-6"
      ></Image>
    </div>
  );
};

export default LoadingBasic;
