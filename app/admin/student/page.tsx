"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminDashboardTemplate from "../AdminDashboardTemplate";
import Title from "@/app/components/titles/title";
import {
  ApproveOrRejectApi,
  ChangeRoleApi,
  DeleteStudentApi,
  GetAllStudentApi,
} from "@/app/api/students/action";
import { Student, StudentType } from "@/app/utils/types/student";
import {
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePencil,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import Loading from "@/app/loading";
import Pagination from "@/app/components/pagination";
import ErrorCard from "@/app/components/Form/error";

const ITEMS_PER_PAGE = 10;

const StudentManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [students, setStudents] = useState<StudentType>();
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [repFilter, setRepFilter] = useState(searchParams.get("rep") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Fetch all students
  const handleGetAllStudents = async () => {
    try {
      setLoading(true);
      const result = await GetAllStudentApi();
      if (result.success) {
        setStudents(result.data);
      } else {
        setError("Failed to load students.");
      }
    } catch (err) {
      setError("Error fetching student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllStudents();
  }, []);

  // Update URL on filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    if (repFilter) params.set("rep", repFilter);
    if (currentPage !== 1) params.set("page", currentPage.toString());
    router.replace(`?${params.toString()}`);
  }, [search, roleFilter, repFilter, currentPage, router]);

  const toggleAccordion = (id: number) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  // Filtering logic
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.students.filter((s) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.phone.toLowerCase().includes(searchLower) ||
        s.role.toLowerCase().includes(searchLower);

      const matchesRole = roleFilter
        ? s.role.toLowerCase() === roleFilter.toLowerCase()
        : true;

      const matchesRep =
        repFilter === "yes"
          ? s.is_class_representative
          : repFilter === "no"
          ? !s.is_class_representative
          : true;

      return matchesSearch && matchesRole && matchesRep;
    });
  }, [students, search, roleFilter, repFilter]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modal handling
  const openModal = (type: string, student: Student) => {
    setSelectedStudent(student);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setModalType("");
    setMessage("");
    setConfirming(false);
  };

  // Handle actions (approve, reject, delete, role)
  const handleAction = async () => {
    if (!selectedStudent) return;
    setConfirming(true);
    try {
      if (modalType === "approve" || modalType === "reject") {
        const result = await ApproveOrRejectApi(
          selectedStudent.id,
          modalType.toLowerCase()
        );
        if (result.success) {
          setStudents((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              students: prev.students.map((stu) =>
                stu.id === selectedStudent.id
                  ? {
                      ...stu,
                      is_class_representative:
                        modalType === "approve" ? true : false,
                    }
                  : stu
              ),
            };
          });
          setMessage("Student status updated successfully.");
        }
      } else if (modalType === "delete") {
        const result = await DeleteStudentApi(selectedStudent.id);
        if (result.success) {
          setStudents((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              students: prev.students.filter(
                (stu) => stu.id !== selectedStudent.id
              ),
            };
          });
          setMessage("Student deleted successfully.");
        }
      } else if (modalType === "role") {
        const result = await ChangeRoleApi(selectedStudent.id);
        if (result.success) {
          setStudents((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              students: prev.students.map((stu) =>
                stu.id === selectedStudent.id
                  ? { ...stu, role: result.data?.role ?? stu.role }
                  : stu
              ),
            };
          });
          setMessage("Role changed successfully.");
        }
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred.");
    } finally {
      setConfirming(false);
      setTimeout(closeModal, 3000);
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
      title: "Update",
      color: "border-purple-600 text-purple-600 hover:bg-purple-600",
      icon: <HiOutlinePencil />,
      type: "update",
    },
    {
      title: "Delete",
      color: "border-red-600 text-red-600 hover:bg-red-600",
      icon: <HiOutlineTrash />,
      type: "delete",
    },
  ];

  return (
    <AdminDashboardTemplate>
      <div className="space-y-6">
        <Title
          title="Student Management"
          description="Manage INES students and class representative assignments."
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-gray-100 p-3 rounded-lg">
          <input
            type="text"
            placeholder="Search by name, email, role, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-md w-full md:w-1/3 text-sm"
          />

          <div className="flex gap-3 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Filter by Role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>

            <select
              value={repFilter}
              onChange={(e) => {
                setRepFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Filter by Class Rep</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Class Rep</th>
                  <th className="px-4 py-2 text-left">Change Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {paginatedStudents.map((student) => {
                  const isOpen = openRowId === student.id;
                  return (
                    <React.Fragment key={student.id}>
                      <tr
                        onClick={() => toggleAccordion(student.id)}
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2 flex items-center gap-2">
                          {isOpen ? <HiChevronUp /> : <HiChevronDown />}
                          {student.id}
                        </td>
                        <td className="px-4 py-2">{student.name}</td>
                        <td className="px-4 py-2">{student.email}</td>
                        <td className="px-4 py-2 capitalize">{student.role}</td>
                        <td className="px-4 py-2">
                          {student.is_class_representative ? (
                            <span className="text-green-600 font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="text-yellow-600 font-medium">
                              Not Yet
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="border border-blue-500 text-blue-500 p-2 rounded hover:bg-blue-500 hover:text-white transition flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal("role", student);
                            }}
                          >
                            <HiOutlineUser />
                            {student.role === "student"
                              ? "to Admin"
                              : "to Student"}
                          </button>
                        </td>
                        <td className="px-4 py-2 flex gap-2 justify-center">
                          {Actions.map((action) => (
                            <button
                              key={action.type}
                              className={`border ${action.color} hover:duration-300 transition-colors hover:text-white p-2 rounded flex items-center gap-1`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(action.type, student);
                              }}
                            >
                              {action.icon} {action.title}
                            </button>
                          ))}
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isOpen && (
                        <tr>
                          <td colSpan={7} className="bg-gray-50 px-6 py-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                              <h3 className="font-semibold text-gray-700 text-lg">
                                Student Details
                              </h3>
                              <p>
                                <strong>Email:</strong> {student.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {student.phone}
                              </p>
                              <p>
                                <strong>Role:</strong> {student.role}
                              </p>
                              <p>
                                <strong>Representative:</strong>{" "}
                                {student.is_class_representative ? "Yes" : "No"}
                              </p>
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

        {/* Modal */}
        {modalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Confirm {modalType}
              </h2>
              <p className="text-gray-600">
                Are you sure you want to{" "}
                {modalType === "role" ? "change the role of" : modalType}{" "}
                <span className="font-bold">{selectedStudent.name}</span>?
              </p>
              {message && <ErrorCard errorMessage={message} />}
              <div className="flex justify-end space-x-2 text-sm font-semibold">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-500 text-white flex items-center gap-1"
                  onClick={handleAction}
                >
                  {confirming ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardTemplate>
  );
};

export default StudentManagement;
