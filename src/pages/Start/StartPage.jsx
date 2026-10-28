import { useNavigate } from "react-router-dom";

const CHOICES = [
  {
    key: "real",
    path: "/login",
    icon: "🔐",
    title: "실제 사용하기",
    desc: "로그인하거나 회원가입하고\n내 이력서로 서비스를 이용합니다.",
    cta: "로그인 / 회원가입 →",
    color: "#2563eb",
  },
  {
    key: "demo",
    path: "/demo-setup",
    icon: "✨",
    title: "데모로 체험하기",
    desc: "회원가입 없이 직군별 샘플 이력서로\n주요 기능을 바로 체험합니다.",
    cta: "데모 시작하기 →",
    color: "#16a34a",
  },
];

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8faff 0%, #f0fdf4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: "14px",
            lineHeight: 1.2,
          }}
        >
          Articlue 시작하기
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8 }}>
          이력서 한 번 입력으로 기업 매칭 · 자소서 생성 · AI 모의 면접까지
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "640px",
        }}
      >
        {CHOICES.map((choice) => (
          <button
            key={choice.key}
            type="button"
            onClick={() => navigate(choice.path)}
            style={{
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "28px",
              padding: "36px 28px 28px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = choice.color;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>{choice.icon}</div>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "10px" }}>
              {choice.title}
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                marginBottom: "24px",
              }}
            >
              {choice.desc}
            </p>
            <div
              style={{
                background: choice.color,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                padding: "13px",
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              {choice.cta}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
