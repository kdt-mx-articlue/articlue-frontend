import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  HiLightBulb,
  HiCode,
  HiBriefcase,
  HiClipboardCheck,
  HiUserGroup,
  HiCheckCircle,
  HiExclamationCircle,
  HiClock,
  HiChat,
  HiQuestionMarkCircle,
  HiAdjustments,
  HiUser,
  HiBadgeCheck,
  HiSpeakerphone,
} from "react-icons/hi";

import { getInterviewScoreReport } from "../../services/interviewReportService";

/* ── 카테고리별 아이콘 + 색상 ─────────────────────── */
const FEEDBACK_META = {
  LOGIC:    { icon: <HiLightBulb />,      label: "논리적 사고",   color: "#a78bfa", bg: "#f5f3ff" },
  TECH:     { icon: <HiCode />,           label: "기술 이해도",   color: "#2563eb", bg: "#eff6ff" },
  BUSINESS: { icon: <HiBriefcase />,      label: "비즈니스 이해", color: "#f59e0b", bg: "#fffbeb" },
  EVIDENCE: { icon: <HiClipboardCheck />, label: "경험 근거",     color: "#10b981", bg: "#ecfdf5" },
  JOB_FIT:  { icon: <HiUserGroup />,      label: "직무 적합성",   color: "#0ea5e9", bg: "#f0f9ff" },
};

/* ── 세부 점수 항목 ──────────────────────────────── */
const SCORE_ITEMS = [
  { key: "logic_score",              label: "논리력",     category: "LOGIC"    },
  { key: "tech_understanding_score", label: "기술이해",   category: "TECH"     },
  { key: "business_link_score",      label: "비즈니스",   category: "BUSINESS" },
  { key: "evidence_score",           label: "경험근거",   category: "EVIDENCE" },
  { key: "job_fit_score",            label: "직무적합",   category: "JOB_FIT"  },
];

/* ── 면접 모드 배지 ──────────────────────────────── */
function ModeBadge({ mode }) {
  const isTTS = mode === "TTS";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-black"
      style={{
        background: isTTS ? "#fef3c7" : "#eff6ff",
        color: isTTS ? "#d97706" : "#2563eb",
      }}
    >
      {isTTS ? <HiSpeakerphone /> : <HiChat />}
      {isTTS ? "TTS 면접" : "챗봇 면접"}
    </span>
  );
}

/* ── 정보 아이템 ─────────────────────────────────── */
function InfoChip({ icon, label, value }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-4"
      style={{ background: "var(--surface-soft, #f1f5f9)", border: "1px solid var(--border, #e2e8f0)" }}
    >
      <span
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[18px]"
        style={{ background: "#eff6ff", color: "#2563eb" }}
      >
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-bold" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-[14px] font-black" style={{ color: "var(--text-main)" }}>{value}</p>
      </div>
    </div>
  );
}

