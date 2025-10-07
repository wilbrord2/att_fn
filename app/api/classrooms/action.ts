"use server";
import createAxiosInstance from "..";
import { cookies } from "next/headers";
import {
  Classroom,
  ClassroomsWithRepType,
  ClassroomType,
} from "@/app/utils/types/classRooms";
import { CreateClassFormValues } from "@/app/components/classrooms/createClassrooms";

export const GetAllClassRoomApi = async (): Promise<{
  success: boolean;
  data?: ClassroomsWithRepType;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get("/v1/class");
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

export const GetStudentClassApi = async (): Promise<{
  success: boolean;
  data?: ClassroomType;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get("/v1/class/my-class");
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

export const GetClassApi = async (
  classId: number
): Promise<{
  success: boolean;
  data?: { message: string; classroom: Classroom };
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get(`/v1/class/${classId}`);
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

export const CreateClassroomApi = async (
  classroomdata: CreateClassFormValues
): Promise<{
  success: boolean;
  data?: Classroom;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.post("/v1/class", classroomdata);
    const data = response.data;
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Creating classroom failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const ApproveClassroomApi = async (
  classId: number,
  type: string
): Promise<{ success: boolean; data?: Classroom; error?: string }> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.patch(`/v1/class/${type}/${classId}`);
    const data = response.data;

    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Updating classroom status failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const DeleteClassroomApi = async (
  classId: number
): Promise<{
  success: boolean;
  data?: Classroom;
  error?: { message: string };
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.delete(`/v1/class/${classId}`);
    const data = response.data;

    if (response.data) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        error: { message: response.statusText },
      };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
