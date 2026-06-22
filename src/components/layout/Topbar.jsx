import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearAuthStorage,
  getCurrentUser,
  getLoginType,
} from "../../utils/auth";

export default function Topbar() {
  const navigate =
    useNavigate();

  const [open, setOpen] =
    useState(false);

  const user =
    getCurrentUser();

  const loginType =
    getLoginType();

  const userName =
    user?.name ||
    user?.nickname ||
    user?.login ||
    localStorage.getItem(
      "articlue_profile_name"
    ) ||
    "사용자";

  const profileText =
    userName.charAt(0);

  const handleLogout =
    () => {
      clearAuthStorage();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
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
        AI 커리어 홈
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpen(
              !open
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
            {profileText}
          </div>
        </button>

        {open && (
          <div
            className="
              absolute
              right-0
              top-14
              z-50
              w-56
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-lg
            "
          >
            <div
              className="
                border-b
                border-slate-100
                pb-3
              "
            >
              <div className="font-bold">
                {userName}
              </div>

              <div
                className="
                  text-sm
                  text-slate-500
                "
              >
                {loginType}
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                mt-3
                w-full
                rounded-lg
                border
                border-red-200
                px-3
                py-2
                text-sm
                font-bold
                text-red-600
                transition
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