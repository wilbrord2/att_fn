"use server";
import { ClassroomAnalytics, FeedbackAnalytics, StudentAnalytics } from "@/app/utils/types/analytics";
import createAxiosInstance from "..";
import { cookies } from "next/headers";

export const GetStudentDataApi = async (): Promise<{
  success: boolean;
  data?: StudentAnalytics;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get(
      "/v1/analytics/students/total-class-leaders"
    );
    const data = response.data;

    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Fetching analytics failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const GetClassroomDataApi = async (): Promise<{
  success: boolean;
  data?: ClassroomAnalytics;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get("/v1/analytics/classrooms/usage");
    const data = response.data;

    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Fetching analytics failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const GetFeedbackDataApi = async (
  period: string
): Promise<{
  success: boolean;
  data?: FeedbackAnalytics;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get(
      `/v1/analytics/reviews/usage?period=${period.toLocaleLowerCase()}`
    );
    const data = response.data;

    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Fetching analytics failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
