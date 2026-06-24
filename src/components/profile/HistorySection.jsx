import { useState } from "react";
import interviewReportMock from "../../mocks/interviewReportMock";
import Carousel from "../common/Carousel";

export default function HistorySection({ histories }) {
  const [tab, setTab] = useState("coverLetter");

  const coverLetters = histories?.coverLetters || [];

  // profile API 미연결이므로 더미 데이터 직접 사용
  const interviews = interviewReportMock;

  return (
    <section className="section">
      <div className="section-head">
        <h2>
          생성 기록
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom:
            "20px",
        }}
      >
        <button
          type="button"
          className={`chip ${
            tab ===
            "coverLetter"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setTab(
              "coverLetter"
            )
          }
        >
          자소서
        </button>

        <button
          type="button"
          className={`chip ${
            tab ===
            "interview"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setTab(
              "interview"
            )
          }
        >
          면접
        </button>
      </div>

      {tab ===
      "coverLetter" ? (
        coverLetters.length >
        0 ? (
          coverLetters.map(
            (item) => (
              <div
                key={
                  item.coverLetterId
                }
                className="repeat-card"
              >
                <strong>
                  {
                    item.companyName
                  }
                </strong>

                <div>
                  {
                    item.createdAt
                  }
                </div>
              </div>
            )
          )
        ) : (
          <div className="repeat-card">
            생성된
            자소서가
            없습니다.
          </div>
        )
      ) : interviews.length > 0 ? (
        <Carousel
          items={interviews}
          renderItem={(item) => (
            <div className="repeat-card" style={{ marginBottom: 0 }}>
              <strong style={{ fontSize: "18px" }}>{item.company_name}</strong>
              <div style={{ marginTop: "4px", fontSize: "13px", color: "#64748b" }}>
                {item.job_name}
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}>
                종합 점수:{" "}
                <strong style={{ color: "#2563eb", fontSize: "20px" }}>
                  {item.scores.overall_score.toFixed(2)}점
                </strong>
              </div>
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#94a3b8" }}>
                📅 {item.interview_summary?.interview_date?.replace("T", " ").slice(0, 16)}
              </div>
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#94a3b8" }}>
                난이도 {item.interview_summary?.difficulty} · {item.interview_summary?.interviewer_type}
              </div>
            </div>
          )}
        />
      ) : (
        <div className="repeat-card">면접 기록이 없습니다.</div>
      )}
    </section>
  );
}