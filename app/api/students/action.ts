"use server";
import { Student, StudentType } from "@/app/utils/types/student";
import createAxiosInstance from "..";
import { cookies } from "next/headers";

export const GetAllStudentApi = async (): Promise<{success: boolean;data?: StudentType;error?: string;}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get("/v1/student");
    const data = response.data;
  
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Fetching student failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const ApproveOrRejectApi = async (userId: number,type: string): Promise<{success: boolean;data?: Student;error?: string;}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.patch(`/v1/student/${type}/${userId}`);
    const data = response.data;
   
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Updating student failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const ChangeRoleApi = async (userId: number,): Promise<{success: boolean;data?: Student;error?: string;}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.patch(`/v1/student/change-role/${userId}`);
    const data = response.data;
  
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Updating user role failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const DeleteStudentApi = async (userId: number): Promise<{success: boolean;data?: Student;error?: string;}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.delete(`/v1/student/${userId}`);
    const data = response.data;
   
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Deleting student failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
