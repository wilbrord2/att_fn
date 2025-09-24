import Image from "next/image";
import React, { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  required?: boolean;
  registration: UseFormRegisterReturn;
  icon: string;
  error?: FieldError;
};

const InputFieldIcon: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  registration,
  icon,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative w-full ">
      <div
        className={`w-full flex items-center pl-3 gap-1 border border-gray-200 rounded-lg ${
          focused ? "ring-2 ring-[#600509]" : ""
        }`}
      >
        <Image src={icon} alt={"image name"} width={50} height={50} />

        <div className="relative w-full">
          {/* Floating Label */}
          <label
            className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${
            focused || inputValue
              ? "top-1 text-xs text-gray-500"
              : "top-3 text-gray-400"
          }`}
          >
            {label}
          </label>

          <input
            type={type}
            placeholder={focused ? placeholder : ""}
            {...registration}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              registration.onChange(e);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${
              focused || inputValue ? "pb-2" : ""
            } w-full  px-3 pt-6 pr-10 focus:outline-none `}
          />
        </div>
      </div>
      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default InputFieldIcon;