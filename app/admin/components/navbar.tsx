import React from "react";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
const Mainnavbar = () => {
  return (
    <div className="flex items-center justify-between p-4  bg-default-green rounded-2xl">
      <div className="relative w-12 h-12 ">
        <Image
          src={Logo}
          alt="INES Logo"
          fill
          className="w-full h-full object-contain bg-white rounded-full"
        />
      </div>
    </div>
  );
};

export default Mainnavbar;
