import { useNavigate } from "react-router-dom";

export default function ResumeSection({
  resume,
}) {
  const navigate =
    useNavigate();

  const handleEditResume =
    () => {
      navigate("/resume");
    };

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>
            내 이력서
          </h2>

          <p>
            작성한 대표 이력서를
            확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="repeat-card">
        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color:
                "var(--text-sub)",
              marginBottom:
                "8px",
            }}
          >
            이력서 제목
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight:
                "700",
            }}
          >
            {resume
              ?.resumeTitle ||
              "등록된 이력서가 없습니다."}
          </div>
        </div>

        <div
          className="grid-2"
          style={{
            marginBottom:
              "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize:
                  "13px",
                color:
                  "var(--text-sub)",
                marginBottom:
                  "6px",
              }}
            >
              희망 직무
            </div>

            <div>
              {resume
                ?.desiredJob ||
                "-"}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize:
                  "13px",
                color:
                  "var(--text-sub)",
                marginBottom:
                  "6px",
              }}
            >
              최종 수정일
            </div>

            <div>
              {resume
                ?.updatedAt ||
                "-"}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={
            handleEditResume
          }
        >
          이력서 수정
        </button>
      </div>
    </section>
  );
}