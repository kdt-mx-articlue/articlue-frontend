import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../pages/Dashboard/DashboardPage";

import MatchingPage from "../pages/Matching/MatchingPage";

import ReportPage from "../pages/Report/ReportPage";

import CoverLetterPage from "../pages/CoverLetter/CoverLetterPage";

import InterviewPage from "../pages/Interview/InterviewPage";

import InterviewSetupPage from "../pages/Interview/InterviewSetupPage";

import InterviewChatPage from "../pages/Interview/InterviewChatPage";

import InterviewTTSPage from "../pages/Interview/InterviewTTSPage";

import InterviewTTSDemoPage from "../pages/Interview/InterviewTTSDemoPage";

import InterviewResultPage from "../pages/Interview/InterviewResultPage";

import InterviewHistoryPage from "../pages/Interview/InterviewHistoryPage";

import SignupPage from "../pages/Auth/SignupPage";

import LoginPage from "../pages/Auth/LoginPage";

import KakaoCallback from "../pages/Auth/KakaoCallback";

import NaverCallback from "../pages/Auth/NaverCallback";

import GithubCallback from "../pages/Auth/GithubCallback";

import ResumePage from "../pages/Resume/ResumePage";

import ProfilePage from "../pages/Profile/ProfilePage";

import DemoSetupPage from "../pages/Demo/DemoSetupPage";

import CoverLetterListPage from "../pages/CoverLetter/CoverLetterPage";
import CoverLetterDetailPage from "../pages/CoverLetter/CoverLetterDetailPage";
import CoverLetterGeneratePage from "../pages/CoverLetter/CoverLetterGeneratePage";

const router = createBrowserRouter([
  /*
   =========================
   회원가입 (레이아웃 없음)
   =========================
  */
  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/auth/kakao/callback",
    element: <KakaoCallback />,
  },

  {
    path: "/auth/naver/callback",
    element: <NaverCallback />,
  },

  {
    path: "/auth/github/callback",
    element: <GithubCallback />,
  },

  {
    path: "/resume",
    element: <PrivateRoute><ResumePage /></PrivateRoute>,
  },

  {
    path: "/demo-setup",
    element: <DemoSetupPage />,
  },


  /*
   =========================
   대시보드 레이아웃 영역
   =========================
  */
  {
    element: <DashboardLayout />,

    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },

      {
        path: "/matching",
        element: <MatchingPage />,
      },

      {
        path: "/report/:jobPostingId",
        element: <ReportPage />,
      },

      {
        path: "/cover-letter/:jobPostingId",
        element: <CoverLetterPage />,
      },

      {
        path: "/mypage",
        element: <ProfilePage />,
      },

      /*
       =========================
       면접 메인
       =========================
      */

      {
        path: "/interview",
        element: <InterviewPage />,
      },

      /*
       =========================
       면접 설정
       =========================
      */

      {
        path: "/interview/setup",
        element: (
          <InterviewSetupPage />
        ),
      },

      {
        path: "/interview/setup/:jobPostingId",
        element: (
          <InterviewSetupPage />
        ),
      },

      /*
       =========================
       챗봇 면접
       =========================
      */

      {
        path: "/interview/chat",
        element: (
          <InterviewChatPage />
        ),
      },

      {
        path: "/interview/chat/:jobPostingId",
        element: (
          <InterviewChatPage />
        ),
      },

      /*
       =========================
       TTS 면접
       =========================
      */

      {
        path: "/interview/tts",
        element: (
          <InterviewTTSPage />
        ),
      },

      {
        path: "/interview/tts/:jobPostingId",
        element: (
          <InterviewTTSPage />
        ),
      },

      {
        path: "/interview/tts-demo",
        element: (
          <InterviewTTSDemoPage />
        ),
      },

      /*
       =========================
       면접 결과 리포트
       =========================
      */

      {
        path: "/interview-report/:jobPostingId",
        element: (
          <InterviewResultPage />
        ),
      },

      /*
       =========================
       면접 채팅 기록
       =========================
      */

      {
        path: "/interview-history/:jobPostingId",
        element: (
          <InterviewHistoryPage />
        ),
      },

      // 자소서 관리
      {
        path: "/cover-letters",
        element: <CoverLetterListPage />,
      },
      {
        path: "/cover-letters/generate",
        element: <CoverLetterGeneratePage />,
      },
      {
        path: "/cover-letters/:coverLetterId",
        element: <CoverLetterDetailPage />,
      },
    ],
  },
]);

export default function Router() {
  return (
    <RouterProvider
      router={router}
    />
  );
}