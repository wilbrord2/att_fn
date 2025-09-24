"use client";
import React, { useEffect, useState } from "react";
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
} from "react-icons/hi";
import Loading from "@/app/loading";
import Pagination from "@/app/components/pagination";
import ErrorCard from "@/app/components/Form/error";

const ITEMS_PER_PAGE = 10;

const StudentManagement = () => {
  const [students, setStudents] = useState<StudentType>();
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    handleGetAllStudents();
  }, []);

  const handleGetAllStudents = async () => {
    setLoading(true);
    const result = await GetAllStudentApi();
    if (result.success) setStudents(result.data);
    setLoading(false);
  };

  const openModal = (type: string, student: any) => {
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

  const handleAction = async () => {
    if (!selectedStudent) return;
    setConfirming(true);

    if (
      modalType.toLocaleLowerCase() === "approve" ||
      modalType.toLocaleLowerCase() === "reject"
    ) {
      try {
        const result = await ApproveOrRejectApi(
          selectedStudent.id,
          modalType.toLocaleLowerCase()
        );

        if (result.success) {
          setConfirming(false);
          setMessage("Student Status Updated Successfully");
          setStudents((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              students: prev.students.map((stu) =>
                stu.id === selectedStudent.id
                  ? {
                      ...stu,
                      is_class_representative:
                        modalType.toLowerCase() === "approve" ? true : false,
                    }
                  : stu
              ),
            };
          });
        }
      } catch (error: any) {
        setMessage(error);
      }
    }
    if (modalType.toLocaleLowerCase() === "delete") {
      try {
        const result = await DeleteStudentApi(selectedStudent.id);
        if (result.success) {
          setConfirming(false);
          setMessage("Student Deleted Successfully");
          setStudents((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              students: prev.students.filter(
                (stu) => stu.id !== selectedStudent.id
              ),
            };
          });
        }
      } catch (error: any) {
        setMessage(error);
      }
    }
    if (modalType.toLocaleLowerCase() === "role") {
      try {
        const result = await ChangeRoleApi(selectedStudent.id);
        if (result.success) {
          setConfirming(false);
          setMessage("Student Role Updated Successfully");
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
        }
      } catch (error: any) {
        setMessage(error);
      }
    }
    const timer = setTimeout(() => {
      closeModal();
    }, 4000);
    return () => clearTimeout(timer);
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

  const totalPages = students
    ? Math.ceil(students.students.length / ITEMS_PER_PAGE)
    : 1;

  const paginatedStudents = students
    ? students.students.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : [];

  return (
    <AdminDashboardTemplate>
      <div className="space-y-6">
        <Title
          title="List of Students"
          description="Manage all INES students class Representative"
        />

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-2xl">
              <thead className="py-4 bg-gray-200 text-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Class_Rep_Status</th>
                  <th className="px-4 py-2 text-left">Change_Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="">
                    <td className="px-4 py-2">{student.id}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">{student.phone}</td>
                    <td className="px-4 py-2">{student.role}</td>
                    <td className="px-4 py-2 text-center">
                      {student.is_class_representative ? (
                        <span className="text-green-800 font-bold"> Yes</span>
                      ) : (
                        <span className="text-yellow-600 font-bold">
                          {" "}
                          Not Yet
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        title="Change Role"
                        className="border border-blue-500  hover:duration-300 transition-colors text-blue-500 p-2 text-nowrap rounded text-sm font-semibold flex items-center gap-1 cursor-pointer hover:bg-blue-500 hover:text-white hover:border-blue-500"
                        onClick={() => openModal("role", student)}
                      >
                        <HiOutlineUser />{" "}
                        {student.role.toLocaleLowerCase() === "student"
                          ? "to Admin"
                          : "to Student"}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex flex-col md:flex-row gap-2 justify-center items-center">
                      {Actions.map((action) => (
                        <button
                          key={action.type}
                          title={action.title}
                          className={`border ${action.color} hover:duration-300 transition-colors  hover:text-white hover:border-slate-500  font-semibold text-nowrap text-sm p-2 rounded flex items-center gap-1 cursor-pointer`}
                          onClick={() => openModal(action.type, student)}
                        >
                          {action.icon} {action.title}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Confirmation Modal */}
        {modalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                {modalType === "delete" && "Confirm Delete"}
                {modalType === "approve" && "Confirm Approve"}
                {modalType === "reject" && "Confirm Reject"}
                {modalType === "role" && "Confirm Role Change"}
              </h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to{" "}
                {modalType === "role" ? "change role of" : modalType}{" "}
                <span className="font-bold">{selectedStudent.name}</span>?
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
                  {confirming ? "Confirming.." : "Confirm"}
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
