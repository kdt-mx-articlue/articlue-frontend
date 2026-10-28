import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoverLetters } from "../../services/coverLetterService";
import { getSessions } from "../../services/interviewService";
import Carousel from "../common/Carousel";

export default function HistorySection() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("coverLetter");
  const [coverLetters, setCoverLetters] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    getCoverLetters().then(setCoverLetters).catch(console.error);
    getSessions().then(setInterviews).catch(console.error);
  }, []);

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

      {tab === "coverLetter" ? (
        coverLetters.length > 0 ? (
          coverLetters.map((item) => (
            <div
              key={item.coverLetterId}
              className="repeat-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/cover-letters/${item.coverLetterId}`)}
            >
              <strong>{item.companyName}</strong>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                {item.jobTitle}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("ko-KR")
                  : ""}
              </div>
            </div>
          ))
        ) : (
          <div className="repeat-card">생성된 자소서가 없습니다.</div>
        )
      ) : interviews.length > 0 ? (
        <Carousel
          items={interviews}
          renderItem={(item) => (
            <div
              className="repeat-card"
              style={{ marginBottom: 0, cursor: "pointer" }}
              onClick={() => navigate(`/interview/report/${item.interviewSessionId}`)}
            >
              <strong style={{ fontSize: "18px" }}>{item.companyName}</strong>
              <div style={{ marginTop: "4px", fontSize: "13px", color: "#64748b" }}>
                {item.jobName}
              </div>
              {item.totalScore != null && (
                <div style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}>
                  종합 점수:{" "}
                  <strong style={{ color: "#2563eb", fontSize: "20px" }}>
                    {Number(item.totalScore).toFixed(1)}점
                  </strong>
                </div>
              )}
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#94a3b8" }}>
                📅 {item.startTime
                  ? new Date(item.startTime).toLocaleDateString("ko-KR")
                  : ""}
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