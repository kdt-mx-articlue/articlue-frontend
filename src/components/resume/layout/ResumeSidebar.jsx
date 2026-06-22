import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useResumeStore } from "../../../store/resumeStore";

import {
  getResumeSectionStatus,
  getResumeProgress,
} from "../../../utils/resumeStatus";

const REQUIRED_ITEMS = [
  {
    id: "section-github",
    label: "GitHub 연동",
    key: "github",
  },
  {
    id: "section-resume-info",
    label: "프로필 정보",
    key: "resumeInfo",
  },
  {
    id: "section-tech-stack",
    label: "기술 스택",
    key: "tech",
  },
  {
    id: "section-education",
    label: "학력 사항",
    key: "education",
  },
  {
    id: "section-experience",
    label: "활동 경험",
    key: "experience",
  },
  {
    id: "section-cover-letter",
    label: "자기소개서",
    key: "coverLetter",
  },
];

const OPTIONAL_ITEMS = [
  {
    id: "section-career",
    label: "경력 사항",
    key: "career",
  },
  {
    id: "section-certificate",
    label: "자격증",
    key: "certificate",
  },
  {
    id: "section-portfolio",
    label: "포트폴리오",
    key: "portfolio",
  },
];

export default function ResumeSidebar() {
  const resume =
    useResumeStore(
      (state) => state.resume
    );

  const sectionStatus =
    useMemo(
      () =>
        getResumeSectionStatus(
          resume
        ),
      [resume]
    );

  const progress =
    useMemo(
      () =>
        getResumeProgress(
          sectionStatus
        ),
      [sectionStatus]
    );

  const [
    activeSection,
    setActiveSection,
  ] = useState(
    "section-github"
  );

  useEffect(() => {
    const sections = [
      ...REQUIRED_ITEMS,
      ...OPTIONAL_ITEMS,
    ];

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                setActiveSection(
                  entry.target.id
                );
              }
            }
          );
        },
        {
          threshold: 0.3,
          rootMargin:
            "-100px 0px -50% 0px",
        }
      );

    sections.forEach(
      (section) => {
        const target =
          document.getElementById(
            section.id
          );

        if (target) {
          observer.observe(
            target
          );
        }
      }
    );

    return () =>
      observer.disconnect();
  }, []);

  const moveSection = (
    sectionId
  ) => {
    const target =
      document.getElementById(
        sectionId
      );

    if (!target) {
      return;
    }

    setActiveSection(
      sectionId
    );

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const renderStatus = (
    status
  ) => {
    if (
      status === "complete"
    ) {
      return (
        <span className="nav-complete">
          완료
        </span>
      );
    }

    if (
      status === "progress"
    ) {
      return (
        <span className="nav-progress">
          진행중
        </span>
      );
    }

    return (
      <span className="nav-empty">
        미완료
      </span>
    );
  };

  return (
    <aside className="resume-sidebar">
      <div className="resume-sidebar-title">
        이력서 작성 현황
      </div>

      <div className="resume-sidebar-progress">
        <strong>
          {progress}%
        </strong>
      </div>

      <div className="resume-nav">
        {REQUIRED_ITEMS.map(
          (item) => (
            <div
              key={item.id}
              className={`resume-nav-item ${
                activeSection ===
                item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                moveSection(
                  item.id
                )
              }
            >
              <span>
                {item.label}
              </span>

              {renderStatus(
                sectionStatus[
                  item.key
                ]
              )}
            </div>
          )
        )}

        <div className="resume-nav-divider" />

        <div className="resume-extra-title">
          선택 입력
        </div>

        {OPTIONAL_ITEMS.map(
          (item) => (
            <div
              key={item.id}
              className={`resume-nav-item ${
                activeSection ===
                item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                moveSection(
                  item.id
                )
              }
            >
              <span>
                {item.label}
              </span>

              {renderStatus(
                sectionStatus[
                  item.key
                ]
              )}
            </div>
          )
        )}
      </div>
    </aside>
  );
}