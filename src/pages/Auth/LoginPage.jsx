import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  login,
} from "../../services/authApi";

import {
  saveAuthUser,
} from "../../utils/auth";

import {
  githubAuthLogin,
} from "../../services/authApi";

import api from "../../api/axios";
import { useResumeStore } from "../../store/resumeStore";

import {
  SiKakaotalk,
  SiNaver,
  SiGithub,
  SiGoogle,
} from "react-icons/si";

export default function LoginPage() {
  const navigate = useNavigate();
  const setResumeId = useResumeStore((s) => s.setResumeId);

  const [loginId,
    setLoginId] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [toast,
    setToast] =
    useState("");

  const showToast = (
    message
  ) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  async function handleLogin(
    e
  ) {
    e.preventDefault();

    if (!loginId.trim()) {
      showToast(
        "아이디를 입력해주세요."
      );
      return;
    }

    if (!password) {
      showToast(
        "비밀번호를 입력해주세요."
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await login({
          loginId:
            loginId.trim(),
          password,
        });

      const user =
        data?.data ||
        data?.member ||
        data?.user ||
        data;

      saveAuthUser({
        ...user,
        loginType: "local",
      });

      // 이미 이력서가 있는 회원은 대시보드로, 없으면 이력서 작성 페이지로
      const memberId = user?.memberId ?? user?.member_id ?? user?.id ?? null;
      let hasResume = false;
      if (memberId) {
        try {
          const profileRes = await api.get("/member/profile", { params: { memberId } });
          const resumeId = profileRes.data?.data?.resume?.resumeId;
          if (resumeId) {
            setResumeId(resumeId);
            hasResume = true;
          }
        } catch {
          // 프로필 조회 실패해도 로그인은 유지
        }
      }
      navigate(hasResume ? "/" : "/resume");
    } catch (error) {
      console.error(
        error
      );

      showToast(
        "로그인에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKakaoLogin() {
    const clientId =
      import.meta.env
        .VITE_KAKAO_JS_KEY;

    const redirectUri =
      "http://localhost:5173/auth/kakao/callback";

    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`;
  }

  function handleNaverLogin() {
    const clientId =
      import.meta.env
        .VITE_NAVER_CLIENT_ID;

    const redirectUri =
      "http://localhost:5173/auth/naver/callback";

    const state =
      Math.random()
        .toString(36)
        .substring(2);

    localStorage.setItem(
      "naver_oauth_state",
      state
    );

    window.location.href =
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;
  }

  async function handleGithubLogin() {
    const redirectUri =
      "http://localhost:5173/auth/github/callback";

    const state =
      Math.random()
        .toString(36)
        .substring(2);

    localStorage.setItem(
      "github_oauth_state",
      state
    );

    try {
      const result =
        await githubAuthLogin({
          redirectUri,
          state,
        });

      const url =
        result
          ?.redirectUrl;

      if (url) {
        window.location.href =
          url;
      }
    } catch (error) {
      console.error(
        error
      );

      showToast(
        "GitHub 로그인 실패"
      );
    }
  }

  const inputClass =
    `
    h-14
    w-full
    rounded-2xl
    border
    border-slate-200
    bg-slate-100
    px-4
    outline-none
    focus:border-blue-600
  `;

  return (
    <>
      <main
        className="
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
          px-6
          py-12
        "
      >
        <section
          className="
            w-full
            max-w-[520px]
            rounded-[32px]
            border
            border-slate-200
            bg-white
            p-10
            shadow-sm
          "
        >
          <Link
            to="/"
            className="
              mb-4
              flex
              justify-center
              text-5xl
              font-black
              text-blue-600
              no-underline
            "
          >
            Articlue.
          </Link>

          <h1
            className="
              text-center
              text-4xl
              font-black
            "
          >
            로그인
          </h1>

          <p
            className="
              mt-4
              text-center
              text-slate-500
            "
          >
            로그인 후 AI 기반
            취업 분석 서비스를
            이용할 수 있습니다.
          </p>

          <form
            onSubmit={
              handleLogin
            }
            className="
              mt-10
              space-y-5
            "
          >
            <div>
              <label
                className="
                  mb-2
                  block
                  font-black
                "
              >
                회원 아이디
              </label>

              <input
                type="text"
                value={
                  loginId
                }
                onChange={(
                  e
                ) =>
                  setLoginId(
                    e.target
                      .value
                  )
                }
                placeholder="회원 아이디 입력"
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                className="
                  mb-2
                  block
                  font-black
                "
              >
                비밀번호
              </label>

              <input
                type="password"
                value={
                  password
                }
                onChange={(
                  e
                ) =>
                  setPassword(
                    e.target
                      .value
                  )
                }
                placeholder="비밀번호 입력"
                className={
                  inputClass
                }
              />
            </div>

            <button
              type="submit"
              disabled={
                loading
              }
              className="
                h-14
                w-full
                rounded-full
                bg-blue-600
                font-black
                text-white
              "
            >
              {loading
                ? "로그인 중..."
                : "로그인"}
            </button>
          </form>

          <div
            className="
              my-8
              flex
              items-center
              gap-3
              text-sm
              font-bold
              text-slate-500
              before:h-px
              before:flex-1
              before:bg-slate-200
              after:h-px
              after:flex-1
              after:bg-slate-200
            "
          >
            간편 로그인
          </div>

          <div
            className="
                mt-8
            "
            >
            <div
                className="
                flex
                items-center
                gap-4
                text-sm
                font-bold
                text-slate-500
                "
            >
                <div className="h-px flex-1 bg-slate-200" />

                <span>
                소셜 계정으로 계속하기
                </span>

                <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div
                className="
                mt-6
                flex
                justify-center
                gap-5
                "
            >
                <button
                type="button"
                onClick={handleKakaoLogin}
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                "
                >
                <SiKakaotalk
                    className="
                    text-[28px]
                    text-[#FEE500]
                    "
                />
                </button>

                <button
                type="button"
                onClick={handleNaverLogin}
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                "
                >
                <SiNaver
                    className="
                    text-[24px]
                    text-[#03C75A]
                    "
                />
                </button>

                <button
                type="button"
                onClick={() =>
                    showToast(
                    "구글 로그인 준비중"
                    )
                }
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                "
                >
                <SiGoogle
                    className="
                    text-[24px]
                    text-[#EA4335]
                    "
                />
                </button>

                <button
                type="button"
                onClick={handleGithubLogin}
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                "
                >
                <SiGithub
                    className="
                    text-[24px]
                    text-slate-900
                    "
                />
                </button>
            </div>
            </div>

          <div
            className="
              mt-8
              flex
              justify-center
              gap-2
            "
          >
            <span
              className="
                text-slate-500
              "
            >
              아직 회원이 아니신가요?
            </span>

            <Link
              to="/signup"
              className="
                font-black
                text-blue-600
                no-underline
              "
            >
              회원가입 하기
            </Link>
          </div>
        </section>

        <div
          className={`
            fixed
            bottom-8
            right-8
            rounded-full
            bg-slate-900
            px-5
            py-3
            text-white
            transition-all
            ${
              toast
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          {toast}
        </div>
      </main>
    </>
  );
}