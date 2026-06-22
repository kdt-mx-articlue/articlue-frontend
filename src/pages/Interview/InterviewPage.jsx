import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import interviewReportMock from "../../mocks/interviewReportMock";

import PageHero from "../../components/common/PageHero";

export default function InterviewPage() {
  const navigate =
    useNavigate();

  const maxScore =
    useMemo(() => {
      return Math.max(
        ...interviewReportMock.map(
          (item) =>
            item.scores
              .overall_score
        )
      ).toFixed(2);
    }, []);

  const usedCount =
    interviewReportMock.length;

  const freeRemain =
    Math.max(
      0,
      3 - usedCount
    );

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-8
      "
    >
      {/* Hero */}

      <PageHero
        badge="면접 준비"
        title="실전 면접을 통해 직무 적합도를 검증해보세요"
        description="기업별 맞춤 질문으로 면접을 진행하고 결과 리포트를 확인할 수 있습니다."
        statTitle="면접 최고 점수"
        statValue={`${maxScore}점`}
        statDescription="누적 면접 결과 중 최고 점수"
      />

      {/* 모의면접 시작 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <button
          onClick={() =>
            navigate(
              "/interview/setup"
            )
          }
          className="
            w-full
            rounded-2xl
            bg-blue-600
            py-5
            text-lg
            font-black
            text-white
          "
        >
          모의면접 시작
        </button>
      </section>

      {/* 이용 현황 */}

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div>
            <div
              className="
                text-sm
                text-slate-500
              "
            >
              면접 이용 현황
            </div>

            <div
              className="
                mt-2
                text-4xl
                font-black
              "
            >
              {usedCount}회
            </div>
          </div>

          <div
            className="
              text-right
            "
          >
            <div
              className="
                text-4xl
                font-black
                text-blue-600
              "
            >
              {freeRemain}/3
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              무료 면접 잔여 횟수
            </div>
          </div>
        </div>

        {freeRemain === 0 && (
          <div
            className="
              mt-6
              rounded-xl
              bg-amber-50
              p-4
              text-sm
              text-amber-700
            "
          >
            무료 면접 횟수를 모두
            사용했습니다.
            <br />
            다음 면접부터는
            코인 결제가 필요합니다.
          </div>
        )}
      </section>

      {/* 면접 기록 */}

      <section
        className="
          space-y-4
        "
      >
        <h2
          className="
            text-2xl
            font-black
          "
        >
          면접 기록
        </h2>

        {interviewReportMock.map(
          (item) => (
            <div
              key={
                item.interview_id
              }
              className="
                rounded-[28px]
                bg-white
                p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                <div>
                  <div
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    {
                      item.company_name
                    }
                  </div>

                  <div
                    className="
                      mt-2
                      text-slate-500
                    "
                  >
                    {item.job_name}
                  </div>
                </div>

                <div
                  className="
                    text-center
                  "
                >
                  <div
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    면접 점수
                  </div>

                  <div
                    className="
                      text-4xl
                      font-black
                      text-blue-600
                    "
                  >
                    {item.scores.overall_score.toFixed(
                      2
                    )}
                  </div>
                </div>

                <div
                  className="
                    text-center
                  "
                >
                  <div
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    면접 일시
                  </div>

                  <div
                    className="
                      font-black
                    "
                  >
                    {
                      item
                        .interview_summary
                        .interview_date
                    }
                  </div>
                </div>
              </div>

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-4
                "
              >
                <button
                  onClick={() =>
                    navigate(
                      `/interview-history/${item.job_posting_id}`
                    )
                  }
                  className="
                    flex-1
                    rounded-xl
                    border
                    py-4
                    font-black
                  "
                >
                  채팅 보기
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/interview-report/${item.job_posting_id}`
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
                  결과 보기
                </button>
              </div>
            </div>
          )
        )}
      </section>
    </div>
  );
}