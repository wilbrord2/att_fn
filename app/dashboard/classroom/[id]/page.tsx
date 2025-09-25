"use client";
import React, { use, useEffect, useState } from "react";
import StudentDashboardTemplate from "../../StudentDashboardTemplate";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Classroom } from "@/app/utils/types/classRooms";
import { GetClassApi } from "@/app/api/classrooms/action";
import Loading from "@/app/loading";

const ClassRoomPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const classId = Number(id);
  const [classRooms, setClassRooms] = useState<Classroom>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    handleGetClassrooms();
  }, []);

  const handleGetClassrooms = async () => {
    setLoading(true);
    try {
      const result = await GetClassApi(classId);

      if (result.success && result.data) {
        setLoading(false);
        setClassRooms(result.data.classroom);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StudentDashboardTemplate>
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="font-bold flex  items-center gap-1 cursor-pointer hover:bg-default-yellow/20 hover:border-b-2 hover:border-b-default-green rounded-2xl px-3 py-1 duration-200"
        >
          <IoChevronBackOutline size={20} />
          <span>Back</span>
        </button>

        {loading ? (
          <Loading />
        ) : (
          classRooms && (
            <div className="bg-white shadow-sm md:2/3 lg:w-1/2 shadow-default-green/50 border-t-2 border-t-default-green rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {classRooms?.class_label} — {classRooms?.department}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-gray-700">
                    Academic Year:
                  </span>{" "}
                  {classRooms?.academic_year}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Year Level:
                  </span>{" "}
                  {classRooms?.year_level}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Intake:</span>{" "}
                  {classRooms?.intake}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      classRooms?.class_status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : classRooms?.class_status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {classRooms?.class_status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Created At:
                  </span>{" "}
                  {new Date(classRooms.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )
        )}

        {/* review table */}
        <div></div>
      </div>
    </StudentDashboardTemplate>
  );
};

export default ClassRoomPage;
