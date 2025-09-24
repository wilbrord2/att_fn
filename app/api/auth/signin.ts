"use server";
import { cookies } from "next/headers";
import createAxiosInstance from "..";
import { LoginFormValues } from "@/app/page";

export const SigninApi = async (userData: LoginFormValues) => {
  const api = createAxiosInstance();
  try {
    const response = await api.post("/v1/auth/signin", userData);
    const data = response.data;
    const token = data.accessToken;
    (await cookies()).set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return { success: true, data: data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
