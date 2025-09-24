"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export default function Checkbox({
  label,
  registration,
  error,
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="appearance-none w-6 h-6 rounded-md border-2 border-green-500 
                     checked:bg-green-100 checked:border-green-500 
                     checked:before:content-['✓'] checked:before:text-green-600 
                     checked:before:flex checked:before:items-center 
                     checked:before:justify-center checked:before:font-bold"
          {...registration}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
