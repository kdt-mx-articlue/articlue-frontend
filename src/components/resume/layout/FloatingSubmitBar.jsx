import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useResumeStore } from "../../../store/resumeStore";
import LoadingOverlay from "../../common/LoadingOverlay";

import {
  getResumeSectionStatus,
  getResumeProgress,
} from "../../../utils/resumeStatus";

import {
  validateResume,
} from "../../../utils/resumeValidation";

import { submitResume } from "../../../services/resumeApi";

export default function FloatingSubmitBar() {
  const navigate =
    useNavigate();

  const [submitting, setSubmitting] =
    useState(false);

  const resume =
    useResumeStore(
      (state) => state.resume
    );

  const resetResume =
    useResumeStore(
      (state) => state.resetResume
    );

  const setResumeId =
    useResumeStore(
      (state) => state.setResumeId
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
    async () => {
      const result =
        validateResume(resume);

      if (!result.valid) {
        alert(
          `필수 항목이 누락되었습니다.\n\n${result.errors.join("\n")}`
        );
        return;
      }

      try {
        setSubmitting(true);

        const res = await submitResume(resume);

        alert("이력서가 제출되었습니다.");

        // 폼 초기화 후, resumeId만 다시 저장 (추천기업 조회에 필요)
        resetResume();
        const resumeId = res?.data?.resumeId;
        if (resumeId) {
          setResumeId(resumeId);
        }

        navigate("/");

      } catch (error) {
        console.error("이력서 제출 실패:", error);
        const message =
          error?.response?.data?.message ||
          "이력서 제출에 실패했습니다. 다시 시도해주세요.";
        alert(message);

      } finally {
        setSubmitting(false);
      }
    };

  return (
    <>
    {submitting && <LoadingOverlay />}
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
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "제출 중..." : "최종 제출"}
      </button>
    </div>
    </>
  );
}