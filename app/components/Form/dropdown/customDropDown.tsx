"use client";
import React, { useState, useRef, useEffect, FC } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CustomDropDownProps {
  items: string[];
  placeholder: string;
  selected?: string;
  onChange: (value: string) => void;
  error?: FieldError;
}

const CustomDropDown: FC<CustomDropDownProps> = ({
  items,
  placeholder = "Select Option",
  onChange,
  selected,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full min-w-[120px]">
      {/* Trigger */}
      <button
        type="button"
        className="flex items-center justify-between w-full gap-2 p-4 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-default-green"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {selected ? (
            <span className="font-semibold text-base">{selected}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <span>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</span>
      </button>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}

      {/* Dropdown List */}
      <div
        className={`absolute top-full right-0 w-full mt-1 border border-gray-300 rounded-md bg-white shadow-lg z-30 overflow-y-scroll transition-all duration-200 ease-in-out ${
          isOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        }`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
              index !== items.length - 1 ? "border-b border-gray-200" : ""
            }`}
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropDown;
