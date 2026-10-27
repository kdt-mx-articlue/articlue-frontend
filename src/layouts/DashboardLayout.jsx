import { Outlet, Navigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { isAuthenticated } from "../utils/auth";

export default function DashboardLayout() {
  if (!isAuthenticated()) {
    // 비로그인 방문자는 실제 사용 / 데모 체험 선택 화면부터 시작
    return <Navigate to="/start" replace />;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)", color: "var(--text-main)", transition: "background 0.3s, color 0.3s" }}>

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}