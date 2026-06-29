import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewReport } from "../../services/interviewReportService";

/* ── 유틸 ── */
function formatDuration(seconds) {
  if (!seconds) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}분 ${s}초` : `${m}분`;
}

function formatDate(raw) {
  if (!raw) return "-";
  return raw.replace("T", " ").slice(0, 16);
}

function modeLabel(mode) {
  if (!mode) return "-";
  return mode === "CHATBOT" ? "채팅형" : mode === "VOICE" ? "음성형" : mode;
}

function difficultyColor(d) {
  if (d === "상") return "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";
  if (d === "중") return "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400";
}

/* ── 메타 뱃지 ── */
function Badge({ label, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

/* ── 피드백 타입 메타 ── */
const FEEDBACK_META = {
  STRENGTH:       { label: "강점",       color: "#10b981", bg: "#ecfdf5", dark: "#065f46" },
  WEAKNESS:       { label: "보완",       color: "#ef4444", bg: "#fef2f2", dark: "#7f1d1d" },
  WEAKNESS_POINT: { label: "보완",       color: "#ef4444", bg: "#fef2f2", dark: "#7f1d1d" },
  OVERALL:        { label: "종합평가",   color: "#6366f1", bg: "#eef2ff", dark: "#3730a3" },
  LOGIC:          { label: "논리력",     color: "#8b5cf6", bg: "#f5f3ff", dark: "#4c1d95" },
  TECH:           { label: "기술이해",   color: "#2563eb", bg: "#eff6ff", dark: "#1e3a8a" },
  BUSINESS:       { label: "비즈니스",   color: "#f59e0b", bg: "#fffbeb", dark: "#78350f" },
  EVIDENCE:       { label: "경험근거",   color: "#10b981", bg: "#ecfdf5", dark: "#065f46" },
  JOB_FIT:        { label: "직무적합",   color: "#0ea5e9", bg: "#f0f9ff", dark: "#0c4a6e" },
};

/* ── 통계 아이템 ── */
function StatItem({ icon, label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
        <span>{icon}</span>
        {label}
      </div>
      <div className="text-[22px] font-black text-slate-900 dark:text-white leading-none">
        {value}
      </div>
      {sub && <div className="text-[11px] text-slate-400">{sub}</div>}
    </div>
  );
}

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const { jobPostingId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getInterviewReport(jobPostingId);
      setReport(data);
    }
    load();
  }, [jobPostingId]);

  if (!report) {
    return (
      <div className="flex h-[500px] items-center justify-center text-slate-400 dark:text-slate-500">
        불러오는 중...
      </div>
    );
  }

  /* 실API는 camelCase, interview_summary 없이 report 루트에 직접 있음 */
  const interviewMode  = report.interviewType  ?? report.interview_summary?.interview_mode;
  const interviewLevel = report.interviewLevel ?? report.interview_summary?.difficulty;
  const startTime      = report.startTime      ?? report.interview_summary?.interview_date;
  const totalQ         = report.totalQuestionCount ?? report.interview_summary?.question_count;
  const totalA         = report.totalAnswerCount   ?? report.interview_summary?.chat_log_count;

  /* 소요 시간: startTime + endTime 있으면 계산, 없으면 mock의 duration_seconds */
  const durationSec = (() => {
    if (report.startTime && report.endTime) {
      return Math.round((new Date(report.endTime) - new Date(report.startTime)) / 1000);
    }
    return report.interview_summary?.duration_seconds ?? null;
  })();

  /* 완료율 */
  const completionRate = totalQ > 0 ? Math.round((totalA / totalQ) * 100) : null;

  /* chatHistory: 실API는 qaList, mock은 chatHistory / chat_history */
  const chatHistory = report.qaList ?? report.chatHistory ?? report.chat_history ?? [];

  /* question_order / questionOrder 기준으로 그룹핑 */
  const groups = chatHistory.reduce((acc, item) => {
    const key = item.questionOrder ?? item.question_order ?? 0;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const groupKeys = Object.keys(groups).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="mx-auto max-w-[860px] space-y-6 pb-16">

      {/* ══ 헤더 ══ */}
      <section className="rounded-[28px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge label="면접 채팅 기록" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" />
          <Badge label={modeLabel(interviewMode)} className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" />
          {interviewLevel && (
            <Badge label={`난이도 ${interviewLevel}`} className={difficultyColor(interviewLevel)} />
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
          {report.companyName ?? report.company_name}
        </h1>
        <p className="mt-1.5 text-base text-slate-500 dark:text-slate-400 font-medium">
          {report.jobName ?? report.job_name}
        </p>
        {startTime && (
          <p className="mt-3 text-[13px] text-slate-400 dark:text-slate-500">
            📅 {formatDate(startTime)}
          </p>
        )}
      </section>

      {/* ══ 면접 통계 ══ */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem icon="❓" label="질문 수" value={`${totalQ ?? "-"}개`} />
        <StatItem icon="⏱" label="소요 시간" value={formatDuration(durationSec)} />
        <StatItem
          icon="✅"
          label="완료율"
          value={`${completionRate ?? "-"}%`}
          sub={completionRate === 100 ? "전체 완료" : "일부 완료"}
        />
        <StatItem icon="💬" label="총 대화" value={`${totalA ?? "-"}건`} />
      </section>

      {/* ══ 대화 기록 ══ */}
      <section className="rounded-[28px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8">
        <h2 className="mb-8 text-xl font-black text-slate-900 dark:text-white">
          면접 대화 기록
        </h2>

        {groupKeys.length > 0 ? (
          <div className="flex flex-col gap-10">
            {groupKeys.map((key) => {
              const items = groups[key];
              const mainQ = items[0]; // 첫 번째 = 본 질문

              return (
                <div key={key} className="relative">
                  {/* 질문 세트 번호 */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-black">
                      Q{key}
                    </div>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                  </div>

                  {/* 해당 세트의 Q&A들 */}
                  <div className="flex flex-col gap-4">
                    {items.map((item) => {
                      /* camelCase(실API) + snake_case(mock) 모두 대응 */
                      const followUpYn    = item.followUpYn    ?? item.follow_up_yn;
                      const questionType  = item.questionType  ?? item.question_type;
                      const interviewerRole = item.interviewerRole ?? item.interviewer_role;
                      const questionContent = item.questionContent ?? item.question_content;
                      const answerContent   = item.answerContent   ?? item.answer_content;
                      const qaId            = item.interviewQaId   ?? item.interview_qa_id;

                      const isFollowUp = followUpYn === "Y" || questionType === "FOLLOW_UP";
                      return (
                        <div
                          key={qaId}
                          className={isFollowUp ? "ml-6 border-l-2 border-orange-200 dark:border-orange-800 pl-5" : ""}
                        >
                          {/* 질문 */}
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black">
                              AI
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                                  {interviewerRole ?? "면접관"}
                                </span>
                                {isFollowUp && (
                                  <span className="rounded-full bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 text-[10px] font-bold text-orange-500 dark:text-orange-400">
                                    꼬리질문
                                  </span>
                                )}
                                <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                  {questionType === "FOLLOW_UP" ? "꼬리" : "기술"}
                                </span>
                              </div>
                              <div className="rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-700/60 px-4 py-3 text-[14px] leading-7 text-slate-800 dark:text-slate-200">
                                {questionContent}
                              </div>
                            </div>
                          </div>

                          {/* 답변 */}
                          {answerContent && (
                            <div className="flex items-start gap-3 mt-3 flex-row-reverse">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-black">
                                나
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-end gap-2 mb-1.5">
                                  <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                                    지원자
                                  </span>
                                </div>
                                <div className="rounded-2xl rounded-tr-none bg-blue-50 dark:bg-blue-900/25 px-4 py-3 text-[14px] leading-7 text-slate-800 dark:text-slate-200">
                                  {answerContent}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 dark:text-slate-500">
            저장된 면접 대화 기록이 없습니다.
          </div>
        )}
      </section>

      {/* ══ 면접 피드백 ══ */}
      {(() => {
        const items = report.reportItems ?? [];
        if (items.length === 0) return null;

        const strengths  = items.filter(i => i.feedbackType === "STRENGTH");
        const weaknesses = items.filter(i => i.feedbackType === "WEAKNESS" || i.feedbackType === "WEAKNESS_POINT");
        const overall    = items.find(i  => i.feedbackType === "OVERALL");
        const details    = items.filter(i => !["STRENGTH","WEAKNESS","WEAKNESS_POINT","OVERALL"].includes(i.feedbackType));

        return (
          <section className="rounded-[28px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8 space-y-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">면접 피드백</h2>

            {/* 종합평가 */}
            {overall?.feedbackContent && (
              <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-5">
                <p className="text-[11px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">종합평가</p>
                <p className="text-[14px] leading-7 text-slate-700 dark:text-slate-300">{overall.feedbackContent}</p>
              </div>
            )}

            {/* 강점 / 보완 */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {strengths.length > 0 && (
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-5">
                    <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">💪 강점</p>
                    <ul className="space-y-2">
                      {strengths.map((s, i) => (
                        <li key={i} className="text-[13px] leading-6 text-slate-700 dark:text-slate-300">• {s.feedbackContent}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {weaknesses.length > 0 && (
                  <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-5">
                    <p className="text-[11px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest mb-3">🔧 보완점</p>
                    <ul className="space-y-2">
                      {weaknesses.map((w, i) => (
                        <li key={i} className="text-[13px] leading-6 text-slate-700 dark:text-slate-300">• {w.feedbackContent}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 카테고리별 상세 피드백 */}
            {details.length > 0 && (
              <div className="space-y-3">
                <p className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide">카테고리별 피드백</p>
                {details.map((item, i) => {
                  const meta = FEEDBACK_META[item.feedbackType] ?? { label: item.feedbackType, color: "#64748b", bg: "#f8fafc" };
                  return (
                    <div key={i} className="rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
                      <span
                        className="inline-block rounded-full px-3 py-0.5 text-[11px] font-black mb-2"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <p className="text-[13px] leading-7 text-slate-700 dark:text-slate-300">{item.feedbackContent}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })()}

      {/* ══ 하단 버튼 ══ */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/interview-report/${jobPostingId}`)}
          className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 font-black text-white transition-colors text-[15px]"
        >
          면접 결과 보기
        </button>
        <button
          onClick={() => navigate(`/report/${jobPostingId}`)}
          className="flex-1 rounded-2xl border-2 border-blue-600 py-4 font-black text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-[15px]"
        >
          기업 리포트 보기
        </button>
      </div>

    </div>
  );
}
