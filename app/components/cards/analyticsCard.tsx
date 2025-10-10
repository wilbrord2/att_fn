"use client";
import React, { useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { RxTriangleUp } from "react-icons/rx";

const AnalyticsCard = ({
  title,
  value,
  loading,
  description,
}: {
  title: string;
  value: string | number;
  loading?: boolean;
  description?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-start justify-center border border-slate-200">
      <div className="flex items-center justify-between w-full gap-2 mb-2">
        <h3 className="text-sm font-medium text-slate-600 capitalize tracking-wide">
          {title}
        </h3>
        {description && (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <CiCircleQuestion className="w-4 h-4 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors" />
            {showTooltip && (
              <div className="absolute z-10  top-6 -right-4 bg-slate-800 text-white text-xs rounded-md px-3 py-2 w-48 shadow-lg animate-fadeIn">
                {description}
                <div className="absolute top-[-10px] right-4 text-sm text-slate-800">
                  <RxTriangleUp />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

     { loading ? (
        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-3xl font-semibold text-slate-800">{value}</p>
      )}
    </div>
  );
};

export default AnalyticsCard;
