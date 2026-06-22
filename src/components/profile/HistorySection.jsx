import {
  useState,
} from "react";

export default function HistorySection({
  histories,
}) {
  const [
    tab,
    setTab,
  ] = useState(
    "coverLetter"
  );

  const coverLetters =
    histories?.coverLetters ||
    [];

  const interviews =
    histories?.interviews ||
    [];

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
      ) : interviews.length >
        0 ? (
        interviews.map(
          (item) => (
            <div
              key={
                item.interviewId
              }
              className="repeat-card"
            >
              <strong>
                {
                  item.companyName
                }
              </strong>

              <div>
                점수 :
                {" "}
                {
                  item.score
                }
              </div>
            </div>
          )
        )
      ) : (
        <div className="repeat-card">
          면접 기록이
          없습니다.
        </div>
      )}
    </section>
  );
}