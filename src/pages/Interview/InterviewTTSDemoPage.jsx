/**
 * InterviewTTSDemoPage
 * 백엔드 없이 TTS 면접 UI를 확인하는 데모 페이지
 * 경로: /interview/tts-demo
 */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArtiCharacter from "../../components/Arti/ArtiCharacter";

/* ═══════════════════════════════
   CSS 애니메이션
   ═══════════════════════════════ */
const STYLE = `
@keyframes artiFloat {
  0%   { transform: translateY(0px);   }
  50%  { transform: translateY(-14px); }
  100% { transform: translateY(0px);   }
}
@keyframes cubeRise {
  0%   { transform: translateY(0px)   rotate(0deg);  opacity: 0;  }
  12%  { opacity: 0.85; }
  80%  { opacity: 0.5; }
  100% { transform: translateY(-90px) rotate(50deg); opacity: 0;  }
}
@keyframes recordPulse {
  0%,100% { box-shadow: 0 0 0 0    rgba(239,68,68,0.6); }
  50%      { box-shadow: 0 0 0 14px rgba(239,68,68,0);  }
}
@keyframes ripple {
  0%   { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(2.5); opacity: 0;   }
}
`;

/* ═══════════════════════════════
   목업 면접 데이터
   ═══════════════════════════════ */
const MOCK_QUESTIONS = [
  {
    interviewQaId: 1,
    questionSetNo: 1,
    questionType: "TECH",
    questionContent: "Oracle DB 설계 시 데이터 정합성을 유지하기 위해 어떤 방법을 사용했는지 구체적인 사례를 들어 설명해 주실 수 있나요?",
  },
  {
    interviewQaId: 2,
    questionSetNo: 1,
    questionType: "FOLLOW_UP",
    questionContent: "Oracle 11g에서 IDENTITY 대신 시퀀스를 사용했을 때, 시퀀스 값과 기존 데이터의 PK 충돌은 어떻게 방지했는지 설명해 주실 수 있나요?",
  },
  {
    interviewQaId: 3,
    questionSetNo: 2,
    questionType: "TECH",
    questionContent: "트랜잭션 처리에서 commit과 rollback을 사용한 경험에 대해 말씀해 주실 수 있나요?",
  },
  {
    interviewQaId: 4,
    questionSetNo: 3,
    questionType: "TECH",
    questionContent: "RESTful API 설계 원칙을 실제 프로젝트에 어떻게 적용하셨나요? 구체적인 예시를 들어 설명해 주세요.",
  },
  {
    interviewQaId: 5,
    questionSetNo: 4,
    questionType: "TECH",
    questionContent: "대용량 데이터 처리 시 성능 최적화를 위해 어떤 방법을 사용하셨나요?",
  },
];

/* ═══════════════════════════════
   큐브 파티클
   ═══════════════════════════════ */
function CubeParticle({ delay, dx, size }) {
  return (
    <div style={{
      position:       "absolute",
      top:            "12px",
      left:           `calc(50% + ${dx}px)`,
      width:          size,
      height:         size,
      borderRadius:   "2px",
      background:     "rgba(96,232,255,0.75)",
      boxShadow:      "0 0 8px #60e8ff, 0 0 3px #a8f0ff",
      animation:      `cubeRise 2.6s ease-in infinite`,
      animationDelay: `${delay}s`,
      opacity:        0,
      pointerEvents:  "none",
    }} />
  );
}

/* 왼쪽 안테나(x≈70) / 오른쪽 안테나(x≈190) 기준 — size=240 center=120 */
const CUBES = [
  { delay: 0.0,  dx: -52, size: 7 },   // 왼
  { delay: 0.9,  dx: -59, size: 5 },   // 왼
  { delay: 1.8,  dx: -46, size: 8 },   // 왼
  { delay: 0.45, dx: +52, size: 6 },   // 오
  { delay: 1.35, dx: +59, size: 8 },   // 오
  { delay: 2.25, dx: +46, size: 5 },   // 오
];

/* ═══════════════════════════════
   상태 라벨 뱃지
   ═══════════════════════════════ */
const MOOD_LABELS = {
  idle:     { label: "대기",   color: "#94a3b8" },
  thinking: { label: "분석중", color: "#a78bfa" },
  question: { label: "질문",   color: "#38bdf8" },
  followup: { label: "꼬리질문", color: "#fb923c" },
  good:     { label: "좋은답변", color: "#34d399" },
  final:    { label: "면접완료", color: "#fbbf24" },
};

