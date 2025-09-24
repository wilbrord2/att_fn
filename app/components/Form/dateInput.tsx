"use client";
import React, { useEffect, useRef, useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { IoCalendarOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

type DatePickerProps = {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  min?: string; 
  max?: string; 
  defaultValue?: string;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toDisplay(d: Date) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder,
  registration,
  error,
  min,
  max,
  defaultValue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("");
  const [value, setValue] = useState<string>(""); 

  const today = new Date();
  const initial = defaultValue ? new Date(defaultValue) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  // Init value from default
  useEffect(() => {
    if (defaultValue) {
      const d = new Date(defaultValue);
      if (!isNaN(d.valueOf())) {
        setValue(toDisplay(d));
        setDisplay(toDisplay(d));
      }
    }
  }, [defaultValue]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const minDate = min ? new Date(min) : undefined;
  const maxDate = max ? new Date(max) : undefined;

  const selectDate = (d: Date) => {
    if (minDate && d < minDate) return;
    if (maxDate && d > maxDate) return;

    const formatted = toDisplay(d);
    setValue(formatted);
    setDisplay(formatted);
    setOpen(false);

    registration.onChange?.({
      target: { name: registration.name, value: formatted },
      type: "change",
    } as any);
  };

  const startWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const hasValue = Boolean(display);

  // Dropdown options
  const years = Array.from({ length: 120 }, (_, i) => today.getFullYear() - i); // last 120 years
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden RHF input */}
      <input type="hidden" {...registration} value={value} readOnly />

      {/* Floating label */}
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${open || hasValue ? "top-1 text-xs text-gray-500" : "hidden"}
        `}
      >
        {label}
      </label>

      {/* Field */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left border rounded-xl px-3 pt-6 pr-10 pb-3
          border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#600509] shadow-sm`}
      >
        <span className={hasValue ? "text-gray-900" : "text-gray-400"}>
          {hasValue ? display : placeholder}
        </span>
      </button>

      {/* Calendar icon */}
      <span
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <IoCalendarOutline size={20} />
      </span>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}

      {/* Calendar dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg p-4"
          >
            {/* Header with Month & Year Selectors */}
            <div className="flex items-center justify-between mb-3 gap-2">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="border rounded p-1 text-sm"
              >
                {months.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="border rounded p-1 text-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1 text-sm">
              {cells.map((day, idx) => {
                if (day === null) return <div key={idx} />;
                const dateObj = new Date(viewYear, viewMonth, day);
                const disabled =
                  (minDate && dateObj < minDate) ||
                  (maxDate && dateObj > maxDate);
                const isSelected = display === toDisplay(dateObj);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectDate(dateObj)}
                    disabled={disabled}
                    className={`py-1.5 rounded-lg text-center transition-colors
                      ${
                        disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#600509] text-white"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
