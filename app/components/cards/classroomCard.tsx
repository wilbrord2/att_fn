"use client";
import React from "react";

type ClassCardProps = {
  academicYear: string;
  yearLevel: string;
  intake: string;
  department: string;
  classLabel: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  onClick: () => void;
};

const ClassCard: React.FC<ClassCardProps> = ({
  academicYear,
  yearLevel,
  intake,
  department,
  classLabel,
  status,
  createdAt,
  onClick,
}) => {
  return (
    <div
      className="bg-white min-w-[300px] border-t-2 border-t-default-green hover:scale-110 duration-200 hover:bg-yellow-50 rounded-lg shadow-default-green/50 shadow-md p-4 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick()}
    >
      <div className="flex justify-between gap-2 items-center">
        <div className="flex flex-col py-1">
          <span className="text-sm text-gray-400 font-medium">
            {classLabel}
          </span>
          <h3 className="text-lg font-bold text-gray-700">{department}</h3>
        </div>
        <div className="flex flex-col  py-1">
          <span className="text-sm text-gray-400 font-medium">Status:</span>
          <span
            className={`${
              status.toLocaleLowerCase() === "pending"
                ? "text-yellow-700"
                : status.toLocaleLowerCase() === "active"
                ? "text-green-700"
                : "text-red-700"
            } text-sm font-semibold `}
          >
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-700">
        <span className="font-semibold">Year:</span> {yearLevel}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Academic Year:</span> {academicYear}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Intake:</span> {intake}
      </p>

      {createdAt && (
        <p className="text-xs text-gray-500">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ClassCard;
