import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, clearAuthStorage } from "../../utils/auth";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const user = getCurrentUser();
  const userName = user?.name || user?.nickname || user?.login || user?.loginId || "사용자";
  const loginType = localStorage.getItem("articlue_login_type") || "local";
  const profileInitial = userName.charAt(0).toUpperCase();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "AI 커리어 홈";
    if (path.startsWith("/matching")) return "기업 탐색";
    if (path.startsWith("/report")) return "기업 적합도 분석";
    if (path.startsWith("/interview")) return "면접 준비";
    if (path.startsWith("/cover-letter") || path.startsWith("/cover-letters")) return "자소서 관리";
    if (path.startsWith("/mypage")) return "마이페이지";
    if (path.startsWith("/resume")) return "커리어 프로필";
    return "Articlue";
  };

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;
    clearAuthStorage();
    navigate("/login");
  };

  return (
    <header
      className="flex h-[72px] items-center justify-between border-b px-8"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text-main)",
        transition: "background 0.3s, border-color 0.3s, color 0.3s",
      }}
    >
      <h2 className="text-[26px] font-black" style={{ color: "var(--text-main)" }}>
        {getPageTitle()}
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-4"
        >
          <div className="text-right">
            <div className="font-bold" style={{ color: "var(--text-main)" }}>{userName}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{loginType}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
            {profileInitial}
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 top-14 z-50 w-[180px] overflow-hidden rounded-2xl shadow-lg"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => { setIsOpen(false); navigate("/mypage"); }}
              className="w-full px-4 py-3 text-left text-sm transition"
              style={{ color: "var(--text-main)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-soft)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              마이페이지
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full border-t px-4 py-3 text-left text-sm font-semibold text-red-500 transition"
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-soft)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
