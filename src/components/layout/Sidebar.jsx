import {
  HiHome,
  HiOfficeBuilding,
  HiChatAlt2,
  HiDocumentText,
  HiUser,
} from "react-icons/hi";

import {
  NavLink,
} from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      className="
        sticky
        top-0
        h-screen
        w-[260px]
        border-r
        border-slate-200
        bg-white
      "
    >
      <div className="p-8">

        <h1
          className="
            text-[28px]
            font-black
            text-blue-600
          "
        >
          Articlue.
        </h1>

        <div
          className="
            mt-6
            text-[11px]
            font-black
            uppercase
            tracking-widest
            text-slate-400
          "
        >
          Main Menu
        </div>

      </div>

      <nav className="px-4">

        <MenuItem
          to="/"
          icon={<HiHome />}
          label="홈"
        />

        <MenuItem
          to="/matching"
          icon={<HiOfficeBuilding />}
          label="기업 탐색"
        />

        <MenuItem
          to="/interview"
          icon={<HiChatAlt2 />}
          label="면접 준비"
        />

        <MenuItem
          to="/cover-letters"
          icon={<HiDocumentText />}
          label="자소서 관리"
        />

        <MenuItem
          to="/mypage"
          icon={<HiUser />}
          label="마이페이지"
        />

      </nav>
    </aside>
  );
}

function MenuItem({
  to,
  icon,
  label,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
          mb-2
          flex
          w-full
          items-center
          gap-3
          rounded-2xl
          px-4
          py-4
          text-left
          font-bold
          transition
          ${
            isActive
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-100"
          }
        `
      }
    >
      <span className="text-lg">
        {icon}
      </span>

      {label}
    </NavLink>
  );
}