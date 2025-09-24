"use client";
import React from "react";
import { FiPlus } from "react-icons/fi";

type CreateClassCardProps = {
  onClick: () => void;
};

const CreateClassCard: React.FC<CreateClassCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex max-w-sm flex-col h-full items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition duration-200"
    >
      <div className="text-green-500 text-3xl mb-2">
        <FiPlus />
      </div>
      <p className="text-gray-500 font-semibold text-center">
        Create New Classroom
      </p>
    </div>
  );
};

export default CreateClassCard;
