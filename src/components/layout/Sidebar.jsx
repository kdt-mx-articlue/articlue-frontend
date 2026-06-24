import { HiHome, HiOfficeBuilding, HiChatAlt2, HiDocumentText, HiUser } from "react-icons/hi";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      className="sticky top-0 h-screen w-[260px] border-r"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="p-8">
        <h1 className="text-[28px] font-black text-blue-600">Articlue.</h1>
        <div
          className="mt-6 text-[11px] font-black uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Main Menu
        </div>
      </div>

      <nav className="px-4">
        <MenuItem to="/"              icon={<HiHome />}           label="홈" />
        <MenuItem to="/matching"      icon={<HiOfficeBuilding />} label="기업 탐색" />
        <MenuItem to="/interview"     icon={<HiChatAlt2 />}       label="면접 준비" />
        <MenuItem to="/cover-letters" icon={<HiDocumentText />}   label="자소서 관리" />
        <MenuItem to="/mypage"        icon={<HiUser />}           label="마이페이지" />
      </nav>
    </aside>
  );
}

function MenuItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className="mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-bold transition"
      style={({ isActive }) => ({
        background: isActive ? "var(--blue-50)" : "transparent",
        color: isActive ? "var(--blue-600, #2563eb)" : "var(--text-sub)",
      })}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
}
