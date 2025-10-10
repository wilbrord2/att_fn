"use client";
import React, { useEffect, useState } from "react";
import AdminDashboardTemplate from "../AdminDashboardTemplate";
import { useAppContext } from "@/app/context";
import AnalyticsCard from "@/app/components/cards/analyticsCard";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import CustomDropDown from "@/app/components/Form/dropdown/customDropDown";
import {
  ClassroomAnalytics,
  FeedbackAnalytics,
  StudentAnalytics,
} from "@/app/utils/types/analytics";
import {
  GetClassroomDataApi,
  GetFeedbackDataApi,
  GetStudentDataApi,
} from "@/app/api/analytics/action";

const AdminDashboard = () => {
  const { profile } = useAppContext();
  const [selected, setSelected] = React.useState("Today");
  const [studentData, setStudentData] = useState<{
    loading: boolean;
    data?: StudentAnalytics;
  }>({ loading: true });
  const [classroomData, setClassroomData] = useState<{
    loading: boolean;
    data?: ClassroomAnalytics;
  }>({ loading: true });
  const [feedbackData, setFeedbackData] = useState<{
    loading: boolean;
    data?: FeedbackAnalytics;
  }>({ loading: true });

  useEffect(() => {
    fetchClassroomData();
    fetchStudentData();
  }, []);

  useEffect(() => {
    fetchFeedbackData();
  }, [selected]);

  const fetchStudentData = async () => {
    setStudentData({ loading: true });
    try {
      const response = await GetStudentDataApi();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch student data");
      }
      const result = response.data;
      if (result) {
        setStudentData({ loading: false, data: result });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  const fetchClassroomData = async () => {
    setClassroomData({ loading: true });
    try {
      const response = await GetClassroomDataApi();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch classroom data");
      }
      const result = response.data;
      if (result) {
        setClassroomData({ loading: false, data: result });
      }
    } catch (error) {
      console.error("Error fetching classroom data:", error);
    }
  };
  const fetchFeedbackData = async () => {
    setFeedbackData({ loading: true });
    if (!selected) return;
    const period =
      selected === "Today"
        ? "Daily"
        : selected === "This Week"
        ? "Weekly"
        : selected === "This Month"
        ? "Monthly"
        : "Yearly";
    try {
      const response = await GetFeedbackDataApi(period.toLowerCase());
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch feedback data");
      }
      const result = response.data;
      if (result) {
        setFeedbackData({ loading: false, data: result });
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  return (
    <AdminDashboardTemplate>
      <div className="w-full bg-white rounded-lg space-y-6">
        <div className="">
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

        {/* review cards */}
        <div className="space-y-4">
          <div>
            <h2 className="flex items-center text-2xl font-bold text-gray-600">
              <span className="mr-2">Feedback Reviews</span>
              <Link href="/admin/feedback">
                <FiExternalLink className="text-gray-400 hover:text-gray-600 text-lg" />
              </Link>
            </h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl">
              Analyze feedback reviews to gain insights into student
              satisfaction, identify areas for improvement, and enhance the
              overall learning experience.
            </p>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/3 flex items-start gap-4">
            <div className="w-full">
              <AnalyticsCard
                title={`Total ${selected} feedback`}
                loading={feedbackData.loading}
                value={feedbackData.data?.total_reviews || 0}
                description={`Total number of classroom feedback received ${selected}.`}
              />
            </div>
            <div className="w-fit">
              <CustomDropDown
                items={["Today", "This Week", "This Month", "This Year"]}
                placeholder="Select review type"
                selected={selected}
                onChange={setSelected}
              />
            </div>
          </div>
        </div>

        {/* classroom analytics cards */}
        <>
          <div>
            <h2 className="flex items-center text-2xl font-bold text-gray-600">
              <span className="mr-2">Classroom Overview</span>
              <Link href="/admin/classroom">
                <FiExternalLink className="text-gray-400 hover:text-gray-600 text-lg" />
              </Link>
            </h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl">
              Monitor classroom to enhance learning experiences, identify
              issues, and foster a positive educational environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Total classrooms"
              loading={classroomData.loading}
              value={classroomData.data?.total_classrooms || 0}
              description="Total number of classrooms registered for the current academic year."
            />
            <AnalyticsCard
              title="Approved classrooms"
              loading={classroomData.loading}
              value={classroomData.data?.total_classroom_approved || 0}
              description="Number of classrooms approved for feedback."
            />
            <AnalyticsCard
              title="Pending classrooms"
              loading={classroomData.loading}
              value={classroomData.data?.total_classroom_pending || 0}
              description="Number of classrooms that are pending feedback."
            />
            <AnalyticsCard
              title="Rejected classrooms"
              loading={classroomData.loading}
              value={classroomData.data?.total_classroom_rejected || 0}
              description="Number of classrooms that have been rejected."
            />
          </div>
        </>

        {/* Student Analytics cards */}
        <>
          <div>
            <h2 className="flex items-center text-2xl font-bold text-gray-600">
              <span className="mr-2">Class Representative Overview</span>
              <Link href="/admin/student">
                <FiExternalLink className="text-gray-400 hover:text-gray-600 text-lg" />
              </Link>
            </h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl">
              Monitor class representatives to ensure effective communication,
              foster leadership skills, and enhance student engagement within
              the academic community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Total class Representatives"
              loading={studentData.loading}
              value={studentData.data?.total_class_leaders || 0}
              description="Total number of class leaders registered for the current academic year."
            />
            <AnalyticsCard
              title="Active class Representatives"
              loading={studentData.loading}
              value={studentData.data?.total_leaders_active || 0}
              description="Number of class leaders who provided class feedback this week."
            />
            <AnalyticsCard
              title="Inactive class Representatives"
              loading={studentData.loading}
              value={studentData.data?.total_leaders_inactive || 0}
              description="Number of class leaders who did not provide class feedback this week."
            />
            <AnalyticsCard
              title="Approved class Representatives"
              loading={studentData.loading}
              value={studentData.data?.total_leaders_approved || 0}
              description="Number of class leaders who have been approved."
            />
            <AnalyticsCard
              title="Pending class Representatives"
              loading={studentData.loading}
              value={studentData.data?.total_leaders_rejected || 0}
              description="Number of class leaders who are pending approval."
            />
          </div>
        </>
        {/* tables */}
        <div></div>
      </div>
    </AdminDashboardTemplate>
  );
};

export default AdminDashboard;
