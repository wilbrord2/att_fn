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

const ITEMS_PER_PAGE = 10;

const FeedbackManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<ClassReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [yearFilter, setYearFilter] = useState(searchParams.get("year") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

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

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (yearFilter) params.set("year", yearFilter);
    if (currentPage !== 1) params.set("page", currentPage.toString());
    router.replace(`?${params.toString()}`);
  }, [search, statusFilter, yearFilter, currentPage, router]);

  const toggleAccordion = (id: number) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          r.teacher_fullname.toLowerCase().includes(searchLower) ||
          r.lecture.toLowerCase().includes(searchLower) ||
          r.user.name.toLowerCase().includes(searchLower) ||
          r.classroom.department.toLowerCase().includes(searchLower);

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

        return matchesSearch && matchesStatus && matchesYear;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [reviews, search, statusFilter, yearFilter]);

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
            className="border px-3 py-2 rounded-md w-full md:w-1/3 text-sm"
          />

          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Sort by Status</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING">Pending</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Sort by Academic Year</option>
              {[...new Set(reviews.map((r) => r.classroom.academic_year))].map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
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
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Teacher</th>
                  <th className="px-4 py-2 text-left">Class_Rep</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Class lebel</th>
                  <th className="px-4 py-2 text-left">Class Status</th>
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
                        <td className="p-4 font-semibold">
                          {review.classroom.class_status === "APPROVED" ? (
                            <span className="text-green-600">APPROVED</span>
                          ) : review.classroom.class_status === "REJECTED" ? (
                            <span className="text-red-600">REJECTED</span>
                          ) : (
                            <span className="text-yellow-600">PENDING</span>
                          )}
                        </td>
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
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
