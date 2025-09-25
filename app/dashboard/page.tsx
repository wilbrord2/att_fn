"use client";
import React, { useEffect, useState } from "react";
import StudentDashboardTemplate from "./StudentDashboardTemplate";
import { useAppContext } from "../context";
import { GetStudentClassApi } from "../api/classrooms/action";
import { Classroom } from "../utils/types/classRooms";
import Title from "../components/titles/title";
import Loading from "../loading";
import ClassCard from "../components/cards/classroomCard";
import CreateClassCard from "../components/cards/createClassCard";
import CenterModal from "../components/model/centerModel";
import CreateClassForm from "../components/classrooms/createClassrooms";
import { useRouter } from "next/navigation";

const Dashborad = () => {
  const { profile, activeModalId, setActiveModalId } = useAppContext();
  const [classRooms, setClassRooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

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
      <div className="space-y-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg ">
          <h2 className="text-2xl font-bold text-gray-800">
            Class Rep Dashboard
          </h2>
          <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
            {greeting},{" "}
            <span className="font-semibold text-green-600 capitalize">
              {profile?.name} 👋
            </span>
            . Use this space to share your class feedback, review teachers, and
            track learning progress — helping improve the overall academic
            experience.
          </p>
        </div>

        <Title
          title="My Classes"
          description="Your classrooms, reviews, and schedules — manage teacher feedback and class timings here."
        />

        {loading ? (
          <Loading />
        ) : (
          <div className="flex items-center gap-8 flex-wrap w-full h-full">
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
                onClick={() => {
                  console.log("Class clicked :", room.id, room.class_label);
                  router.push(`/dashboard/classroom/${room.id}`);
                }}
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
