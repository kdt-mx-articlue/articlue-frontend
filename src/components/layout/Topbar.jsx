import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  getCurrentUser,
  clearAuthStorage,
} from "../../utils/auth";

export default function Topbar() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [isOpen, setIsOpen] =
    useState(false);

  const user =
    getCurrentUser();

  const userName =
    user?.name ||
    user?.nickname ||
    user?.login ||
    user?.loginId ||
    "사용자";

  const loginType =
    localStorage.getItem(
      "articlue_login_type"
    ) || "local";

  const profileInitial =
    userName.charAt(0).toUpperCase();

  const getPageTitle = () => {
    const path =
      location.pathname;

    if (path === "/") {
      return "AI 커리어 홈";
    }

    if (
      path.startsWith(
        "/matching"
      )
    ) {
      return "기업 탐색";
    }

    if (
      path.startsWith(
        "/report"
      )
    ) {
      return "기업 적합도 분석";
    }

    if (
      path.startsWith(
        "/interview"
      )
    ) {
      return "면접 준비";
    }

    if (
      path.startsWith(
        "/cover-letter"
      ) ||
      path.startsWith(
        "/cover-letters"
      )
    ) {
      return "자소서 관리";
    }

    if (
      path.startsWith(
        "/mypage"
      )
    ) {
      return "마이페이지";
    }

    if (
      path.startsWith(
        "/resume"
      )
    ) {
      return "커리어 프로필";
    }

    return "Articlue";
  };

  const pageTitle =
    getPageTitle();

  const handleLogout =
    () => {
      const confirmed =
        window.confirm(
          "로그아웃 하시겠습니까?"
        );

      if (!confirmed) {
        return;
      }

      clearAuthStorage();

      navigate("/login");
    };

  return (
    <header
      className="
        flex
        h-[72px]
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-8
      "
    >
      <h2
        className="
          text-[26px]
          font-black
          text-slate-900
        "
      >
        {pageTitle}
      </h2>

      <div className="relative">

        <button
          type="button"
          onClick={() =>
            setIsOpen(
              !isOpen
            )
          }
          className="
            flex
            items-center
            gap-4
          "
        >
          <div className="text-right">

            <div className="font-bold">
              {userName}
            </div>

            <div
              className="
                text-xs
                text-slate-400
              "
            >
              {loginType}
            </div>

          </div>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-blue-600
              text-sm
              font-black
              text-white
            "
          >
            {profileInitial}
          </div>

        </button>

        {isOpen && (
          <div
            className="
              absolute
              right-0
              top-14
              z-50
              w-[180px]
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-lg
            "
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/mypage");
              }}
              className="
                w-full
                px-4
                py-3
                text-left
                text-sm
                hover:bg-slate-100
              "
            >
              마이페이지
            </button>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                w-full
                border-t
                border-slate-100
                px-4
                py-3
                text-left
                text-sm
                font-semibold
                text-red-600
                hover:bg-red-50
              "
            >
              로그아웃
            </button>
          </div>
        )}

      </div>
    </header>
  );
}