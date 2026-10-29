import axios from "axios";
import { clearAuthStorage, isAuthenticated } from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/",
  headers: {
    "Content-Type": "application/json",
  },
  // 로그인 세션은 httpOnly 쿠키(articlue_session)로 전달
  withCredentials: true,
  timeout: 0,
});

// 세션이 만료됐거나 없는데 화면은 로그인 상태로 알고 있으면 → 로그인 정보를 지우고 로그인 화면으로
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const unauthorized =
      error.response?.status === 401 &&
      error.response?.data?.code === "UNAUTHORIZED";

    if (unauthorized && isAuthenticated()) {
      clearAuthStorage();
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
