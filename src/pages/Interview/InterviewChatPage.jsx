import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  startInterview,
  submitTextAnswer,
  finishInterview,
} from "../../services/interviewService";

import LoadingOverlay from "../../components/common/LoadingOverlay";
import api from "../../api/axios.js";
import { resolveResumeId } from "../../services/reportService.js";

/* ─── 타이핑 스트리밍 ─── */
function streamText(text, callback, onEnd) {
  let i = 0;
  const interval = setInterval(() => {
    callback(text.slice(0, i));
    i++;
    if (i > text.length) {
      clearInterval(interval);
      onEnd?.();
    }
  }, 18);
  return interval;
}

export default function InterviewChatPage() {
  const navigate = useNavigate();

  const setup = (() => {
    try {
      return JSON.parse(localStorage.getItem("interviewSetup") || "{}");
    } catch {
      return {};
    }
  })();

  const {
    company_name,
    job_name,
    difficulty,
    interviewer_type,
    question_count,
    job_posting_id,
  } = setup;

  /* ─── State ─── */
  const [sessionId,    setSessionId]    = useState(null);
  const [currentQaId,  setCurrentQaId]  = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [finishReady,  setFinishReady]  = useState(false);
  const [finishing,    setFinishing]    = useState(false);
  const [progress,     setProgress]     = useState(null);
  const [showExitModal,setShowExitModal]= useState(false);
  const [initError,    setInitError]    = useState(null);

  const inputRef       = useRef("");
  const initializedRef = useRef(false);
  const messagesEndRef = useRef(null);

  /* ─── 메시지 끝으로 스크롤 ─── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ─── 면접 초기화 ─── */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initializeInterview();
  }, []);

  async function initializeInterview() {
    try {
      setLoading(true);
      const res = await startInterview(setup);

      if (!res?.success || !res?.data) {
        setInitError("면접 시작에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const { interviewSessionId, question, progress: prog } = res.data;
      setSessionId(interviewSessionId);
      setCurrentQaId(question.interviewQaId);
      setProgress(prog);
      addAssistantMessage(question.questionContent, question.questionType, question.questionSetNo);
    } catch (err) {
      console.error("면접 시작 실패:", err);
      setInitError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  /* ─── AI 메시지 추가 (스트리밍) ─── */
  function addAssistantMessage(content, type, setNo) {
    if (!content) return;
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "assistant", type, setNo, content: "" },
    ]);
    streamText(content, (partial) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, content: partial } : m))
      );
    });
  }

  /* ─── 답변 제출 ─── */
  async function handleSubmit() {
    if (loading || finishReady || !sessionId) return;
    const answer = inputRef.current.trim();
    if (!answer) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    setInput("");
    inputRef.current = "";

    try {
      const res = await submitTextAnswer(sessionId, currentQaId, answer);

      if (!res?.success || !res?.data) {
        setLoading(false);
        return;
      }

      const { data } = res;
      setProgress(data.progress);

      /* 종료 조건 */
      if (data.finishRequired || data.nextClientAction === "REQUEST_FINISH") {
        setFinishReady(true);
        setLoading(false);
        return;
      }

      /* 다음 질문 */
      if (data.question) {
        setCurrentQaId(data.question.interviewQaId);
        addAssistantMessage(
          data.question.questionContent,
          data.question.questionType,
          data.question.questionSetNo
        );
      }
    } catch (err) {
      console.error("답변 제출 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ─── 면접 정상 종료 ─── */
  async function handleFinish() {
    if (finishing) return;
    setFinishing(true);
    try {
      // 1단계: 면접 종료 + 면접 리포트 생성
      await finishInterview(sessionId);
      if (sessionId) localStorage.setItem("lastInterviewSessionId", String(sessionId));

      // 백엔드 finishInterview에서 단일 공고 FINAL 분석을 자동 처리하므로 별도 호출 불필요
      navigate(`/interview-report/${job_posting_id || ""}`);
    } catch (err) {
      console.error("면접 종료/분석 실패:", err);
      navigate("/interview");
    } finally {
      setFinishing(false);
    }
  }

  /* ─── 강제 종료 (결과 없음) ─── */
  function handleForceExit() {
    setShowExitModal(false);
    navigate("/interview");
  }

  /* ─── 진행률 계산 ─── */
  const totalCount     = progress?.questionSetCount       ?? Number(question_count) ?? 5;
  const remainingCount = progress?.remainingQuestionSetCount ?? totalCount;
  const currentNo      = progress?.currentQuestionSetNo  ?? 1;
  const answeredCount  = progress?.totalAnswerCount       ?? 0;
  const progressPct    = totalCount > 0
    ? Math.round((answeredCount / totalCount) * 100)
    : 0;

  /* ─── Render ─── */
  return (
    <>
      {finishing && <LoadingOverlay />}
      <div className="mx-auto max-w-[1000px] space-y-6 pb-10">

        {/* ── 헤더 ── */}
        <section
          className="sticky top-0 z-10 rounded-2xl p-6 shadow-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>
                {company_name || "기업"}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-sub)" }}>
                {job_name}
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                {difficulty && <span>난이도 {difficulty}</span>}
                {interviewer_type && <span>{interviewer_type}</span>}
                <span>질문 {currentNo} / {totalCount}</span>
                <span
                  className="font-bold"
                  style={{ color: finishReady ? "#10b981" : "var(--blue-500)" }}
                >
                  {finishReady ? "✅ 면접 완료" : `남은 질문 ${remainingCount}`}
                </span>
              </div>

              {/* 진행바 */}
              <div
                className="mt-3 h-2 w-full max-w-[320px] overflow-hidden rounded-full"
                style={{ background: "var(--surface-soft)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, background: "#2563eb" }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowExitModal(true)}
              className="shrink-0 rounded-xl bg-red-500 px-5 py-3 text-sm font-black text-white"
            >
              강제 종료
            </button>
          </div>
        </section>

        {/* ── 오류 ── */}
        {initError && (
          <section
            className="rounded-2xl p-6 text-center"
            style={{ background: "var(--surface)" }}
          >
            <p className="font-bold text-red-500">{initError}</p>
            <button
              onClick={() => navigate("/interview")}
              className="mt-4 rounded-xl border px-6 py-3 font-bold"
              style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
            >
              돌아가기
            </button>
          </section>
        )}

        {/* ── 대화창 ── */}
        {!initError && (
          <section
            className="min-h-[400px] rounded-2xl p-6"
            style={{ background: "var(--surface)" }}
          >
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {/* AI 아바타 */}
                  {msg.role === "assistant" && (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white">
                      AI
                    </div>
                  )}

                  <div className="max-w-[700px]">
                    <div
                      className="mb-1 flex items-center gap-2 text-xs font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {msg.role === "assistant" ? (
                        <>
                          <span>면접관</span>
                          {msg.type === "FOLLOW_UP" && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-600">
                              꼬리질문
                            </span>
                          )}
                          {msg.setNo && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">
                              Q{msg.setNo}
                            </span>
                          )}
                        </>
                      ) : (
                        <span>지원자</span>
                      )}
                    </div>

                    <div
                      className="rounded-2xl border p-4 leading-7 text-sm"
                      style={{
                        background:   msg.role === "user" ? "var(--blue-50)" : "var(--surface)",
                        borderColor:  "var(--border)",
                        color:        "var(--text-main)",
                      }}
                    >
                      {msg.content || (
                        <span style={{ color: "var(--text-muted)" }}>...</span>
                      )}
                    </div>
                  </div>

                  {/* 사용자 아바타 */}
                  {msg.role === "user" && (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-black text-white">
                      나
                    </div>
                  )}
                </div>
              ))}

              {/* 로딩 버블 */}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white">
                    AI
                  </div>
                  <div
                    className="rounded-2xl border p-4"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      생각 중...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </section>
        )}

        {/* ── 입력 영역 or 종료 버튼 ── */}
        {!initError && (
          finishReady ? (
            <section
              className="rounded-2xl p-8 text-center"
              style={{ background: "var(--surface)" }}
            >
              <p className="text-xl font-black" style={{ color: "#10b981" }}>
                🎉 모든 질문이 완료되었습니다!
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--text-sub)" }}>
                면접을 종료하고 AI 결과 분석을 시작합니다.
              </p>
              <button
                onClick={handleFinish}
                disabled={finishing}
                className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-black text-white disabled:opacity-60"
              >
                {finishing ? "결과 생성 중..." : "면접 종료 및 결과 보기"}
              </button>
            </section>
          ) : (
            <section
              className="rounded-2xl p-6"
              style={{ background: "var(--surface)" }}
            >
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  inputRef.current = e.target.value;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleSubmit();
                }}
                rows={5}
                placeholder="답변을 입력하세요. (Ctrl + Enter 제출)"
                disabled={loading || !sessionId}
                className="w-full rounded-xl border p-4 text-sm outline-none"
                style={{
                  background:   "var(--surface-soft)",
                  borderColor:  "var(--border)",
                  color:        "var(--text-main)",
                  resize:       "vertical",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !sessionId}
                className="mt-4 w-full rounded-xl bg-blue-600 py-4 font-black text-white disabled:opacity-60"
              >
                {loading ? "처리 중..." : "답변 제출"}
              </button>
            </section>
          )
        )}
      </div>

      {/* ── 강제 종료 모달 ── */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-[480px] rounded-3xl p-8 shadow-xl"
            style={{ background: "var(--surface)", color: "var(--text-main)" }}
          >
            <h2 className="text-2xl font-black">면접 강제 종료</h2>
            <p className="mt-4 leading-7" style={{ color: "var(--text-sub)" }}>
              중간에 종료하면 결과 리포트가 제공되지 않습니다.
              <br /><br />
              면접 횟수는 정상 차감됩니다.
              <br /><br />
              정말 종료하시겠습니까?
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 rounded-xl border py-3 font-black"
                style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
              >
                아니요
              </button>
              <button
                onClick={handleForceExit}
                className="flex-1 rounded-xl bg-red-500 py-3 font-black text-white"
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
