"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminDashboardTemplate from "../AdminDashboardTemplate";
import Title from "@/app/components/titles/title";
import Loading from "@/app/loading";
import Pagination from "@/app/components/pagination";
import ErrorCard from "@/app/components/Form/error";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { ClassReviewType } from "@/app/utils/types/review";
import { GetAllReviewsApi } from "@/app/api/reviewsApi/action";
import CustomDropDown from "@/app/components/Form/dropdown/customDropDown";

const ITEMS_PER_PAGE = 10;

const FeedbackManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<ClassReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleGetAllReviews = async () => {
    try {
      setLoading(true);
      const result = await GetAllReviewsApi();
      if (result.success && result.data) {
        setReviews(result.data.reviews);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch feedback data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllReviews();
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setYearFilter("");
    setSelectedPeriod("");
    setCurrentPage(1);
    router.replace("");
  };

  const hasActiveFilter =
    search || statusFilter || yearFilter || selectedPeriod;

  const toggleAccordion = (id: number) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const searchLower = search.toLowerCase();

        const matchesSearch = search
          ? r.teacher_fullname.toLowerCase().includes(searchLower) ||
            r.lecture.toLowerCase().includes(searchLower) ||
            r.user.name.toLowerCase().includes(searchLower) ||
            r.classroom.department.toLowerCase().includes(searchLower)
          : true;

        const matchesStatus = statusFilter
          ? r.classroom.class_status
              .toLowerCase()
              .includes(statusFilter.toLowerCase())
          : true;

        const matchesYear = yearFilter
          ? r.classroom.academic_year
              .toLowerCase()
              .includes(yearFilter.toLowerCase())
          : true;

        let matchesType = true;
        if (selectedPeriod) {
          const createdAt = new Date(r.created_at);
          const now = new Date();
          switch (selectedPeriod) {
            case "Daily": {
              const yesterday = new Date(now);
              yesterday.setDate(now.getDate() - 1);
              matchesType = createdAt >= yesterday && createdAt <= now;
              break;
            }
            case "Weekly": {
              const weekAgo = new Date(now);
              weekAgo.setDate(now.getDate() - 7);
              matchesType = createdAt >= weekAgo && createdAt <= now;
              break;
            }
            case "Monthly": {
              const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              const endDate = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
              );
              matchesType = createdAt >= startDate && createdAt < endDate;
              break;
            }
            case "Yearly": {
              const yearAgo = new Date(now);
              yearAgo.setFullYear(now.getFullYear() - 1);
              matchesType = createdAt >= yearAgo && createdAt <= now;
              break;
            }
            default:
              matchesType = true;
          }
        }

        return matchesSearch && matchesStatus && matchesYear && matchesType;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [reviews, search, statusFilter, yearFilter, selectedPeriod]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <AdminDashboardTemplate>
      <div className="space-y-6">
        <Title
          title="Feedback Management"
          description="View and analyze all submitted course feedback from students."
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-gray-100 p-3 rounded-lg">
          <input
            type="text"
            placeholder="Search by teacher, course, student, or department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-4 rounded-md w-full md:w-1/3 text-sm"
          />

          <div className="flex gap-3 w-full md:w-auto">
            <CustomDropDown
              items={["Daily", "Weekly", "Monthly", "Yearly"]}
              placeholder="Select review period"
              selected={selectedPeriod}
              onChange={(value) => {
                setSelectedPeriod(
                  value === "Select review period" ? "" : value
                );
                setCurrentPage(1);
              }}
            />

            <CustomDropDown
              items={[
                ...new Set(reviews.map((r) => r.classroom.academic_year)),
              ]}
              placeholder="Sort by Academic Year"
              selected={yearFilter}
              onChange={(value) => {
                setYearFilter(value === "Sort by Academic Year" ? "" : value);
                setCurrentPage(1);
              }}
            />
            {/* Clear Filter Button */}
            {hasActiveFilter && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 underline text-nowrap hover:text-red-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorCard errorMessage={error} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-2xl">
              <thead className="bg-gray-200 text-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left">Review Id</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Teacher</th>
                  <th className="px-4 py-2 text-left">Class Rep</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Class Label</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {paginatedReviews.map((review) => {
                  const isOpen = openRowId === review.id;
                  return (
                    <React.Fragment key={review.id}>
                      <tr
                        onClick={() => toggleAccordion(review.id)}
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <td className="p-4 flex items-center gap-2">
                          {isOpen ? <HiChevronUp /> : <HiChevronDown />}
                          {review.id}
                        </td>
                        <td className="p-4">{review.lecture}</td>
                        <td className="p-4">{review.teacher_fullname}</td>
                        <td className="p-4">{review.user.name}</td>
                        <td className="p-4">{review.classroom.department}</td>
                        <td className="p-4">{review.classroom.class_label}</td>
                        <td className="p-4">
                          {new Date(review.created_at).toLocaleString()}
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={8} className="bg-gray-50 px-6 py-4">
                            <div className="border border-gray-100 bg-white p-4 rounded-xl space-y-3">
                              <h3 className="font-semibold text-gray-700 text-lg">
                                Feedback Details
                              </h3>
                              <p className="text-gray-700 leading-relaxed">
                                {review.review}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-sm">
                                <p>
                                  <strong>Semester:</strong> {review.semester}
                                </p>
                                <p>
                                  <strong>Class Period:</strong>{" "}
                                  {review.class_period}
                                </p>
                                <p>
                                  <strong>Start - End:</strong>{" "}
                                  {review.start_at} - {review.end_at}
                                </p>
                                <p>
                                  <strong>Academic Year:</strong>{" "}
                                  {review.classroom.academic_year}
                                </p>
                                <p>
                                  <strong>Student Email:</strong>{" "}
                                  {review.user.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {review.user.phone}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AdminDashboardTemplate>
  );
};

export default FeedbackManagement;
