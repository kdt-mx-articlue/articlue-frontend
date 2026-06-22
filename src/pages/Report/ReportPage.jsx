import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import ReportRadarChart from "../../components/report/ReportRadarChart";

import { getReportData } from "../../services/reportService";

export default function ReportPage() {
  const navigate = useNavigate();

  const { jobPostingId } = useParams();

  const [report, setReport] =
    useState(null);

  useEffect(() => {
    async function load() {
      const data =
        await getReportData(
          jobPostingId
        );

      setReport(data);
    }

    load();
  }, [jobPostingId]);

  if (!report) {
    return <div>Loading...</div>;
  }

  const {
    resumeAnalysis,
    finalAnalysis,

    resumeActionPlan,
    finalActionPlan,
  } = report;

  const metricLabels = {
    business_fit:
      "비즈니스 핏",

    action_result_fit:
      "문제 해결",

    tech_stack_fit:
      "기술 스택",

    requirement_fit:
      "요구사항",

    culture_fit:
      "문화 적합도",
  };

  function handleInterviewReport() {
    if (!finalAnalysis) {
      alert(
        "아직 면접 결과가 없습니다.\n모의 면접을 먼저 진행해주세요."
      );

      return;
    }

    navigate(
      `/interview-report/${jobPostingId}`
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
      {/* 회사 정보 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-black
          "
        >
          {
            resumeAnalysis.company_name
          }
        </h1>

        <p
          className="
            mt-3
            text-slate-500
          "
        >
          {resumeAnalysis.job_name}
        </p>
      </section>

      {/* 점수 비교 */}

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
              mb-4
              text-xl
              font-black
            "
          >
            1차 직무 매칭률
          </h2>

          <div
            className="
              text-5xl
              font-black
              text-blue-600
            "
          >
            {resumeAnalysis.overall_score.toFixed(
              2
            )}
            %
          </div>

          <ReportRadarChart
            metrics={
              resumeAnalysis.metrics
            }
          />
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
              mb-4
              text-xl
              font-black
            "
          >
            2차 직무 적합도
          </h2>

          {finalAnalysis ? (
            <>
              <div
                className="
                  text-5xl
                  font-black
                  text-blue-600
                "
              >
                {finalAnalysis.overall_score.toFixed(
                  2
                )}
                %
              </div>

              <ReportRadarChart
                metrics={
                  finalAnalysis.metrics
                }
              />
            </>
          ) : (
            <div
              className="
                flex
                h-[320px]
                items-center
                justify-center
                text-center
                text-slate-500
                text-lg
                font-medium
              "
            >
              아직 면접 결과가
              없습니다.
              <br />
              모의 면접 완료 후
              생성됩니다.
            </div>
          )}
        </div>
      </section>

      {/* 분석 리포트 */}

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
              mb-8
              text-2xl
              font-black
            "
          >
            1차 분석 리포트
          </h2>

          {Object.entries(
            resumeAnalysis.metrics
          ).map(
            ([key, value]) => (
              <div
                key={key}
                className="
                  mb-8
                  border-b
                  pb-6
                "
              >
                <div
                  className="
                    text-lg
                    font-black
                  "
                >
                  {
                    metricLabels[
                      key
                    ]
                  }
                </div>

                <div
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-blue-600
                  "
                >
                  {Number(
                    value.score
                  ).toFixed(2)}
                  %
                </div>

                <p
                  className="
                    mt-3
                    text-base
                    leading-7
                    text-slate-600
                  "
                >
                  {
                    value.reason_text
                  }
                </p>
              </div>
            )
          )}
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
              mb-8
              text-2xl
              font-black
            "
          >
            2차 분석 리포트
          </h2>

          {finalAnalysis ? (
            Object.entries(
              finalAnalysis.metrics
            ).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="
                    mb-8
                    border-b
                    pb-6
                  "
                >
                  <div
                    className="
                      text-lg
                      font-black
                    "
                  >
                    {
                      metricLabels[
                        key
                      ]
                    }
                  </div>

                  <div
                    className="
                      mt-2
                      text-3xl
                      font-black
                      text-blue-600
                    "
                  >
                    {Number(
                      value.score
                    ).toFixed(2)}
                    %
                  </div>

                  <p
                    className="
                      mt-3
                      text-base
                      leading-7
                      text-slate-600
                    "
                  >
                    {
                      value.reason_text
                    }
                  </p>
                </div>
              )
            )
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                text-center
                text-slate-500
                text-lg
                font-medium
              "
            >
              모의 면접 완료 후
              생성됩니다.
            </div>
          )}
        </div>
      </section>

      {/* 취약점 */}

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
            1차 취약점
          </h2>

          {resumeActionPlan?.weaknesses?.map(
            (item) => (
              <div
                key={item.title}
                className="
                  mb-4
                  rounded-xl
                  border
                  p-5
                "
              >
                <div className="font-black">
                  {item.title}
                </div>

                <div
                  className="
                    mt-2
                    text-base
                    leading-7
                    text-slate-600
                  "
                >
                  {item.description}
                </div>
              </div>
            )
          )}
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
            2차 취약점
          </h2>

          {finalAnalysis ? (
            finalActionPlan?.weaknesses?.map(
              (item) => (
                <div
                  key={item.title}
                  className="
                    mb-4
                    rounded-xl
                    border
                    p-5
                  "
                >
                  <div className="font-black">
                    {item.title}
                  </div>

                  <div
                    className="
                      mt-2
                      text-base
                      leading-7
                      text-slate-600
                    "
                  >
                    {item.description}
                  </div>
                </div>
              )
            )
          ) : (
            <div
              className="
                flex
                h-[220px]
                items-center
                justify-center
                text-center
                text-slate-500
              "
            >
              모의 면접 완료 후
              생성됩니다.
            </div>
          )}
        </div>
      </section>

      {/* 액션 플랜 */}

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
            1차 추천 액션 플랜
          </h2>

          {resumeActionPlan?.recommendations?.map(
            (item) => (
              <div
                key={item.title}
                className="
                  mb-4
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50
                  p-5
                "
              >
                <div className="font-black">
                  {item.title}
                </div>

                <div
                  className="
                    mt-2
                    text-base
                    leading-7
                    text-slate-700
                  "
                >
                  {item.description}
                </div>
              </div>
            )
          )}
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
            2차 추천 액션 플랜
          </h2>

          {finalAnalysis ? (
            finalActionPlan?.recommendations?.map(
              (item) => (
                <div
                  key={item.title}
                  className="
                    mb-4
                    rounded-xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-5
                  "
                >
                  <div className="font-black">
                    {item.title}
                  </div>

                  <div
                    className="
                      mt-2
                      text-base
                      leading-7
                      text-slate-700
                    "
                  >
                    {item.description}
                  </div>
                </div>
              )
            )
          ) : (
            <div
              className="
                flex
                h-[220px]
                items-center
                justify-center
                text-center
                text-slate-500
              "
            >
              모의 면접 완료 후
              생성됩니다.
            </div>
          )}
        </div>
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
          면접 보러 가기
        </button>

        <button
          onClick={
            handleInterviewReport
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
          면접 결과 상세 보기
        </button>
      </section>
    </div>
  );
}