import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  startInterview,
  submitVoiceAnswer,
  finishInterview,
} from "../../services/interviewService";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import ArtiCharacter from "../../components/Arti/ArtiCharacter";

/* ════════════════════════════════════════════
   CSS 애니메이션 주입
   ════════════════════════════════════════════ */
const STYLE = `
@keyframes artiFloat {
  0%   { transform: translateY(0px);    }
  50%  { transform: translateY(-14px);  }
  100% { transform: translateY(0px);    }
}
@keyframes cubeRise {
  0%   { transform: translateY(0px)   rotate(0deg);   opacity: 0;   }
  12%  { opacity: 0.85; }
  80%  { opacity: 0.5;  }
  100% { transform: translateY(-90px) rotate(50deg);  opacity: 0;   }
}
@keyframes recordPulse {
  0%,100% { box-shadow: 0 0 0 0   rgba(239,68,68,0.6); }
  50%      { box-shadow: 0 0 0 14px rgba(239,68,68,0);   }
}
@keyframes ripple {
  0%   { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(2.5); opacity: 0;    }
}
`;

/* ════════════════════════════════════════════
   오디오 유틸
   ════════════════════════════════════════════ */
function decodeAndPlayAudio(base64, mimeType = "audio/mpeg") {
  return new Promise((resolve, reject) => {
    try {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const blob  = new Blob([bytes], { type: mimeType });
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
      audio.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      audio.play().catch(reject);
    } catch (e) { reject(e); }
  });
}

/* ════════════════════════════════════════════
   큐브 파티클 (안테나에서 올라오는 미니 큐브)
   ════════════════════════════════════════════ */
