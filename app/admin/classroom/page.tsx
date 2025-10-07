"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminDashboardTemplate from "../AdminDashboardTemplate";
import Title from "@/app/components/titles/title";
import Loading from "@/app/loading";
import Pagination from "@/app/components/pagination";
import ErrorCard from "@/app/components/Form/error";
import {
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import {
  ApproveClassroomApi,
  DeleteClassroomApi,
  GetAllClassRoomApi,
} from "@/app/api/classrooms/action";
import { ClassroomWithRep } from "@/app/utils/types/classRooms";

const ITEMS_PER_PAGE = 10;

const ClassRoomManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [classrooms, setClassrooms] = useState<ClassroomWithRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomWithRep | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  // Filters with URL persistence
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [yearFilter, setYearFilter] = useState(searchParams.get("year") || "");

  useEffect(() => {
    handleGetAllClassrooms();
  }, []);

  // Update URL when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (yearFilter) params.set("year", yearFilter);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    router.replace(`?${params.toString()}`);
  }, [search, statusFilter, yearFilter, currentPage, router]);

  const handleGetAllClassrooms = async () => {
    setLoading(true);
    try {
      const result = await GetAllClassRoomApi();
      if (result && result.data?.classrooms)
        setClassrooms(result.data.classrooms);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id: number) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  const openModal = (type: string, classroom: ClassroomWithRep) => {
    setSelectedClassroom(classroom);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClassroom(null);
    setModalType("");
    setMessage("");
    setConfirming(false);
  };

  const handleAction = async () => {
    if (!selectedClassroom) return;
    setConfirming(true);

    try {
      if (modalType === "approve") {
        const result = await ApproveClassroomApi(
          selectedClassroom.id,
          "approve"
        );
        if (result.success) {
          setMessage("Classroom approved successfully");
          setClassrooms((prev) =>
            prev.map((c) =>
              c.id === selectedClassroom.id
                ? { ...c, class_status: "APPROVED" }
                : c
            )
          );
        }
      }

      if (modalType === "reject") {
        const result = await ApproveClassroomApi(
          selectedClassroom.id,
          "reject"
        );
        if (result.success) {
          setMessage("Classroom rejected");
          setClassrooms((prev) =>
            prev.map((c) =>
              c.id === selectedClassroom.id
                ? { ...c, class_status: "REJECTED" }
                : c
            )
          );
        }
      }

      if (modalType === "delete") {
        const result = await DeleteClassroomApi(selectedClassroom.id);

        if (result.success) {
          setMessage("Classroom deleted successfully");
          setClassrooms((prev) =>
            prev.filter((c) => c.id !== selectedClassroom.id)
          );
        } else {
          setMessage(result.error?.message || "Failed to Delete classroom");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Action failed. Please try again.");
    } finally {
      setConfirming(false);
      setTimeout(() => closeModal(), 3000);
    }
  };

  const Actions = [
    {
      title: "Approve",
      color: "border-green-600 text-green-600 hover:bg-green-600",
      icon: <HiOutlineCheck />,
      type: "approve",
    },
    {
      title: "Reject",
      color: "border-yellow-600 text-yellow-600 hover:bg-yellow-600",
      icon: <HiOutlineX />,
      type: "reject",
    },

    {
      title: "Delete",
      color: "border-red-600 text-red-600 hover:bg-red-600",
      icon: <HiOutlineTrash />,
      type: "delete",
    },
  ];

  const filteredClassrooms = useMemo(() => {
    return classrooms
      .filter((cls) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          cls.id.toString().includes(searchLower) ||
          cls.class_label?.toLowerCase().includes(searchLower) ||
          cls.department?.toLowerCase().includes(searchLower) ||
          cls.user?.id?.toString().includes(searchLower);

        const matchesStatus = statusFilter
          ? cls.class_status.toLowerCase() === statusFilter.toLowerCase()
          : true;

        const matchesYear = yearFilter
          ? cls.academic_year?.toLowerCase() === yearFilter.toLowerCase()
          : true;

        return matchesSearch && matchesStatus && matchesYear;
      })
      .sort((a, b) => {
        if (!yearFilter) return 0;
        return a.academic_year.localeCompare(b.academic_year);
      });
  }, [classrooms, search, statusFilter, yearFilter]);

  const totalPages = Math.ceil(filteredClassrooms.length / ITEMS_PER_PAGE);
  const paginatedClassrooms = filteredClassrooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <AdminDashboardTemplate>
      <div className="space-y-6">
        <Title
          title="List of Classrooms"
          description="Manage all classrooms — approve, edit, or delete."
        />

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-gray-100 p-3 rounded-lg">
          <input
            type="text"
            placeholder="Search by Class ID, Label, Student ID, Department..."
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
              {[...new Set(classrooms.map((c) => c.academic_year))].map(
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-2xl">
              <thead className="bg-gray-200 text-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left">Class Id</th>
                  <th className="px-4 py-2 text-left">Academic Year</th>
                  <th className="px-4 py-2 text-left">Year Level</th>
                  <th className="px-4 py-2 text-left">Intake</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Label</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedClassrooms.map((classroom) => {
                  const isOpen = openRowId === classroom.id;
                  return (
                    <React.Fragment key={classroom.id}>
                      <tr
                        onClick={() => toggleAccordion(classroom.id)}
                        className="cursor-pointer hover:bg-gray-100 transition font-light text-sm"
                      >
                        <td className="px-4 py-2 flex items-center gap-2">
                          <span>
                            {isOpen ? <HiChevronUp /> : <HiChevronDown />}
                          </span>
                          <span>{classroom.id}</span>
                        </td>
                        <td className="px-4 py-2">{classroom.academic_year}</td>
                        <td className="px-4 py-2">{classroom.year_level}</td>
                        <td className="px-4 py-2">{classroom.intake}</td>
                        <td className="px-4 py-2">{classroom.department}</td>
                        <td className="px-4 py-2">{classroom.class_label}</td>
                        <td className="px-4 py-2 font-semibold text-sm">
                          {classroom.class_status === "APPROVED" ? (
                            <span className="text-green-600">APPROVED</span>
                          ) : classroom.class_status === "REJECTED" ? (
                            <span className="text-red-600">REJECTED</span>
                          ) : (
                            <span className="text-yellow-600">PENDING</span>
                          )}
                        </td>
                        <td className="px-4 py-2 flex flex-col md:flex-row gap-2 justify-center items-center">
                          {Actions.map((action) => (
                            <button
                              key={action.type}
                              title={action.title}
                              className={`border ${action.color} hover:duration-300 transition-colors hover:text-white font-semibold text-nowrap text-sm p-2 rounded flex items-center gap-1 cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(action.type, classroom);
                              }}
                            >
                              {action.icon} {action.title}
                            </button>
                          ))}
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={9} className="bg-gray-50 px-4 py-4">
                            <div className="border border-gray-100 rounded-xl bg-white p-4 max-w-lg">
                              <h3 className="font-semibold text-lg mb-2 text-gray-700">
                                Class Representative Details
                              </h3>
                              <div className="space-y-1 text-sm text-gray-700">
                                <p>
                                  <strong>Name:</strong> {classroom.user?.name}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {classroom.user?.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong>{" "}
                                  {classroom.user?.phone}
                                </p>
                                <p>
                                  <strong>Role:</strong> {classroom.user?.role}
                                </p>
                                <p>
                                  <strong>Is Class Rep:</strong>{" "}
                                  {classroom.user?.is_class_representative
                                    ? "Yes"
                                    : "No"}
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

        {/* Confirmation Modal */}
        {modalOpen && selectedClassroom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                {modalType === "delete" && "Confirm Delete"}
                {modalType === "approve" && "Confirm Approve"}
                {modalType === "reject" && "Confirm Reject"}
              </h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to {modalType} classroom{" "}
                <span className="font-bold">
                  {`${selectedClassroom.year_level} ${selectedClassroom.department} ${selectedClassroom.class_label}`}
                </span>
                ?
              </p>
              {message && <ErrorCard errorMessage={message} />}
              <div className="flex justify-end space-x-2 text-sm font-semibold">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 cursor-pointer"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-500 text-white flex items-center gap-1 cursor-pointer"
                  onClick={handleAction}
                >
                  {confirming ? "Confirming..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardTemplate>
  );
};

export default ClassRoomManagement;
