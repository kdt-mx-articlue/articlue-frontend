import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getInterviewReport,
} from "../../services/interviewReportService";

export default function InterviewHistoryPage() {
  const navigate =
    useNavigate();

  const { jobPostingId } =
    useParams();

  const [report, setReport] =
    useState(null);

  useEffect(() => {
    async function load() {
      const data =
        await getInterviewReport(
          jobPostingId
        );

      setReport(data);
    }

    load();
  }, [jobPostingId]);

  if (!report) {
    return (
      <div
        className="
          flex
          h-[500px]
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-8
      "
    >
      {/* 헤더 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <div
          className="
            text-sm
            font-bold
            text-blue-600
          "
        >
          면접 채팅 기록
        </div>

        <h1
          className="
            mt-3
            text-3xl
            font-black
          "
        >
          {report.company_name}
        </h1>

        <p
          className="
            mt-2
            text-slate-500
          "
        >
          {report.job_name}
        </p>
      </section>

      {/* 면접 정보 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <div
          className="
            grid
            gap-4
            md:grid-cols-3
          "
        >
          <InfoItem
            label="세션 ID"
            value={
              report.session_id
            }
          />

          <InfoItem
            label="면접 일시"
            value={
              report
                .interview_summary
                .interview_date
            }
          />

          <InfoItem
            label="질문 수"
            value={`${report.interview_summary.question_count}개`}
          />
        </div>
      </section>

      {/* 대화 기록 */}

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
          면접 대화 기록
        </h2>

        {report.chat_history &&
        report.chat_history.length >
          0 ? (
          report.chat_history.map(
            (item) => (
              <div
                key={
                  item.interview_qa_id
                }
                className="
                  mb-10
                "
              >
                {/* 질문 */}

                <div
                  className="
                    rounded-2xl
                    bg-slate-100
                    p-5
                  "
                >
                  <div
                    className="
                      mb-2
                      text-sm
                      font-black
                      text-blue-600
                    "
                  >
                    {
                      item.interviewer_role
                    }
                  </div>

                  <div
                    className="
                      leading-7
                    "
                  >
                    {
                      item.question_content
                    }
                  </div>

                  <div
                    className="
                      mt-3
                      text-xs
                      text-slate-500
                    "
                  >
                    {
                      item.question_type
                    }

                    {item.follow_up_yn ===
                      "Y" &&
                      " · 꼬리질문"}
                  </div>
                </div>

                {/* 답변 */}

                <div
                  className="
                    mt-4
                    ml-12
                    rounded-2xl
                    bg-blue-50
                    p-5
                  "
                >
                  <div
                    className="
                      mb-2
                      text-sm
                      font-black
                      text-blue-600
                    "
                  >
                    지원자
                  </div>

                  <div
                    className="
                      leading-7
                    "
                  >
                    {
                      item.answer_content
                    }
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div
            className="
              py-20
              text-center
              text-slate-500
            "
          >
            저장된 면접
            대화 기록이
            없습니다.
          </div>
        )}
      </section>

      {/* 버튼 */}

      <section
        className="
          flex
          gap-4
        "
      >
        <button
          onClick={() =>
            navigate(
              `/interview-report/${jobPostingId}`
            )
          }
          className="
            flex-1
            rounded-xl
            bg-blue-600
            py-4
            font-black
            text-white
          "
        >
          면접 결과 보기
        </button>

        <button
          onClick={() =>
            navigate(
              `/report/${jobPostingId}`
            )
          }
          className="
            flex-1
            rounded-xl
            border
            border-blue-600
            py-4
            font-black
            text-blue-600
          "
        >
          기업 리포트 보기
        </button>
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        p-4
      "
    >
      <div
        className="
          text-sm
          text-slate-500
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          font-black
        "
      >
        {value}
      </div>
    </div>
  );
}