function CubeParticle({ delay, dx, size }) {
  return (
    <div style={{
      position:       "absolute",
      top:            "12px",        /* arti-base.png 안테나 높이 기준 */
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

/* 왼쪽 안테나(x≈70) / 오른쪽 안테나(x≈190) 기준 — size=260 center=130 */
const CUBES = [
  { delay: 0.0,  dx: -58, size: 7 },   // 왼
  { delay: 0.9,  dx: -65, size: 5 },   // 왼
  { delay: 1.8,  dx: -52, size: 8 },   // 왼
  { delay: 0.45, dx: +58, size: 6 },   // 오
  { delay: 1.35, dx: +65, size: 8 },   // 오
  { delay: 2.25, dx: +52, size: 5 },   // 오
];

/* ════════════════════════════════════════════
   메인 페이지
   ════════════════════════════════════════════ */
export default function InterviewTTSPage() {
  const navigate = useNavigate();

  const setup = (() => {
    try { return JSON.parse(localStorage.getItem("interviewSetup") || "{}"); }
    catch { return {}; }
  })();
  const { company_name, job_name, difficulty, interviewer_type, question_count, job_posting_id } = setup;

  /* ── 상태 ── */
  const [sessionId,     setSessionId]     = useState(null);
  const [currentQaId,   setCurrentQaId]   = useState(null);
  const [questionText,  setQuestionText]  = useState("");
  const [questionType,  setQuestionType]  = useState("");
  const [questionSetNo, setQuestionSetNo] = useState(1);
  const [progress,      setProgress]      = useState(null);

  const [mood,          setMood]          = useState("idle");
  const [speaking,      setSpeaking]      = useState(false);
  const [mouthOpen,     setMouthOpen]     = useState(false);

  const [recording,     setRecording]     = useState(false);
  const [recTime,       setRecTime]       = useState(0);

  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [finishReady,   setFinishReady]   = useState(false);
  const [finishing,     setFinishing]     = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [initError,     setInitError]     = useState(null);
  const [statusText,    setStatusText]    = useState("면접을 시작하는 중...");

  /* ── refs ── */
  const initializedRef   = useRef(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const streamRef        = useRef(null);
  const recTimerRef      = useRef(null);
  const mouthTimerRef    = useRef(null);

  /* ── CSS 주입 ── */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.id      = "arti-tts-style";
    tag.textContent = STYLE;
    if (!document.getElementById("arti-tts-style")) {
      document.head.appendChild(tag);
    }
    return () => { document.getElementById("arti-tts-style")?.remove(); };
  }, []);

  /* ── 면접 초기화 ── */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initInterview() {
    try {
      setLoading(true);
      setStatusText("면접을 시작하는 중...");
      const res = await startInterview(setup);

      if (!res?.success || !res?.data) {
        setInitError("면접 시작에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const { interviewSessionId, question, progress: prog } = res.data;
      setSessionId(interviewSessionId);
      setProgress(prog);
      applyQuestion(question, "question");

      /* VOICE: 첫 질문 자동 재생 */
      if (question?.audio?.audioBase64) {
        await playArti(question.audio.audioBase64, question.audio.mimeType, "question");
      } else {
        setMood("question");
        setStatusText("답변 준비가 되면 녹음 버튼을 누르세요.");
      }
    } catch (err) {
      console.error("면접 시작 실패:", err);
      setInitError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function applyQuestion(question, forceMood) {
    if (!question) return;
    setQuestionText(question.questionContent ?? "");
    setQuestionType(question.questionType    ?? "");
    setQuestionSetNo(question.questionSetNo  ?? 1);
    setCurrentQaId(question.interviewQaId);
    if (forceMood) setMood(forceMood);
  }

  function moodByType(type, score) {
    if (type === "FOLLOW_UP") return "followup";
    if (score >= 80)          return "good";
    return "question";
  }

  /* Arti 음성 재생 + 입모양 */
  async function playArti(base64, mimeType, newMood) {
    setSpeaking(true);
    setMood(newMood);
    setStatusText("아티가 질문을 읽고 있습니다...");

    mouthTimerRef.current = setInterval(() => {
      setMouthOpen((p) => !p);
    }, 175);

    try {
      await decodeAndPlayAudio(base64, mimeType);
    } catch (e) {
      console.warn("오디오 재생 실패:", e);
    } finally {
      clearInterval(mouthTimerRef.current);
      setMouthOpen(false);
      setSpeaking(false);
      setMood("idle");
      setStatusText("답변 준비가 되면 녹음 버튼을 누르세요.");
    }
  }

  /* ── 녹음 시작 ── */
  async function startRecording() {
    if (recording || speaking || submitting || !sessionId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const supported = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder  = new MediaRecorder(stream, { mimeType: supported });
      mediaRecorderRef.current = recorder;
      chunksRef.current        = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(200);

      setRecording(true);
      setMood("idle");
      setRecTime(0);
      setStatusText("녹음 중... 답변을 말씀해 주세요.");
      recTimerRef.current = setInterval(() => setRecTime((t) => t + 1), 1000);
    } catch {
      alert("마이크 접근 권한이 필요합니다.");
    }
  }

  /* ── 녹음 중지 + 제출 ── */
  async function stopAndSubmit() {
    if (!recording || !mediaRecorderRef.current) return;

    clearInterval(recTimerRef.current);
    setRecording(false);
    setMood("thinking");
    setStatusText("답변을 분석하는 중...");

    const blob = await new Promise((resolve) => {
      const rec = mediaRecorderRef.current;
      rec.onstop = () => resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      rec.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    });

    if (!blob || !sessionId || !currentQaId) return;

    setSubmitting(true);
    try {
      const res = await submitVoiceAnswer(sessionId, currentQaId, blob);

      if (!res?.success || !res?.data) {
        setStatusText("오류가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      const { data } = res;
      setProgress(data.progress);

      /* 종료 조건 */
      if (data.finishRequired || data.nextClientAction === "REQUEST_FINISH") {
        setMood("final");
        setFinishReady(true);
        setStatusText("모든 질문이 완료되었습니다!");
        return;
      }

      /* 다음 질문 */
      if (data.question) {
        const score    = data.turnScore?.totalScore ?? 0;
        const nextMood = moodByType(data.question.questionType, score);
        applyQuestion(data.question, nextMood);

        if (data.question.audio?.audioBase64) {
          await playArti(data.question.audio.audioBase64, data.question.audio.mimeType, nextMood);
        } else {
          setMood(nextMood);
          setStatusText("답변 준비가 되면 녹음 버튼을 누르세요.");
        }
      }
    } catch (err) {
      console.error("답변 제출 실패:", err);
      setStatusText("오류가 발생했습니다. 다시 시도해주세요.");
      setMood("idle");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── 면접 종료 ── */
  async function handleFinish() {
    if (finishing) return;
    setFinishing(true);
    try {
      await finishInterview(sessionId);
      // 채팅 기록 조회를 위해 sessionId 저장
      if (sessionId) localStorage.setItem("lastInterviewSessionId", String(sessionId));
      navigate(`/interview-report/${job_posting_id || ""}`);
    } catch {
      navigate("/interview");
    }
  }

  /* ── 진행률 ── */
  const totalQ    = progress?.questionSetCount          ?? (Number(question_count) || 5);
  const currentNo = progress?.currentQuestionSetNo      ?? questionSetNo;
  const answered  = progress?.totalAnswerCount          ?? 0;
  const remaining = progress?.remainingQuestionSetCount ?? totalQ;
  const pct       = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;

  const recMin = String(Math.floor(recTime / 60)).padStart(2, "0");
  const recSec = String(recTime % 60).padStart(2, "0");

  /* ════════ 렌더 ════════ */
  return (
    <>
      {finishing && <LoadingOverlay />}

      <div style={{
        minHeight:  "100vh",
        background: "var(--bg)",
        display:    "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding:    "32px 16px 60px",
      }}>
        {/* ── 다크 카드 ── */}
        <div style={{
          width:        "100%",
          maxWidth:     "920px",
          background:   "#050B1A",
          borderRadius: "28px",
          padding:      "36px 40px 48px",
          boxShadow:    "0 20px 60px rgba(0,0,0,0.22)",
          display:      "flex",
          flexDirection:"column",
          alignItems:   "center",
        }}>

        {/* ── 헤더 ── */}
        <div style={{
          width: "100%",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "28px",
        }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.2em", color: "#22d3ee", marginBottom: "6px" }}>
              ARTI AI INTERVIEWER · VOICE
            </div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 900, color: "#ffffff", lineHeight: 1.2 }}>
              {company_name || "기업"}{job_name ? ` · ${job_name}` : ""}
            </h1>
            <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {difficulty       && <span style={{ fontSize: "12px", color: "#94a3b8" }}>난이도 {difficulty}</span>}
              {interviewer_type && <span style={{ fontSize: "12px", color: "#94a3b8" }}>{interviewer_type}</span>}
              <span style={{ fontSize: "12px", fontWeight: 700, color: finishReady ? "#10b981" : "#38bdf8" }}>
                {finishReady ? "✅ 면접 완료" : `Q ${currentNo} / ${totalQ}  ·  남은 질문 ${remaining}`}
              </span>
            </div>
            {/* 진행바 */}
            <div style={{
              marginTop: "10px", width: "280px", height: "4px",
              borderRadius: "9999px", background: "#1e293b", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: "9999px",
                background: "linear-gradient(90deg,#38bdf8,#818cf8)",
                width: `${pct}%`, transition: "width 0.5s ease",
              }} />
            </div>
          </div>

          <button
            onClick={() => setShowExitModal(true)}
            style={{
              background: "#ef4444", color: "#fff", border: "none",
              borderRadius: "12px", padding: "10px 20px",
              fontWeight: 900, fontSize: "13px", cursor: "pointer",
            }}
          >
            강제 종료
          </button>
        </div>

        {/* ── 오류 ── */}
        {initError && (
          <div style={{
            background: "#1e1b2e", border: "1px solid #7f1d1d",
            borderRadius: "20px", padding: "32px 40px",
            textAlign: "center", color: "#fca5a5", maxWidth: "520px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>{initError}</p>
            <button onClick={() => navigate("/interview")} style={{
              background: "transparent", border: "1px solid #ef4444",
              borderRadius: "10px", padding: "10px 24px",
              color: "#ef4444", fontWeight: 700, cursor: "pointer",
            }}>돌아가기</button>
          </div>
        )}

        {!initError && (
          <>
            {/* ── Arti 캐릭터 ── */}
            <div style={{ position: "relative", marginBottom: "8px" }}>
              {CUBES.map((c, i) => (
                <CubeParticle key={i} delay={c.delay} dx={c.dx} size={c.size} />
              ))}
              <div style={{ animation: "artiFloat 3.2s ease-in-out infinite" }}>
                <ArtiCharacter mood={mood} mouthOpen={mouthOpen} size={260} />
              </div>
              {/* PNG 하단 홀로그램 링과 이어지는 외부 발광 링 */}
              <div style={{
                position: "absolute", bottom: "44px", left: "50%",
                transform: "translateX(-50%)",
                width: "230px", height: "50px",
                borderRadius: "50%",
                border: "1.5px solid rgba(96,232,255,0.5)",
                boxShadow: "0 0 18px rgba(96,232,255,0.35), 0 0 38px rgba(96,232,255,0.14)",
                pointerEvents: "none",
              }} />
            </div>

            {/* ── 상태 텍스트 ── */}
            <div style={{
              marginBottom: "20px",
              fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px",
              color: speaking ? "#22d3ee" : recording ? "#f87171" : "#94a3b8",
            }}>
              {speaking && (
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#22d3ee", display: "inline-block",
                }} />
              )}
              {recording && (
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#ef4444", display: "inline-block",
                  animation: "recordPulse 0.8s ease infinite",
                }} />
              )}
              {statusText}
              {recording && (
                <span style={{ fontFamily: "monospace", color: "#f87171" }}>
                  {recMin}:{recSec}
                </span>
              )}
            </div>

            {/* ── 자막 바 (speaking 중) ── */}
            {speaking && questionText && (
              <div style={{
                width: "100%", maxWidth: "760px",
                marginBottom: "12px",
                background: "rgba(0,0,0,0.72)",
                borderRadius: "16px",
                padding: "14px 24px",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(34,211,238,0.35)",
                boxShadow: "0 0 20px rgba(34,211,238,0.12)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#22d3ee", display: "inline-block",
                    boxShadow: "0 0 6px #22d3ee",
                    animation: "recordPulse 1s ease infinite",
                  }} />
                  <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.2em", color: "#22d3ee" }}>
                    LIVE · 면접관 질문
                  </span>
                  {questionType === "FOLLOW_UP" && (
                    <span style={{
                      fontSize: "10px", fontWeight: 700,
                      background: "rgba(251,146,60,0.2)", color: "#fb923c",
                      borderRadius: "999px", padding: "1px 8px",
                    }}>꼬리질문</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, lineHeight: 1.7, color: "#f0f9ff", letterSpacing: "0.01em" }}>
                  {questionText}
                </p>
              </div>
            )}

            {/* ── 질문 카드 (재생 완료 후 표시) ── */}
            {!speaking && questionText && (
              <div style={{
                width: "100%", maxWidth: "760px",
                background: "#0D162D",
                border: "1px solid rgba(96,232,255,0.2)",
                borderRadius: "24px",
                padding: "32px 36px",
                marginBottom: "32px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.15em", color: "#38bdf8" }}>
                    ARTI 질문
                  </span>
                  {questionType === "FOLLOW_UP" && (
                    <span style={{
                      fontSize: "11px", fontWeight: 700,
                      background: "rgba(251,146,60,0.15)", color: "#fb923c",
                      borderRadius: "999px", padding: "2px 10px",
                    }}>꼬리질문</span>
                  )}
                  <span style={{
                    fontSize: "11px", fontWeight: 700,
                    background: "rgba(99,102,241,0.15)", color: "#818cf8",
                    borderRadius: "999px", padding: "2px 10px",
                  }}>Q{questionSetNo}</span>
                </div>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, lineHeight: 1.7, color: "#f1f5f9" }}>
                  {questionText}
                </p>
              </div>
            )}

            {/* 초기 로딩 */}
            {loading && !questionText && (
              <div style={{ color: "#475569", fontSize: "15px", marginBottom: "32px" }}>
                면접을 준비하는 중입니다...
              </div>
            )}

            {/* ── 면접 종료 버튼 ── */}
            {finishReady && (
              <div style={{
                width: "100%", maxWidth: "520px",
                background: "#0a1628",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "20px", padding: "32px", textAlign: "center",
              }}>
                <p style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 900, color: "#10b981" }}>
                  🎉 모든 질문이 완료되었습니다!
                </p>
                <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>
                  면접을 종료하고 AI 결과 분석을 시작합니다.
                </p>
                <button
                  onClick={handleFinish}
                  disabled={finishing}
                  style={{
                    width: "100%", padding: "16px",
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                    border: "none", borderRadius: "14px",
                    color: "#fff", fontSize: "15px", fontWeight: 900,
                    cursor: finishing ? "not-allowed" : "pointer",
                    opacity: finishing ? 0.6 : 1,
                  }}
                >
                  {finishing ? "결과 생성 중..." : "면접 종료 및 결과 보기"}
                </button>
              </div>
            )}

            {/* ── 녹음 컨트롤 ── */}
            {!finishReady && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                {/* 큰 녹음 버튼 */}
                <div style={{ position: "relative" }}>
                  {recording && (
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      background: "rgba(239,68,68,0.22)",
                      animation: "ripple 1.2s ease-out infinite",
                    }} />
                  )}
                  <button
                    onClick={recording ? stopAndSubmit : startRecording}
                    disabled={speaking || submitting}
                    style={{
                      width: "80px", height: "80px", borderRadius: "50%",
                      border: "none",
                      cursor: (speaking || submitting) ? "not-allowed" : "pointer",
                      background: recording
                        ? "linear-gradient(135deg,#dc2626,#b91c1c)"
                        : "linear-gradient(135deg,#0ea5e9,#6366f1)",
                      boxShadow: recording
                        ? "0 8px 30px rgba(220,38,38,0.45)"
                        : "0 8px 30px rgba(14,165,233,0.35)",
                      animation: recording ? "recordPulse 0.9s ease infinite" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative", zIndex: 1,
                      transition: "background 0.2s",
                      opacity: (speaking || submitting) ? 0.5 : 1,
                    }}
                  >
                    {submitting ? (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M14 3 A11 11 0 0 1 25 14" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                          <animateTransform attributeName="transform" type="rotate"
                            from="0 14 14" to="360 14 14" dur="0.8s" repeatCount="indefinite" />
                        </path>
                      </svg>
                    ) : recording ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                        <rect x="5"  y="5" width="5" height="14" rx="1.5" />
                        <rect x="14" y="5" width="5" height="14" rx="1.5" />
                      </svg>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24"
                        fill="none" stroke="#fff" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="2" width="6" height="11" rx="3" />
                        <path d="M5 10a7 7 0 0 0 14 0" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="9"  y1="22" x2="15" y2="22" />
                      </svg>
                    )}
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: "13px", color: "#475569", textAlign: "center" }}>
                  {submitting
                    ? "답변을 전송하는 중..."
                    : speaking
                    ? "아티가 질문을 읽는 중입니다..."
                    : recording
                    ? "버튼을 다시 누르면 답변이 제출됩니다"
                    : "버튼을 눌러 답변을 녹음하세요"}
                </p>
              </div>
            )}
          </>
        )}
        </div>{/* ── /다크 카드 ── */}
      </div>

      {/* ── 강제 종료 모달 ── */}
      {showExitModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: "24px", padding: "40px",
            width: "440px", maxWidth: "90vw",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: 900, color: "#f1f5f9" }}>
              면접 강제 종료
            </h2>
            <p style={{ margin: "0 0 32px", fontSize: "14px", color: "#94a3b8", lineHeight: 1.8 }}>
              중간에 종료하면 결과 리포트가 제공되지 않습니다.<br />
              면접 횟수는 정상 차감됩니다.<br /><br />
              정말 종료하시겠습니까?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowExitModal(false)}
                style={{
                  flex: 1, padding: "14px",
                  background: "transparent", border: "1px solid #334155",
                  borderRadius: "12px", color: "#94a3b8",
                  fontWeight: 700, fontSize: "14px", cursor: "pointer",
                }}
              >
                아니요
              </button>
              <button
                onClick={() => navigate("/interview")}
                style={{
                  flex: 1, padding: "14px",
                  background: "#ef4444", border: "none",
                  borderRadius: "12px", color: "#fff",
                  fontWeight: 700, fontSize: "14px", cursor: "pointer",
                }}
              >
                예, 종료합니다
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
