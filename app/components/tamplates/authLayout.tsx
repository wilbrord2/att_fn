import Image from "next/image";
import logo from "@/public/images/logo.png";
import { ReactNode } from "react";

export default function AuthLayoutPage({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full md:p-4 lg:p-8 flex items-center max-md:flex-col ">
      <div className="max-md:hidden w-1/2 lg:w-2/5 main-linear-bg h-full rounded-lg flex flex-col p-4 items-center justify-center space-y-8 ">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white w-fit h-fit rounded-full">
            <Image src={logo} alt="ines logo" width={100} height={200} />
          </div>

          {/* Title */}
          <div className="text-white text-center">
            <h1 className="text-2xl font-semibold">INES-Ruhengeri</h1>
            <p className="text-sm font-medium">Institute of Applied Sciences</p>
          </div>
        </div>
        {/* Student Encouragement Content */}
        <div className="text-white max-w-md text-center space-y-3 shadow p-6 rounded-lg bg-[#0E7508]/70">
          <h2 className="text-xl font-semibold">Your Voice Shapes Education</h2>
          <p className="text-sm leading-5">
            This platform empowers you as a student to share feedback on your
            classes, teachers, and lectures. Every comment you provide helps us
            improve the quality of education at INES-Ruhengeri.
          </p>
          <p className="text-xs italic">
            Together, we create a stronger learning environment for everyone.
          </p>
        </div>
      </div>

      <div className="md:hidden bg-default-green rounded-b-md p-2 flex items-center justify-between w-full">
        <div className="bg-white w-fit h-fit rounded-full">
          <Image src={logo} alt="ines logo" width={60} height={100} />
        </div>
      </div>

      {/* login form */}
      <div className="max-md:w-full w-1/2 lg:w-3/5 max-md:h-full max-md:flex max-md:justify-center max-md:items-center">
        {children}
      </div>
    </div>
  );
}
