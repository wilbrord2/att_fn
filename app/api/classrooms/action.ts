"use server";
import createAxiosInstance from "..";
import { cookies } from "next/headers";
import { Classroom, ClassroomType } from "@/app/utils/types/classRooms";
import { CreateClassFormValues } from "@/app/components/classrooms/createClassrooms";


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
