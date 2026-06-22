import { useMemo } from "react";

import { useResumeStore }
from "../../../store/resumeStore";

import {
  getResumeSectionStatus,
  getResumeProgress,
}
from "../../../utils/resumeStatus";

export default function ResumeHeader() {
  const resume =
    useResumeStore(
      (state) => state.resume
    );

  const progress =
    useMemo(() => {
      const status =
        getResumeSectionStatus(
          resume
        );

      return getResumeProgress(
        status
      );
    }, [resume]);

  return (
    <header className="topbar">
      <a
        href="/"
        className="logo"
      >
        Articlue.
      </a>

      <div className="topbar-center">
        <div className="save-status">
          자동 저장됨 ·{" "}
          <strong>
            {progress}% 완료
          </strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>
      </div>
    </header>
  );
}