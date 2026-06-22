import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageHero from "../../components/common/PageHero";

import resumeAnalysisMock from "../../mocks/resumeAnalysisMock";

export default function InterviewSetupPage() {
  const navigate =
    useNavigate();

  const { jobPostingId } =
    useParams();

  const [selectedCompany, setSelectedCompany] =
    useState("");

  const [selectedJobPostingId, setSelectedJobPostingId] =
    useState("");

  const [selectedJobName, setSelectedJobName] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("중");

  const [interviewerType, setInterviewerType] =
    useState("실무형");

  const [questionCount, setQuestionCount] =
    useState(10);

  const [interviewMode, setInterviewMode] =
    useState("CHATBOT");

  const companies = [
    ...new Set(
      resumeAnalysisMock.map(
        (item) =>
          item.company_name
      )
    ),
  ];

  const selectedCompanyJobs =
    resumeAnalysisMock.filter(
      (item) =>
        item.company_name ===
        selectedCompany
    );

  useEffect(() => {
    if (!jobPostingId) {
      return;
    }

    const target =
      resumeAnalysisMock.find(
        (item) =>
          item.job_posting_id ===
          Number(jobPostingId)
      );

    if (!target) {
      return;
    }

    setSelectedCompany(
      target.company_name
    );

    setSelectedJobPostingId(
      target.job_posting_id
    );

    setSelectedJobName(
      target.job_name
    );
  }, [jobPostingId]);

  function handleCompanyChange(
    companyName
  ) {
    setSelectedCompany(
      companyName
    );

    setSelectedJobPostingId("");

    setSelectedJobName("");
  }

  function handleJobChange(
    postingId
  ) {
    const target =
      resumeAnalysisMock.find(
        (item) =>
          item.job_posting_id ===
          Number(postingId)
      );

    if (!target) {
      return;
    }

    setSelectedJobPostingId(
      target.job_posting_id
    );

    setSelectedJobName(
      target.job_name
    );
  }

  function handleStartInterview() {
    if (
      !selectedCompany ||
      !selectedJobPostingId
    ) {
      alert(
        "기업 및 직무를 선택해주세요."
      );

      return;
    }

    const setupData = {
      company_name:
        selectedCompany,

      job_posting_id:
        Number(
          selectedJobPostingId
        ),

      job_name:
        selectedJobName,

      difficulty,

      interviewer_type:
        interviewerType,

      question_count:
        questionCount,

      interview_mode:
        interviewMode,

      started_at:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "interviewSetup",
      JSON.stringify(setupData)
    );

    if (
      interviewMode ===
      "CHATBOT"
    ) {
      navigate(
        "/interview/chat"
      );
    } else {
      navigate(
        "/interview/tts"
      );
    }
  }

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-10
      "
    >
      <PageHero
        badge="면접 준비"
        subBadge="면접 설정"
        title="실전 면접을 시작하기 전 조건을 설정하세요"
        description="기업별 맞춤 질문으로 모의 면접을 진행할 수 있습니다."
        statTitle="면접 준비"
        statValue="Ready"
        statDescription="설정 완료 후 면접 시작"
      />

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <h2
          className="
            mb-8
            text-2xl
            font-black
          "
        >
          면접 설정
        </h2>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >
          {/* 기업 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              기업
            </label>

            <select
              value={
                selectedCompany
              }
              disabled={
                !!jobPostingId
              }
              onChange={(e) =>
                handleCompanyChange(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value="">
                기업 선택
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={company}
                    value={
                      company
                    }
                  >
                    {company}
                  </option>
                )
              )}
            </select>
          </div>

          {/* 직무 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              직무
            </label>

            <select
              value={
                selectedJobPostingId
              }
              disabled={
                !!jobPostingId
              }
              onChange={(e) =>
                handleJobChange(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value="">
                직무 선택
              </option>

              {selectedCompanyJobs.map(
                (job) => (
                  <option
                    key={
                      job.job_posting_id
                    }
                    value={
                      job.job_posting_id
                    }
                  >
                    {job.job_name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* 난이도 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              난이도
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option>
                하
              </option>

              <option>
                중
              </option>

              <option>
                상
              </option>
            </select>
          </div>

          {/* 면접관 성향 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              면접관 성향
            </label>

            <select
              value={
                interviewerType
              }
              onChange={(e) =>
                setInterviewerType(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option>
                친절형
              </option>

              <option>
                실무형
              </option>

              <option>
                압박형
              </option>
            </select>
          </div>

          {/* 질문 수 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              질문 수
            </label>

            <select
              value={
                questionCount
              }
              onChange={(e) =>
                setQuestionCount(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value={5}>
                5문항
              </option>

              <option value={10}>
                10문항
              </option>

              <option value={15}>
                15문항
              </option>

              <option value={20}>
                20문항
              </option>
            </select>
          </div>

          {/* 유형 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              유형
            </label>

            <select
              value={
                interviewMode
              }
              onChange={(e) =>
                setInterviewMode(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value="CHATBOT">
                CHATBOT
              </option>

              <option value="TTS">
                TTS
              </option>
            </select>
          </div>
        </div>

        <button
          onClick={
            handleStartInterview
          }
          className="
            mt-10
            w-full
            rounded-xl
            bg-blue-600
            py-4
            text-lg
            font-black
            text-white
          "
        >
          모의 면접 시작
        </button>
      </section>
    </div>
  );
}