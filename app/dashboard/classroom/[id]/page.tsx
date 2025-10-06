"use client";
import React, { use, useEffect, useState } from "react";
import StudentDashboardTemplate from "../../StudentDashboardTemplate";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Classroom } from "@/app/utils/types/classRooms";
import { GetClassApi } from "@/app/api/classrooms/action";
import Loading from "@/app/loading";
import { GetClassReviewsApi } from "@/app/api/reviewsApi/action";
import { Review } from "@/app/utils/types/review";
import Pagination from "@/app/components/pagination";
import { motion } from "framer-motion";
import { useAppContext } from "@/app/context";
import CenterModal from "@/app/components/model/centerModel";
import CreateReviewForm from "@/app/components/reviews/createreviewsForm";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const ClassRoomPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const classId = Number(id);

  const [classRooms, setClassRooms] = useState<Classroom>();
  const [classReviews, setClassReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { activeModalId, setActiveModalId } = useAppContext();

  useEffect(() => {
    handleGetClassrooms();
    handleGetReviews();
  }, [activeModalId]);

  const handleGetClassrooms = async () => {
    setLoading(true);
    try {
      const result = await GetClassApi(classId);

      if (result.success && result.data) {
        setClassRooms(result.data.classroom);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetReviews = async () => {
    setReviewLoading(true);
    try {
      const result = await GetClassReviewsApi(classId);
      if (result.success && result.data) {
        setClassReviews(result.data.reviews);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReviewLoading(false);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;

  const totalPages = classReviews
    ? Math.ceil(classReviews.length / ITEMS_PER_PAGE)
    : 1;

  const currentReviews = classReviews
    ? classReviews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : [];

  return (
    <StudentDashboardTemplate>
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="font-bold flex items-center gap-1 border-b-2 border-b-white cursor-pointer hover:bg-default-yellow/20 hover:border-b-2 hover:border-b-default-green rounded-2xl px-3 py-1 duration-200"
        >
          <IoChevronBackOutline size={20} />
          <span>Back</span>
        </button>

        {/* Class Info */}
        {loading ? (
          <Loading />
        ) : (
          classRooms && (
            <div className="bg-white shadow-sm md:w-2/3 lg:w-1/2 shadow-default-green/50 border-t-2 border-t-default-green rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {classRooms?.class_label} — {classRooms?.department}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
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

        {/* Review Table */}
        <div className="bg-white shadow rounded-lg p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Class Reviews
            </h3>
            <motion.button
              onClick={() => setActiveModalId("create-review")}
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 border border-default-green rounded-lg text-default-green font-semibold text-sm cursor-pointer hover:bg-default-green hover:text-white transition-colors duration-300 "
            >
              + Add Review
            </motion.button>
          </div>

          {reviewLoading ? (
            <Loading />
          ) : classReviews.length === 0 ? (
            <p className="flex items-center justify-center w-ful text-slate-500 h-[300px] py-4">
              No reviews available
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-center text-gray-700 ">
                      <th className="p-4">#</th>
                      <th className="p-4">Semester</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Teacher Full Name</th>
                      <th className="p-4">Period</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Review</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReviews.map((review, idx) => (
                      <tr
                        key={review.id}
                        className="text-center border-b border-gray-200 last:border-none hover:bg-gray-50 duration-200"
                      >
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{review.semester}</td>
                        <td className="p-2">{review.lecture}</td>
                        <td className="p-2">{review.teacher_fullname}</td>
                        <td className="p-2 capitalize text-nowrap">
                          {review.class_period.replace("_", " ")}
                        </td>
                        <td className="p-2">
                          {review.start_at}-{review.end_at}
                        </td>
                        <td className="p-2 max-w-xs text-start relative group">
                          <div className="line-clamp-2 overflow-hidden text-ellipsis">
                            {review.review}
                          </div>
                        </td>

                        <td className="p-2 text-center space-x-3 text-nowrap">
                          <button
                            onClick={() => alert(`Edit review ${review.id}`)}
                            className="text-default-green hover:underline text-sm font-medium"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => alert(`Edit review ${review.id}`)}
                            className="text-default-yellow hover:underline text-sm font-medium"
                          >
                            <FaRegEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}

              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <CenterModal id={"view-review"}>
        <CreateReviewForm classId={classRooms?.id} />
      </CenterModal>
      <CenterModal id={"edit-review"}>
        <CreateReviewForm classId={classRooms?.id} />
      </CenterModal>
      <CenterModal id={"create-review"}>
        <CreateReviewForm classId={classRooms?.id} />
      </CenterModal>
    </StudentDashboardTemplate>
  );
};

export default ClassRoomPage;
