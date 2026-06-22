import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getInterviewReport,
} from "../../services/interviewReportService";

export default function InterviewResultPage() {
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

  const {
    company_name,
    job_name,

    session_id,

    interview_summary,

    scores,

    strengths,

    weaknesses,

    overall_feedback,

    feedback,
  } = report;

  const durationMinute =
    Math.floor(
      interview_summary.duration_seconds /
        60
    );

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
          면접 결과 리포트
        </div>

        <h1
          className="
            mt-3
            text-3xl
            font-black
          "
        >
          {company_name}
        </h1>

        <p
          className="
            mt-2
            text-slate-500
          "
        >
          {job_name}
        </p>
      </section>

      {/* 총점 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
          text-center
        "
      >
        <div
          className="
            text-lg
            font-bold
            text-slate-500
          "
        >
          면접 총점
        </div>

        <div
          className="
            mt-3
            text-[72px]
            font-black
            text-blue-600
          "
        >
          {scores.overall_score.toFixed(
            2
          )}
          점
        </div>
      </section>

      {/* KPI */}

      <section
        className="
          grid
          gap-4
          md:grid-cols-5
        "
      >
        <StatCard
          title="논리성"
          value={`${scores.logic_score.toFixed(
            2
          )}점`}
        />

        <StatCard
          title="기술 이해도"
          value={`${scores.tech_understanding_score.toFixed(
            2
          )}점`}
        />

        <StatCard
          title="비즈니스 연결성"
          value={`${scores.business_link_score.toFixed(
            2
          )}점`}
        />

        <StatCard
          title="근거 활용도"
          value={`${scores.evidence_score.toFixed(
            2
          )}점`}
        />

        <StatCard
          title="직무 적합도"
          value={`${scores.job_fit_score.toFixed(
            2
          )}점`}
        />
      </section>

      {/* 면접 설정 정보 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <h2
          className="
            mb-6
            text-2xl
            font-black
          "
        >
          면접 설정 정보
        </h2>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >
          <InfoItem
            label="세션 ID"
            value={session_id}
          />

          <InfoItem
            label="기업"
            value={
              interview_summary.company_name
            }
          />

          <InfoItem
            label="직무"
            value={
              interview_summary.job_name
            }
          />

          <InfoItem
            label="난이도"
            value={
              interview_summary.difficulty
            }
          />

          <InfoItem
            label="면접관 성향"
            value={
              interview_summary.interviewer_type
            }
          />

          <InfoItem
            label="질문 수"
            value={`${interview_summary.question_count}개`}
          />

          <InfoItem
            label="면접 유형"
            value={
              interview_summary.interview_mode
            }
          />

          <InfoItem
            label="면접 일시"
            value={
              interview_summary.interview_date
            }
          />
        </div>
      </section>

      {/* 면접 통계 */}

      <section
        className="
          grid
          gap-6
          md:grid-cols-3
        "
      >
        <StatCard
          title="면접 시간"
          value={`${durationMinute}분`}
        />

        <StatCard
          title="대화 수"
          value={`${interview_summary.chat_log_count}개`}
        />

        <StatCard
          title="완료율"
          value={`${interview_summary.completion_rate}%`}
        />
      </section>

      {/* 세부 평가 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <h2
          className="
            mb-6
            text-2xl
            font-black
          "
        >
          세부 평가
        </h2>

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          {feedback.map((item) => (
            <div
              key={item.category}
              className="
                rounded-2xl
                border
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    text-lg
                    font-black
                  "
                >
                  {item.title}
                </div>

                <div
                  className="
                    text-xl
                    font-black
                    text-blue-600
                  "
                >
                  {item.score.toFixed(
                    2
                  )}
                  점
                </div>
              </div>

              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-slate-600
                "
              >
                {item.feedback}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 강점 / 취약점 */}

      <section
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >
        <div
          className="
            rounded-[28px]
            bg-white
            p-8
          "
        >
          <h2
            className="
              mb-6
              text-2xl
              font-black
            "
          >
            강점
          </h2>

          {strengths.map((item) => (
            <div
              key={item.title}
              className="
                mb-4
                rounded-xl
                border
                border-green-200
                bg-green-50
                p-5
              "
            >
              <div className="font-black">
                {item.title}
              </div>

              <p
                className="
                  mt-2
                  leading-7
                  text-slate-700
                "
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="
            rounded-[28px]
            bg-white
            p-8
          "
        >
          <h2
            className="
              mb-6
              text-2xl
              font-black
            "
          >
            보완 필요 사항
          </h2>

          {weaknesses.map((item) => (
            <div
              key={item.title}
              className="
                mb-4
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-5
              "
            >
              <div className="font-black">
                {item.title}
              </div>

              <p
                className="
                  mt-2
                  leading-7
                  text-slate-700
                "
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 종합 평가 */}

      <section
        className="
          rounded-[28px]
          border-l-8
          border-blue-600
          bg-blue-50
          p-8
        "
      >
        <h2
          className="
            mb-6
            text-2xl
            font-black
          "
        >
          종합 평가
        </h2>

        <p
          className="
            text-base
            leading-8
            text-slate-700
          "
        >
          {overall_feedback}
        </p>
      </section>

      {/* 버튼 */}

      <section
        className="
          flex
          flex-wrap
          gap-4
        "
      >
        <button
          onClick={() =>
            navigate("/interview")
          }
          className="
            flex-1
            rounded-xl
            border
            border-slate-300
            py-4
            font-black
          "
        >
          새 면접 보기
        </button>

        <button
          onClick={() =>
            navigate(
              `/interview-history/${jobPostingId}`
            )
          }
          className="
            flex-1
            rounded-xl
            border
            border-slate-300
            py-4
            font-black
          "
        >
          면접 채팅 기록 보기
        </button>

        <button
          onClick={() =>
            navigate(
              `/interview/setup/${jobPostingId}`
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
          해당 공고 면접 다시 보기
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

function StatCard({
  title,
  value,
}) {
  return (
    <div
      className="
        rounded-[28px]
        bg-white
        p-6
        text-center
      "
    >
      <div
        className="
          text-sm
          text-slate-500
        "
      >
        {title}
      </div>

      <div
        className="
          mt-3
          text-2xl
          font-black
          text-blue-600
        "
      >
        {value}
      </div>
    </div>
  );
}