/* ── 메인 페이지 ─────────────────────────────────── */
export default function InterviewResultPage() {
  const navigate = useNavigate();
  const { jobPostingId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getInterviewScoreReport(jobPostingId);
      setReport(data);
    }
    load();
  }, [jobPostingId]);

  if (!report) {
    return (
      <div className="flex h-[500px] items-center justify-center text-slate-400 text-lg font-bold">
        불러오는 중...
      </div>
    );
  }

  const {
    company_name,
    job_name,
    session_id,
    interview_summary,
    scores,
    strengths,
    weaknesses,
    overall_feedback,
    feedback,
  } = report;

  const durationMin = interview_summary?.duration_seconds
    ? Math.floor(interview_summary.duration_seconds / 60)
    : null;
  const dateStr = interview_summary?.interview_date?.replace("T", " ").slice(0, 16) ?? "-";

  const overallScore = scores.overall_score;
  const scoreGrade =
    overallScore >= 90 ? { label: "S", color: "#7c3aed" } :
    overallScore >= 80 ? { label: "A", color: "#2563eb" } :
    overallScore >= 70 ? { label: "B", color: "#10b981" } :
                         { label: "C", color: "#f59e0b" };

  return (
    <div className="mx-auto max-w-[1120px] space-y-8">

      {/* ① 헤더 */}
      <section
        className="rounded-[28px] p-8"
        style={{ background: "var(--surface, white)" }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <ModeBadge mode={interview_summary?.interview_mode} />
          <span className="text-[12px] font-bold" style={{ color: "var(--text-muted)" }}>
            {dateStr}
          </span>
          <span className="text-[12px] font-bold" style={{ color: "var(--text-muted)" }}>
            · {session_id}
          </span>
        </div>

        <h1 className="text-[32px] font-black" style={{ color: "var(--text-main)" }}>
          {company_name}
        </h1>
        <p className="mt-1 text-[16px]" style={{ color: "var(--text-sub)" }}>{job_name}</p>
      </section>

      {/* ② 총점 + 세부 점수 */}
      <section
        className="rounded-[28px] p-8"
        style={{ background: "var(--surface, white)" }}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

          {/* 왼쪽: 총점 */}
          <div className="flex flex-col items-center justify-center gap-2 lg:w-[220px]">
            <p className="text-[13px] font-bold" style={{ color: "var(--text-muted)" }}>면접 종합 점수</p>
            <div className="relative flex h-[140px] w-[140px] items-center justify-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={scoreGrade.color} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 327} 327`}
                />
              </svg>
              <div className="text-center">
                <p className="text-[28px] font-black leading-none" style={{ color: scoreGrade.color }}>
                  {overallScore.toFixed(1)}
                </p>
                <p className="text-[11px] font-bold mt-1" style={{ color: "var(--text-muted)" }}>/ 100점</p>
              </div>
            </div>
            <span
              className="rounded-full px-4 py-1 text-[13px] font-black text-white"
              style={{ background: scoreGrade.color }}
            >
              등급 {scoreGrade.label}
            </span>
          </div>

          {/* 구분선 */}
          <div className="hidden lg:block w-px self-stretch" style={{ background: "var(--border)" }} />

          {/* 오른쪽: 세부 점수 */}
          <div className="flex-1 space-y-3">
            {SCORE_ITEMS.map(({ key, label, category }) => {
              const meta = FEEDBACK_META[category];
              const val = scores[key];
              return (
                <div key={key} className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[15px]"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </span>
                  <span className="w-[72px] text-[13px] font-bold flex-shrink-0" style={{ color: "var(--text-sub)" }}>
                    {label}
                  </span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "var(--surface-soft, #f1f5f9)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(val, 100)}%`, background: meta.color }}
                    />
                  </div>
                  <span className="w-[52px] text-right text-[13px] font-black" style={{ color: meta.color }}>
                    {val.toFixed(1)}점
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ③ 면접 정보 요약 */}
      <section
        className="rounded-[28px] p-8"
        style={{ background: "var(--surface, white)" }}
      >
        <h2 className="mb-5 text-[20px] font-black" style={{ color: "var(--text-main)" }}>
          면접 정보
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoChip icon={<HiAdjustments />}         label="난이도"      value={interview_summary?.difficulty ?? "-"} />
          <InfoChip icon={<HiUser />}                label="면접관 성향" value={interview_summary?.interviewer_type ?? "-"} />
          <InfoChip icon={<HiQuestionMarkCircle />}  label="질문 수"     value={`${interview_summary?.question_count ?? "-"}개`} />
          <InfoChip icon={<HiClock />}               label="소요 시간"   value={durationMin != null ? `${durationMin}분` : "-"} />
          <InfoChip icon={<HiBadgeCheck />}          label="완료율"      value={`${interview_summary?.completion_rate ?? "-"}%`} />
          <InfoChip icon={<HiChat />}                label="대화 수"     value={`${interview_summary?.chat_log_count ?? "-"}개`} />
        </div>
      </section>

      {/* ④ 세부 평가 */}
      <section
        className="rounded-[28px] p-8"
        style={{ background: "var(--surface, white)" }}
      >
        <h2 className="mb-6 text-[20px] font-black" style={{ color: "var(--text-main)" }}>
          세부 평가
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {feedback.map((item) => {
            const meta = FEEDBACK_META[item.category] ?? {
              icon: <HiLightBulb />, color: "#64748b", bg: "#f1f5f9"
            };
            return (
              <div
                key={item.category}
                className="rounded-2xl p-5"
                style={{
                  border: `1px solid ${meta.color}22`,
                  background: meta.bg,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[18px]"
                      style={{ background: `${meta.color}22`, color: meta.color }}
                    >
                      {meta.icon}
                    </span>
                    <span className="text-[15px] font-black" style={{ color: "var(--text-main)" }}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[18px] font-black" style={{ color: meta.color }}>
                    {item.score.toFixed(1)}점
                  </span>
                </div>

                {/* 점수 바 */}
                <div className="h-1.5 rounded-full mb-3" style={{ background: `${meta.color}22` }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(item.score, 100)}%`, background: meta.color }}
                  />
                </div>

                <p className="text-[13px] leading-6" style={{ color: "var(--text-sub)" }}>
                  {item.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ⑤ 강점 / 보완 필요 */}
      <section className="grid gap-6 lg:grid-cols-2">

        {/* 강점 */}
        <div className="rounded-[28px] p-8" style={{ background: "var(--surface, white)" }}>
          <h2 className="mb-5 text-[20px] font-black" style={{ color: "var(--text-main)" }}>
            💪 강점
          </h2>
          {strengths.map((item) => (
            <div
              key={item.title}
              className="mb-4 rounded-xl border-l-4 p-5"
              style={{
                borderLeftColor: "#34d399",
                borderTop: "1px solid #d1fae5",
                borderRight: "1px solid #d1fae5",
                borderBottom: "1px solid #d1fae5",
                background: "#f0fdf4",
              }}
            >
              <div className="flex items-center gap-2 font-black">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[18px]"
                  style={{ background: "#d1fae5", color: "#059669" }}
                >
                  <HiCheckCircle />
                </span>
                <span style={{ color: "var(--text-main)" }}>{item.title}</span>
              </div>
              <p className="mt-2 text-[13px] leading-6 pl-10" style={{ color: "#374151" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* 보완 필요 */}
        <div className="rounded-[28px] p-8" style={{ background: "var(--surface, white)" }}>
          <h2 className="mb-5 text-[20px] font-black" style={{ color: "var(--text-main)" }}>
            🔧 보완 필요 사항
          </h2>
          {weaknesses.map((item) => (
            <div
              key={item.title}
              className="mb-4 rounded-xl border-l-4 p-5"
              style={{
                borderLeftColor: "#fca5a5",
                borderTop: "1px solid #fee2e2",
                borderRight: "1px solid #fee2e2",
                borderBottom: "1px solid #fee2e2",
                background: "#fff5f5",
              }}
            >
              <div className="flex items-center gap-2 font-black">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[18px]"
                  style={{ background: "#fee2e2", color: "#f87171" }}
                >
                  <HiExclamationCircle />
                </span>
                <span style={{ color: "var(--text-main)" }}>{item.title}</span>
              </div>
              <p className="mt-2 text-[13px] leading-6 pl-10" style={{ color: "#374151" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ⑥ 종합 평가 */}
      <section
        className="rounded-[28px] border-l-8 border-blue-600 p-8"
        style={{ background: "var(--blue-50, #eff6ff)" }}
      >
        <h2 className="mb-4 text-[20px] font-black text-blue-700">종합 평가</h2>
        <p className="text-[15px] leading-8" style={{ color: "var(--text-sub)" }}>
          {overall_feedback}
        </p>
      </section>

      {/* ⑦ 버튼 */}
      <section className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/interview")}
          className="flex-1 rounded-xl border py-4 text-[14px] font-black transition hover:opacity-80"
          style={{ borderColor: "var(--border)", color: "var(--text-sub)", background: "var(--surface)" }}
        >
          새 면접 보기
        </button>
        <button
          onClick={() => navigate(`/interview-history/${jobPostingId}`)}
          className="flex-1 rounded-xl border py-4 text-[14px] font-black transition hover:opacity-80"
          style={{ borderColor: "var(--border)", color: "var(--text-sub)", background: "var(--surface)" }}
        >
          면접 채팅 기록 보기
        </button>
        <button
          onClick={() => navigate(`/interview/setup/${jobPostingId}`)}
          className="flex-1 rounded-xl bg-blue-600 py-4 text-[14px] font-black text-white transition hover:bg-blue-700"
        >
          해당 공고 면접 다시 보기
        </button>
        <button
          onClick={() => navigate(`/report/${jobPostingId}`)}
          className="flex-1 rounded-xl border border-blue-600 py-4 text-[14px] font-black text-blue-600 transition hover:bg-blue-50"
        >
          기업 리포트 보기
        </button>
      </section>

    </div>
  );
}
