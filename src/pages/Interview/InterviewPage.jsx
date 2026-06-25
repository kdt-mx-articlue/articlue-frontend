import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import MembershipModal from "../../components/common/MembershipModal";
import { FREE_INTERVIEW_LIMIT as FREE_LIMIT } from "../../constants/usageConfig";
import api from "../../api/axios.js";

function modeLabel(mode) {
  if (!mode) return "💬 챗봇";
  return mode.toUpperCase() === "VOICE" ? "🎙 TTS" : "💬 챗봇";
}

function getMemberId() {
  try { return localStorage.getItem("memberId"); } catch { return null; }
}

/* ── 횟수 초과 알림 모달 ─────────────────────────────────────── */
function ExhaustedModal({ onClose, onUpgrade }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-[400px] rounded-[28px] bg-white p-8 shadow-2xl mx-4">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 text-xl transition">✕</button>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">🔒</div>
        <h2 className="text-[20px] font-black text-slate-900">무료 면접 횟수를 모두 사용했어요</h2>
        <p className="mt-2 text-[14px] leading-6 text-slate-500">
          무료 제공 면접 <strong>{FREE_LIMIT}회</strong>를 모두 사용했습니다.<br />
          멤버십에 가입하면 횟수 제한 없이 모의 면접을 이용할 수 있어요.
        </p>
        <ul className="mt-5 space-y-2 rounded-2xl bg-blue-50 p-4 text-[13px] text-slate-700">
          <li>✅ 무제한 모의 면접</li>
          <li>✅ AI 심층 리포트 제공</li>
          <li>✅ 기업별 맞춤 질문 강화</li>
          <li>✅ 음성 면접(TTS) 이용 가능</li>
        </ul>
        <div className="mt-6 space-y-2">
          <button onClick={onUpgrade} className="w-full rounded-xl bg-blue-600 py-3 text-[14px] font-black text-white hover:bg-blue-700 transition">멤버십 가입하기</button>
          <button onClick={onClose} className="w-full rounded-xl border border-slate-200 py-3 text-[14px] font-black text-slate-500 hover:bg-slate-50 transition">나중에 하기</button>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 페이지 ─────────────────────────────────────────────── */
export default function InterviewPage() {
  const navigate = useNavigate();
  const [showExhausted, setShowExhausted] = useState(false);
  const [showMembership, setShowMembership] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) { setLoading(false); return; }

    api.get("/interviews/sessions", { params: { memberId } })
      .then(res => setSessions(res.data?.data ?? []))
      .catch(err => console.error("[InterviewPage] 세션 목록 로드 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  const maxScore = useMemo(() => {
    if (sessions.length === 0) return 0;
    return Math.max(...sessions.map(s => Number(s.totalScore ?? 0)));
  }, [sessions]);

  const usedCount  = sessions.length;
  const freeRemain = Math.max(0, FREE_LIMIT - usedCount);

  function handleStartInterview() {
    if (freeRemain === 0) setShowExhausted(true);
    else navigate("/interview/setup");
  }

  function handleViewSession(session) {
    localStorage.setItem("lastInterviewSessionId", String(session.interviewSessionId));
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-8">

      {showExhausted && (
        <ExhaustedModal
          onClose={() => setShowExhausted(false)}
          onUpgrade={() => { setShowExhausted(false); setShowMembership(true); }}
        />
      )}
      {showMembership && <MembershipModal onClose={() => setShowMembership(false)} />}

      {/* Hero */}
      <PageHero
        badge="면접 준비"
        title="실전 면접을 통해 직무 적합도를 검증해보세요"
        description="기업별 맞춤 질문으로 면접을 진행하고 결과 리포트를 확인할 수 있습니다."
        statTitle="면접 최고 점수"
        statValue={maxScore > 0 ? `${Number(maxScore).toFixed(2)}점` : "-"}
        statDescription="누적 면접 결과 중 최고 점수"
        progressValue={Number(maxScore)}
      />

      {/* 이용 현황 + 시작 버튼 */}
      <section className="rounded-[28px] bg-white p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <p className="text-[13px] font-bold text-slate-400 mb-4">면접 이용 현황</p>
            <div className="flex items-center gap-3 mb-4">
              {Array.from({ length: FREE_LIMIT }).map((_, i) => (
                <div key={i} className={`h-4 w-4 rounded-full transition-colors ${i < usedCount ? "bg-blue-600" : "bg-slate-200"}`} />
              ))}
              <span className="ml-1 text-[13px] text-slate-500">{usedCount}/{FREE_LIMIT} 사용</span>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-[12px] text-slate-400">누적 면접</p>
                <p className="text-[32px] font-black text-slate-900 leading-none mt-1">{usedCount}회</p>
              </div>
              <div>
                <p className="text-[12px] text-slate-400">무료 잔여</p>
                <p className={`text-[32px] font-black leading-none mt-1 ${freeRemain === 0 ? "text-rose-500" : "text-blue-600"}`}>{freeRemain}회</p>
              </div>
            </div>
            {freeRemain === 0 && (
              <p className="mt-3 text-[12px] text-rose-500">무료 횟수를 모두 사용했습니다. 멤버십 가입 후 계속 이용하세요.</p>
            )}
          </div>
          <div className="hidden lg:block w-px h-24 bg-slate-100" />
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleStartInterview}
              className={`w-full rounded-2xl py-5 text-lg font-black text-white transition ${freeRemain === 0 ? "bg-slate-400 hover:bg-slate-500" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {freeRemain === 0 ? "🔒 멤버십 가입 후 이용" : "모의면접 시작"}
            </button>
            {freeRemain > 0 && <p className="text-[12px] text-slate-400">무료 {freeRemain}회 남음</p>}
          </div>
        </div>
      </section>

      {/* 면접 기록 */}
      <section>
        <h2 className="mb-6 text-2xl font-black">면접 기록</h2>

        {loading ? (
          <p className="text-slate-400">불러오는 중...</p>
        ) : sessions.length === 0 ? (
          <p className="text-slate-400">아직 면접 기록이 없습니다.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {sessions.map((item) => {
              const score = Number(item.totalScore ?? 0);
              return (
                <article key={item.interviewSessionId} className="flex flex-col rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
                  <p className="mb-1 text-[12px] font-medium text-slate-400">
                    {modeLabel(item.interviewType)} · {item.interviewLevel ?? "-"}난이도 · AI 면접관
                  </p>
                  <h3 className="text-[22px] font-black text-slate-900 leading-tight">{item.companyName ?? "-"}</h3>
                  <p className="mt-1 text-[14px] text-slate-500">{item.jobName ?? "-"}</p>
                  <p className="mt-2 flex items-center gap-1 text-[12px] text-slate-400">
                    <span>📅</span>
                    <span>{item.startTime ? item.startTime.replace("T", " ").slice(0, 16) : "-"}</span>
                    <span className="ml-2">· 질문 {item.totalQuestionCount ?? 0}개</span>
                  </p>

                  <div className="mt-4">
                    <p className="text-[13px] font-bold text-slate-500">종합 면접 점수</p>
                    {score > 0 ? (
                      <>
                        <p className="mt-1 text-[40px] font-black text-blue-600 leading-none">{score.toFixed(2)}점</p>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${Math.min(score, 100)}%` }} />
                        </div>
                      </>
                    ) : (
                      <p className="mt-1 text-[18px] font-bold text-slate-400">리포트 없음</p>
                    )}
                  </div>

                  {score > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {[
                        ["논리력", item.logicScore],
                        ["기술이해", item.techUnderstandingScore],
                        ["비즈니스", item.businessLinkScore],
                        ["경험근거", item.evidenceScore],
                        ["직무적합", item.jobFitScore],
                      ].map(([label, val]) => (
                        <span key={label} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                          {label} {Number(val ?? 0).toFixed(0)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-5 space-y-2">
                    <button
                      onClick={() => { handleViewSession(item); navigate(`/interview-history/${item.jobPostingId}`); }}
                      className="w-full rounded-xl border border-slate-300 py-3 text-[13px] font-black text-slate-700 hover:bg-slate-50 transition"
                    >
                      채팅 보기
                    </button>
                    <button
                      onClick={() => { handleViewSession(item); navigate(`/interview-report/${item.jobPostingId}`); }}
                      className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-black text-white hover:bg-blue-700 transition"
                    >
                      결과 보기
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
