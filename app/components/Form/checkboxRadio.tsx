"use client";

import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface CheckboxRadioProps {
  options: Option[];
  registration: UseFormRegisterReturn;
  error?: FieldError;
  value?: string;
}

export default function CheckboxRadio({
  options,
  registration,
  error,
  value,
}: CheckboxRadioProps) {
  const [selected, setSelected] = useState<string>(value || "");

  const handleSelect = (val: string) => {
    setSelected(val);
    registration.onChange({
      target: { name: registration.name, value: val },
    });
  };

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden input for RHF binding */}
      <input type="hidden" {...registration} value={selected} />

      <div className="flex gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className="font-bold text-xs flex items-center gap-2 cursor-pointer select-none"
          >
            <span
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                selected === opt.value
                  ? "bg-green-100 border-green-500"
                  : "bg-white border-gray-400"
              }`}
            >
              {selected === opt.value && (
                <FaCheck className="w-4 h-4 text-green-600" strokeWidth={3} />
              )}
            </span>
            <span
              className={` ${
                selected === opt.value ? "text-green-800" : "text-gray-700"
              }`}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
