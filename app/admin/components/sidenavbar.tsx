"use client";

import React, { useEffect } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { PiStudentFill } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IoMdLogOut } from "react-icons/io";
import { Logout } from "../../utils/functions/logout";
import { useAppContext } from "../../context";
import Link from "next/link";
import { SiGoogleclassroom } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";

// import { GetProfileApi } from "@/app/api/auth/profile";

const SideBarNav = () => {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = pathname;
  const { setPage, setProfile } = useAppContext();

  const navItems = [
    { label: "Dashboard", icon: HiOutlineHome, href: "/admin/dashboard" },
    { label: "Student", icon: PiStudentFill, href: "/admin/student" },
    { label: "Classroom", icon: SiGoogleclassroom, href: "/admin/classroom" },
    { label: "Feedback", icon: VscFeedback, href: "/admin/feedback" },
    { label: "Logout", icon: IoMdLogOut, href: "#" },
  ];

  const handlelogout = async () => {
    const result = await Logout();
    if (result) {
      router.push("/");
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleGetProfile = async () => {
    // const result = await GetProfileApi();
    // if (result.success && result.data) {
    //   setProfile(result.data);
    // }
  };

  return (
    <div className="flex flex-col justify-between h-full w-60 min-w-[260px] space-y-4 ml-4">
      {/* Date */}
      <p className="text-sm text-[#2A2F4E] font-semibold">Today, {today}</p>

      <div className="h-full bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between">
        {/* Navigation */}
        <nav className="flex flex-col gap-2 relative">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive =
              href === "/a/dashboard"
                ? normalizedPath === "/dashboard"
                : normalizedPath.startsWith(href);

            return (
              <button
                key={label}
                onClick={() => {
                  label.toLocaleLowerCase() === "logout"
                    ? handlelogout()
                    : router.push(href);
                }}
                className="relative flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-sm transition overflow-hidden cursor-pointer hover:bg-default-yellow/50"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute inset-0 rounded-lg bg-default-yellow/70 border border-[#8F000730]/90"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      duration:0.5,
                    }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 ${
                    isActive ? "text-slate-800" : "text-gray-400"
                  }`}
                />
                <span
                  className={`relative z-10 ${
                    isActive ? "text-slate-800" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div>
          {/* Support */}
          <div className="py-4 w-full">
            <div className="border-t border-[#EDEFF2] mb-8 font-semibold" />
            <button className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition text-sm w-full">
              <span className="w-4 h-4 rounded-full border flex items-center justify-center">
                ?
              </span>
              <Link
                href={"https://www.ines.ac.rw/"}
                target="_blank"
                className="hover:underline cursor-pointer"
              >
                Contact Support
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarNav;