/* ═══════════════════════════════
   메인 데모 페이지
   ═══════════════════════════════ */
export default function InterviewTTSDemoPage() {
  const navigate = useNavigate();

  /* 시뮬레이션 상태 */
  const [phase, setPhase]           = useState("ready"); // ready | interviewing | finished
  const [qIndex, setQIndex]         = useState(0);
  const [mood, setMood]             = useState("idle");
  const [mouthOpen, setMouthOpen]   = useState(false);
  const [speaking, setSpeaking]     = useState(false);
  const [recording, setRecording]   = useState(false);
  const [recTime, setRecTime]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("면접 시작 버튼을 누르세요.");
  const [finishReady, setFinishReady] = useState(false);

  /* 데모 컨트롤 패널 표시 여부 */
  const [showPanel, setShowPanel] = useState(true);

  const mouthTimer = useRef(null);
  const recTimer   = useRef(null);

  /* CSS 주입 */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.id = "demo-tts-style";
    tag.textContent = STYLE;
    if (!document.getElementById("demo-tts-style")) document.head.appendChild(tag);
    return () => document.getElementById("demo-tts-style")?.remove();
  }, []);

  /* 아티 말하기 시뮬레이션 (3초) */
  function simulateSpeaking(newMood, ms = 3000) {
    return new Promise((resolve) => {
      setSpeaking(true);
      setMood(newMood);
      mouthTimer.current = setInterval(() => setMouthOpen((p) => !p), 175);
      setTimeout(() => {
        clearInterval(mouthTimer.current);
        setMouthOpen(false);
        setSpeaking(false);
        resolve();
      }, ms);
    });
  }

  /* 면접 시작 */
  async function startDemo() {
    setPhase("interviewing");
    setQIndex(0);
    setStatusText("아티가 질문을 읽고 있습니다...");
    await simulateSpeaking("question", 2500);
    setMood("idle");
    setStatusText("답변 준비가 되면 녹음 버튼을 누르세요.");
  }

  /* 녹음 시작 */
  function startRecording() {
    if (speaking || submitting) return;
    setRecording(true);
    setMood("idle");
    setRecTime(0);
    setStatusText("녹음 중... 답변을 말씀해 주세요.");
    recTimer.current = setInterval(() => setRecTime((t) => t + 1), 1000);
  }

  /* 녹음 중지 + 제출 시뮬레이션 */
  async function stopAndSubmit() {
    clearInterval(recTimer.current);
    setRecording(false);
    setSubmitting(true);
    setMood("thinking");
    setStatusText("답변을 분석하는 중...");

    /* 1.5초 후 다음 질문 */
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);

    const next = qIndex + 1;

    if (next >= MOCK_QUESTIONS.length) {
      /* 마지막 질문 완료 → 종료 */
      setMood("final");
      setFinishReady(true);
      setStatusText("모든 질문이 완료되었습니다!");
      return;
    }

    setQIndex(next);
    const q     = MOCK_QUESTIONS[next];
    const score = Math.floor(Math.random() * 30) + 70; // 70~99
    const m     = q.questionType === "FOLLOW_UP" ? "followup"
                : score >= 85                   ? "good"
                : "question";

    setStatusText("아티가 다음 질문을 읽고 있습니다...");
    await simulateSpeaking(m, 2200);
    setMood("idle");
    setStatusText("답변 준비가 되면 녹음 버튼을 누르세요.");
  }

  const currentQ = MOCK_QUESTIONS[qIndex];
  const totalQ   = MOCK_QUESTIONS.length;
  const pct      = Math.round((qIndex / totalQ) * 100);
  const recMin   = String(Math.floor(recTime / 60)).padStart(2, "0");
  const recSec   = String(recTime % 60).padStart(2, "0");
  const mInfo    = MOOD_LABELS[mood] ?? MOOD_LABELS.idle;

  /* ════════ 렌더 ════════ */
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 16px 60px" }}>
      {/* ── 다크 카드 ── */}
      <div style={{ width: "100%", maxWidth: "920px", background: "#050B1A", borderRadius: "28px", padding: "32px 40px 48px", boxShadow: "0 20px 60px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* ── 데모 배너 ── */}
      <div style={{
        width: "100%",
        background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.4)",
        borderRadius: "12px", padding: "10px 20px", marginBottom: "24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24" }}>
          🧪 데모 모드 — 백엔드 없이 UI를 확인합니다. 실제 마이크/API 연동은 없습니다.
        </span>
        <button onClick={() => navigate("/interview/tts")}
          style={{ fontSize: "12px", background: "transparent", border: "1px solid #fbbf24", borderRadius: "8px", padding: "4px 12px", color: "#fbbf24", cursor: "pointer", fontWeight: 700 }}>
          실제 페이지로
        </button>
      </div>

      {/* ── 헤더 ── */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.2em", color: "#22d3ee", marginBottom: "6px" }}>ARTI AI INTERVIEWER · VOICE</div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2 }}>네이버 · 백엔드 개발자</h1>
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>난이도 중</span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>친절형</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: finishReady ? "#10b981" : "#38bdf8" }}>
              {finishReady ? "✅ 면접 완료" : phase === "interviewing" ? `Q ${qIndex + 1} / ${totalQ}  ·  남은 질문 ${totalQ - qIndex - 1}` : `총 ${totalQ}문항`}
            </span>
          </div>
          <div style={{ marginTop: "10px", width: "280px", height: "4px", borderRadius: "9999px", background: "#1e293b", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "9999px", background: "linear-gradient(90deg,#38bdf8,#818cf8)", width: `${pct}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>
        <button onClick={() => navigate("/interview")} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", padding: "10px 20px", fontWeight: 900, fontSize: "13px", cursor: "pointer" }}>
          나가기
        </button>
      </div>

      {/* ── Arti 캐릭터 ── */}
      <div style={{ position: "relative", marginBottom: "8px" }}>
        {CUBES.map((c, i) => <CubeParticle key={i} delay={c.delay} dx={c.dx} size={c.size} />)}
        <div style={{ animation: "artiFloat 3.2s ease-in-out infinite" }}>
          <ArtiCharacter mood={mood} mouthOpen={mouthOpen} size={240} />
        </div>
        {/* 현재 표정 뱃지 */}
        <div style={{
          position: "absolute", bottom: "20px", right: "-70px",
          background: "rgba(0,0,0,0.6)", border: `1px solid ${mInfo.color}`,
          borderRadius: "8px", padding: "4px 10px",
          fontSize: "11px", fontWeight: 700, color: mInfo.color,
          whiteSpace: "nowrap",
        }}>
          {mInfo.label}
        </div>
        {/* PNG 하단 홀로그램 링과 이어지는 외부 발광 링 */}
        <div style={{ position: "absolute", bottom: "42px", left: "50%", transform: "translateX(-50%)", width: "214px", height: "46px", borderRadius: "50%", border: "1.5px solid rgba(96,232,255,0.5)", boxShadow: "0 0 18px rgba(96,232,255,0.35), 0 0 38px rgba(96,232,255,0.14)", pointerEvents: "none" }} />
      </div>

      {/* ── 상태 텍스트 ── */}
      <div style={{ marginBottom: "20px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: speaking ? "#22d3ee" : recording ? "#f87171" : "#94a3b8" }}>
        {speaking  && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />}
        {recording && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "recordPulse 0.8s ease infinite" }} />}
        {statusText}
        {recording && <span style={{ fontFamily: "monospace", color: "#f87171" }}>{recMin}:{recSec}</span>}
      </div>

      {/* ── 질문 카드 ── */}
      {phase === "interviewing" && currentQ && !finishReady && (
        <div style={{ width: "100%", maxWidth: "760px", background: "#0D162D", border: "1px solid rgba(96,232,255,0.2)", borderRadius: "24px", padding: "32px 36px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.15em", color: "#38bdf8" }}>ARTI 질문</span>
            {currentQ.questionType === "FOLLOW_UP" && (
              <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(251,146,60,0.15)", color: "#fb923c", borderRadius: "999px", padding: "2px 10px" }}>꼬리질문</span>
            )}
            <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(99,102,241,0.15)", color: "#818cf8", borderRadius: "999px", padding: "2px 10px" }}>Q{currentQ.questionSetNo}</span>
          </div>
          <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, lineHeight: 1.7, color: "#f1f5f9" }}>
            {currentQ.questionContent}
          </p>
        </div>
      )}

      {/* ── 시작 전 플레이스홀더 ── */}
      {phase === "ready" && (
        <div style={{ width: "100%", maxWidth: "760px", background: "#0D162D", border: "1px solid rgba(96,232,255,0.1)", borderRadius: "24px", padding: "32px 36px", marginBottom: "32px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "16px", color: "#475569" }}>면접 시작 버튼을 누르면 첫 질문이 표시됩니다.</p>
        </div>
      )}

      {/* ── 종료 버튼 ── */}
      {finishReady && (
        <div style={{ width: "100%", maxWidth: "520px", background: "#0a1628", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "20px", padding: "32px", textAlign: "center", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 900, color: "#10b981" }}>🎉 모든 질문이 완료되었습니다!</p>
          <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>면접을 종료하고 AI 결과 분석을 시작합니다.</p>
          <button onClick={() => { setPhase("ready"); setQIndex(0); setFinishReady(false); setMood("idle"); setStatusText("면접 시작 버튼을 누르세요."); }}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#2563eb,#4f46e5)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "15px", fontWeight: 900, cursor: "pointer" }}>
            데모 다시 시작
          </button>
        </div>
      )}

      {/* ── 녹음 컨트롤 ── */}
      {phase === "ready" && (
        <button onClick={startDemo} style={{ padding: "18px 48px", background: "linear-gradient(135deg,#0ea5e9,#6366f1)", border: "none", borderRadius: "16px", color: "#fff", fontSize: "16px", fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 30px rgba(14,165,233,0.35)" }}>
          ▶ 데모 면접 시작
        </button>
      )}

      {phase === "interviewing" && !finishReady && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            {recording && (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(239,68,68,0.22)", animation: "ripple 1.2s ease-out infinite" }} />
            )}
            <button
              onClick={recording ? stopAndSubmit : startRecording}
              disabled={speaking || submitting}
              style={{
                width: "80px", height: "80px", borderRadius: "50%", border: "none",
                cursor: (speaking || submitting) ? "not-allowed" : "pointer",
                background: recording ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "linear-gradient(135deg,#0ea5e9,#6366f1)",
                boxShadow: recording ? "0 8px 30px rgba(220,38,38,0.45)" : "0 8px 30px rgba(14,165,233,0.35)",
                animation: recording ? "recordPulse 0.9s ease infinite" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", zIndex: 1, transition: "background 0.2s",
                opacity: (speaking || submitting) ? 0.5 : 1,
              }}
            >
              {submitting ? (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M14 3 A11 11 0 0 1 25 14" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="0.8s" repeatCount="indefinite" />
                  </path>
                </svg>
              ) : recording ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                  <rect x="5" y="5" width="5" height="14" rx="1.5" />
                  <rect x="14" y="5" width="5" height="14" rx="1.5" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="9"  y1="22" x2="15" y2="22" />
                </svg>
              )}
            </button>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#475569", textAlign: "center" }}>
            {submitting ? "답변을 전송하는 중..." : speaking ? "아티가 질문을 읽는 중입니다..." : recording ? "버튼을 다시 누르면 답변이 제출됩니다" : "버튼을 눌러 답변을 녹음하세요"}
          </p>
        </div>
      )}

      {/* ════ 데모 컨트롤 패널 ════ */}
      <div style={{ width: "100%", maxWidth: "760px", marginTop: "40px" }}>
        <button onClick={() => setShowPanel((p) => !p)} style={{ background: "transparent", border: "1px solid #1e293b", borderRadius: "10px", padding: "8px 16px", color: "#475569", fontSize: "12px", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
          {showPanel ? "▲ 표정 테스트 패널 숨기기" : "▼ 표정 테스트 패널 열기"}
        </button>

        {showPanel && (
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px 24px" }}>
            <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, color: "#475569", letterSpacing: "0.1em" }}>표정 수동 전환</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {Object.entries(MOOD_LABELS).map(([key, { label, color }]) => (
                <button key={key} onClick={() => setMood(key)} style={{
                  padding: "8px 16px", borderRadius: "10px", border: `1px solid ${mood === key ? color : "#1e293b"}`,
                  background: mood === key ? `${color}22` : "transparent",
                  color: mood === key ? color : "#475569", fontWeight: 700, fontSize: "13px", cursor: "pointer",
                }}>
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: 700, color: "#475569", letterSpacing: "0.1em" }}>입 모양 테스트</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => { setSpeaking(true); mouthTimer.current = setInterval(() => setMouthOpen((p) => !p), 175); }} style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #22d3ee", background: speaking ? "rgba(34,211,238,0.15)" : "transparent", color: "#22d3ee", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                말하기 ON
              </button>
              <button onClick={() => { clearInterval(mouthTimer.current); setSpeaking(false); setMouthOpen(false); }} style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #475569", background: "transparent", color: "#475569", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                말하기 OFF
              </button>
            </div>
          </div>
        )}
      </div>
      </div>{/* ── /다크 카드 ── */}
    </div>
  );
}
