"use server";

import { SignupFormValues } from "@/app/signup/page";
import createAxiosInstance from "..";
import { cookies } from "next/headers";

export const SignupApi = async (userData: SignupFormValues) => {
  const api = createAxiosInstance("");
  try {
    const response = await api.post("/v1/auth/signup", userData);

    const data = response.data;

    if (response.data) {
      return { success: true, data: data };
    } else {
      return { success: false, error: "Signup failed" };
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
