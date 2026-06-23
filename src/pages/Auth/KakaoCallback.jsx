import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuthUser } from "../../utils/auth.js";
import { kakaoLoginApi } from "../../services/authApi.js";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      window.location.replace("/login");
      return;
    }

    kakaoLoginApi(code)
      .then((result) => {
        const user = result?.data || result;
        saveAuthUser({ ...user, loginType: "kakao" });

        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/home";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath, { replace: true });
      })
      .catch((error) => {
        console.error("카카오 로그인 실패:", error);
        window.location.replace("/login");
      });
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-[#0f172a]">
      <p className="text-lg font-black">카카오 로그인 처리 중...</p>
    </main>
  );
}