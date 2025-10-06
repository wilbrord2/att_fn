"use server";
import { Review, ReviewsType } from "@/app/utils/types/review";
import createAxiosInstance from "..";
import { cookies } from "next/headers";
import { CreateReviewFormValues } from "@/app/components/reviews/createreviewsForm";
import { EditReviewFormValues } from "@/app/components/reviews/editReview";

export const GetClassReviewsApi = async (
  classId: number
): Promise<{
  success: boolean;
  data?: ReviewsType;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get(`/v1/reviews/my-class/${classId}`);
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
export const GetReviewApi = async (
  reviewId: number
): Promise<{
  success: boolean;
  data?: Review;
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.get(`/v1/reviews/${reviewId}`);
    const data = response.data;

    if (response.data) {
      return { success: true, data: data.review };
    } else {
      return { success: false, error: "Fetching student failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const CreateReviewApi = async (
  reviewdata: CreateReviewFormValues,
  classId?: number
): Promise<{
  success: boolean;
  data?: Review;
  error?: { message: string };
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.post(`/v1/reviews/${classId}`, reviewdata);
    console.log({ reviewdata, response });
    const data = response.data;
    console.log({ data });
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: {message:response.statusText} };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const EditReviewApi = async (
  reviewdata: EditReviewFormValues,
  classId?: number
): Promise<{
  success: boolean;
  data?: { message: string; reviw: Review };
  error?: string;
}> => {
  const token = (await cookies()).get("accessToken")?.value;
  const api = createAxiosInstance(token);
  try {
    const response = await api.patch(`/v1/reviews/${classId}`, reviewdata);
    const data = response.data;
    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Creating review failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
