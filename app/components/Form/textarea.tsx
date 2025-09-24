import React, { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type TextareaProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  rows = 4,
  registration,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full">
      {/* Floating Label */}
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${
            focused || value
              ? "top-1 text-xs text-gray-500"
              : "top-3 text-sm text-gray-400"
          }`}
      >
        {label}
      </label>

      <textarea
        rows={rows}
        placeholder={focused ? placeholder : ""}
        {...registration}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          registration.onChange(e);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full border border-gray-200 rounded-lg px-3 pt-6 pb-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#600509]`}
      />

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default Textarea;
