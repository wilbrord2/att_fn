"use client";
import { useAppContext } from "@/app/context";
import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ViewReview = ({ review }: { review: string }) => {
  const { setActiveModalId } = useAppContext();
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 max-w-lg mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-2 flex justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-green-800 ">Your Feedback</h2>
        <IoMdCloseCircleOutline
          onClick={() => setActiveModalId(null)}
          size={30}
          className="text-red-400 cursor-pointer"
        />
      </div>
      <p className=" text-gray-700 leading-relaxed">
        {review || "No feedback provided yet."}
      </p>
    </div>
  );
};

export default ViewReview;
