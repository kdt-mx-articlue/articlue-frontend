import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useResumeStore } from "../../../store/resumeStore";

import {
  getResumeSectionStatus,
  getResumeProgress,
} from "../../../utils/resumeStatus";

import {
  validateResume,
} from "../../../utils/resumeValidation";

export default function FloatingSubmitBar() {
  const navigate =
    useNavigate();

  const resume =
    useResumeStore(
      (state) => state.resume
    );

  const resetResume =
    useResumeStore(
      (state) => state.resetResume
    );

  const progress =
    useMemo(() => {
      const sectionStatus =
        getResumeSectionStatus(
          resume
        );

      return getResumeProgress(
        sectionStatus
      );
    }, [resume]);

  const handleSubmit =
    () => {
      const result =
        validateResume(
            resume
        );

        if (
        !result.valid
        ) {
        alert(
            `필수 항목이 누락되었습니다.\n\n${result.errors.join(
            "\n"
            )}`
        );

        return;
        }

      console.log(
        "최종 제출",
        resume
      );

      alert(
        "이력서가 제출되었습니다."
      );

      resetResume();

      localStorage.removeItem(
        "articlue-resume-store"
      );

      navigate(
        "/"
      );
    };

  return (
    <div
      className="floating-submit-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,

        zIndex: 999,

        background:
          "#ffffff",

        borderTop:
          "1px solid #e5e7eb",

        padding:
          "16px 24px",

        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        boxShadow:
          "0 -4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div>
        <div
          style={{
            fontSize:
              "14px",

            color:
              "#6b7280",
          }}
        >
          이력서 작성 진행률
        </div>

        <div
          style={{
            fontSize:
              "20px",

            fontWeight:
              "700",
          }}
        >
          {progress}%
        </div>
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={
          handleSubmit
        }
      >
        최종 제출
      </button>
    </div>
  );
}