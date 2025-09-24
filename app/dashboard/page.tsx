"use client";
import React, { useEffect, useState } from "react";
import StudentDashboardTemplate from "./StudentDashboardTemplate";
import { useAppContext } from "../context";
import { GetStudentClassApi } from "../api/classrooms/action";
import { Classroom, ClassroomType } from "../utils/types/classRooms";
import Title from "../components/titles/title";
import Loading from "../loading";
import ClassCard from "../components/cards/classroomCard";
import CreateClassCard from "../components/cards/createClassCard";
import CenterModal from "../components/model/centerModel";
import CreateClassForm from "../components/classrooms/createClassrooms";

const Dashborad = () => {
  const { profile, activeModalId, setActiveModalId } = useAppContext();
  const [classRooms, setClassRooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetClassrooms();
  }, [activeModalId]);

  const handleGetClassrooms = async () => {
    setLoading(true);
    try {
      const result = await GetStudentClassApi();

      if (result.success && result.data) {
        setLoading(false);
        setClassRooms(result.data.classrooms);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StudentDashboardTemplate>
      <div className="space-y-4 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg ">
          <h2 className="text-2xl font-bold text-gray-700">
            Class Rep Dashboard
          </h2>
          <p className="mt-2 text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl">
            Welcome back,{" "}
            <span className="font-semibold text-green-600 capitalize">
              {profile?.name} 👋
            </span>
            . Share your feedback on today’s class to help improve teaching and
            learning experiences.
          </p>
        </div>

        <Title title="My Class" description="my classroms" />

        {loading ? (
          <Loading />
        ) : (
          <div className="flex items-center gap-4 flex-wrap w-full h-full">
            {classRooms.map((room) => (
              <ClassCard
                key={room.id}
                classLabel={room.class_label}
                yearLevel={room.year_level}
                academicYear={room.academic_year}
                intake={room.intake}
                department={room.department}
                status={room.class_status}
                createdAt={room.created_at}
                onClick={() => console.log("Class clicked")}
              />
            ))}
            <CreateClassCard
              onClick={() => setActiveModalId("create-classroom")}
            />
          </div>
        )}
      </div>
      <CenterModal id={"create-classroom"}>
        <CreateClassForm />
      </CenterModal>
    </StudentDashboardTemplate>
  );
};

export default Dashborad;
