// axios instance
import axios from "axios";

const createAxiosInstance = (accessToken?: string) => {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    timeout: 10000,
    headers,
    withCredentials: true,
  });
};

export default createAxiosInstance;
