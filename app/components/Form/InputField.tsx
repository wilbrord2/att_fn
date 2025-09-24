import React, { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type InputFieldProps = {
  placeholder: string;
  type: "text" | "email" | "password" | "tel" | "number";
  required?: boolean;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  type = "text",
  registration,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        placeholder={placeholder}
        {...registration}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          registration.onChange(e);
        }}
        className={` w-full border border-gray-200 rounded-lg px-3 py-4 pr-10 focus:outline-none focus:ring-2 focus:ring-default-green`}
      />

      {/* Password Toggle */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
