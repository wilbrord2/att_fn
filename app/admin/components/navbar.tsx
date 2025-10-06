"use client";
import React, { useEffect, useRef, useState } from "react";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
import { GetProfileApi } from "@/app/api/students/action";
import { useAppContext } from "@/app/context";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Logout } from "@/app/api/auth/logout";
import { useRouter } from "next/navigation";

const studentNavItems = [
  { title: "Home", link: "/dashboard" },
  { title: "Profile", link: "/setting" },
  { title: "Logout", link: "#" },
];

const Mainnavbar = () => {
  const { profile, setProfile } = useAppContext();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleGetProfile = async () => {
    const result = await GetProfileApi();
    if (result.success && result.data) {
      setProfile(result.data);
    }
  };

  const handlelogout = async () => {
    const result = await Logout();
    if (result) {
      router.push("/");
      setOpen(false);
    }
  };
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center justify-between p-4 bg-default-green rounded-2xl"
    >
      {/* Logo */}
      <Link href={"/dashboard"}>
        <div className="relative w-14 h-14">
          <Image
            src={Logo}
            alt="INES Logo"
            fill
            className="w-full h-full object-contain bg-white rounded-full"
          />
        </div>
      </Link>

      {/* Profile & Dropdown Toggle */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 text-white cursor-pointer"
      >
        <div className="font-semibold flex flex-col">
          <span className="text-sm">{profile?.name}</span>
          <span className="text-xs">{profile?.email}</span>
        </div>
        <FaCaretDown
          className={`transition-transform ${
            open ? "rotate-180" : "rotate-0"
          } hover:text-default-yellow`}
        />
        <div className="w-14 h-14 flex items-center text-default-green hover:bg-default-yellow transition-colors cursor-pointer justify-center bg-white rounded-full font-semibold p-2 text-2xl">
          {profile?.name?.slice(0, 1)}
        </div>
      </div>

      {/* Dropdown Menu with Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 right-0 bg-white shadow-md z-30 p-4 rounded-lg w-[200px] flex flex-col"
          >
            {studentNavItems.map((item, idx) => (
              <Link
                onClick={() => {
                  item.title.includes("Logout")
                    ? handlelogout()
                    : setOpen(false);
                }}
                key={idx}
                href={item.link}
                className="p-2 rounded border-b border-b-gray-200 last:border-0 font-semibold text-gray-700 hover:bg-default-yellow/70 hover:text-default-green transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mainnavbar;
