"use client";
import React from "react";
import AdminDashboardTemplate from "../AdminDashboardTemplate";
import { useAppContext } from "@/app/context";

const AdminDashboard = () => {
  const { profile } = useAppContext();
  return (
    <AdminDashboardTemplate>
      <div className="">
        <div className="w-full bg-white  rounded-lg">
          <h2 className="text-2xl font-bold text-gray-600">
            Student Feedback Overview
          </h2>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl">
            Welcome back,{" "}
            <span className="font-semibold text-green-600 text-base capitalize">
              {profile?.name} 👋
            </span>{" "}
            View class rep feedback to stay informed, track progress, and
            support improvement.
          </p>
        </div>
      </div>
    </AdminDashboardTemplate>
  );
};

export default AdminDashboard;
