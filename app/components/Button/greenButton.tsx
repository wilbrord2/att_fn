"use client";

import { motion } from "motion/react";
import React from "react";

const Button = ({
  title,
  type = "button",
  disabled,
  onClick,
}: {
  title: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      type={type}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`p-3 cursor-pointer rounded-lg bg-default-green w-full text-nowrap text-center font-bold text-sm text-white ${
        disabled ? "opacity-30 cursor-not-allowed" : ""
      }`}
    >
      {title}
    </motion.button>
  );
};

export default Button;
