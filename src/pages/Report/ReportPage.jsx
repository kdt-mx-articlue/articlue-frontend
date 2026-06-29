import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  HiBriefcase, HiLightBulb, HiCode,
  HiClipboardCheck, HiUserGroup,
  HiExclamationCircle, HiBookOpen,
  HiExternalLink, HiChevronUp, HiChevronDown,
} from "react-icons/hi";

import ReportRadarChart from "../../components/report/ReportRadarChart";
import { getReportData, requestDetailAnalysis } from "../../services/reportService";

/* ── 메타 ── */
const METRIC_META = {
  business_fit:      { label: "비즈니스 핏",  icon: <HiBriefcase /> },
  action_result_fit: { label: "문제 해결",    icon: <HiLightBulb /> },
  tech_stack_fit:    { label: "기술 스택",    icon: <HiCode /> },
  requirement_fit:   { label: "요구사항",     icon: <HiClipboardCheck /> },
  culture_fit:       { label: "문화 적합도",  icon: <HiUserGroup /> },
};

const METRIC_ORDER = ["business_fit", "tech_stack_fit", "requirement_fit", "action_result_fit", "culture_fit"];

function sortMetrics(metrics) {
  return Object.entries(metrics ?? {}).sort(
    ([a], [b]) => METRIC_ORDER.indexOf(a) - METRIC_ORDER.indexOf(b)
  );
}

function scoreColor(s) {
  if (s >= 90) return "text-emerald-500";
  if (s >= 75) return "text-blue-500";
  if (s >= 60) return "text-yellow-500";
  return "text-red-500";
}
function barColor(s) {
  if (s >= 90) return "bg-emerald-500";
  if (s >= 75) return "bg-blue-500";
  if (s >= 60) return "bg-yellow-400";
  return "bg-red-400";
}

/* ── 프로그레스바 ── */
function ScoreBar({ score }) {
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
      <div
        className={`h-1.5 rounded-full ${barColor(score)}`}
        style={{ width: `${Math.min(score, 100)}%` }}
      />
    </div>
  );
}

/* ── 메트릭 카드 ── */
function MetricCard({ metricKey, data }) {
  const meta = METRIC_META[metricKey] ?? { label: metricKey, icon: null };
  const s = Number(data.score);
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 text-[16px]">
            {meta.icon}
          </span>
          <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{meta.label}</span>
        </div>
        <span className={`text-[18px] font-black ${scoreColor(s)}`}>{s.toFixed(1)}%</span>
      </div>
      <ScoreBar score={s} />
      <p className="mt-2 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{data.reasonText ?? data.reason_text}</p>
    </div>
  );
}

/* ── 취약점 카드 ── */
function WeaknessCard({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-4 mb-3">
      <span className="mt-0.5 flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-400 text-[16px]">
        <HiExclamationCircle />
      </span>
      <div>
        <div className="text-[13px] font-black text-slate-800 dark:text-slate-200">{item.title}</div>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
      </div>
    </div>
  );
}

/* ── 추천 카드 ── */
function RecommendCard({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 p-4 mb-3">
      <span className="mt-0.5 flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 text-[16px]">
        <HiBookOpen />
      </span>
      <div>
        <div className="text-[13px] font-black text-slate-800 dark:text-slate-200">{item.title}</div>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
      </div>
    </div>
  );
}

/* ── 2차 미완료 플레이스홀더 ── */
function EmptyFinalCard({ navigate, jobPostingId }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-8 text-center">
      <div className="text-3xl mb-3">🎯</div>
      <p className="text-[13px] font-bold text-slate-600 dark:text-slate-300 mb-1">면접 분석 미완료</p>
      <p className="text-[12px] text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
        모의 면접 완료 후<br />여기에 표시됩니다.
      </p>
      <button
        onClick={() => navigate(`/interview/setup/${jobPostingId}`)}
        className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-[12px] font-black text-white transition-colors"
      >
        면접 시작하기
      </button>
    </div>
  );
}

export default function ReportPage() {
  const navigate = useNavigate();
  const { jobPostingId } = useParams();
  const [report, setReport] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1. 리포트 데이터 로드
      const data = await getReportData(jobPostingId);
      if (cancelled) return;
      setReport(data);

      // 2. 1차 점수는 있는데 action plan이 없으면 자동으로 상세 분석 트리거
      const score = data.resumeAnalysis?.overallScore ?? data.resumeAnalysis?.overall_score;
      const hasActionPlan =
        (data.resumeActionPlan?.weaknesses?.length ?? 0) > 0 ||
        (data.resumeActionPlan?.recommendations?.length ?? 0) > 0;

      if (score != null && !hasActionPlan) {
        setAnalyzing(true);
        try {
          await requestDetailAnalysis(jobPostingId);
          if (cancelled) return;
          const refreshed = await getReportData(jobPostingId);
          if (!cancelled) setReport(refreshed);
        } catch (e) {
          console.error("[ReportPage] 자동 상세 분석 실패:", e);
        } finally {
          if (!cancelled) setAnalyzing(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [jobPostingId]);

  if (!report) {
    return (
      <div className="flex h-[500px] items-center justify-center text-slate-400 dark:text-slate-500">
        불러오는 중...
      </div>
    );
  }

  const { resumeAnalysis, finalAnalysis, resumeActionPlan, finalActionPlan } = report;

  /* camelCase(실API) + snake_case(mock) 모두 대응 */
  const companyName   = resumeAnalysis?.companyName   ?? resumeAnalysis?.company_name;
  const jobName       = resumeAnalysis?.jobName       ?? resumeAnalysis?.job_name;
  const careerLevel   = resumeAnalysis?.careerCondition ?? resumeAnalysis?.career_level;
  const deadlineDate  = resumeAnalysis?.deadlineDate  ?? resumeAnalysis?.deadline;
  const applyUrl      = resumeAnalysis?.originalUrl   ?? resumeAnalysis?.apply_url;
  const overallScore1 = resumeAnalysis?.overallScore  ?? resumeAnalysis?.overall_score;
  const overallScore2 = finalAnalysis?.overallScore   ?? finalAnalysis?.overall_score;

  /* tech_stacks는 실API에 없음 — 빈 배열 */
  const techs = resumeAnalysis?.tech_stacks
    ? String(resumeAnalysis.tech_stacks).split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const delta = finalAnalysis
    ? Number(overallScore2 - overallScore1).toFixed(1)
    : null;

  function handleInterviewReport() {
    if (!finalAnalysis) {
      alert("아직 면접 결과가 없습니다.\n모의 면접을 먼저 진행해주세요.");
      return;
    }
    navigate(`/interview-report/${jobPostingId}`);
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-8 pb-16">

      {/* ══ 헤더 ══ */}
      <section className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-300">
            기업 분석 리포트
          </span>
          {careerLevel && (
            <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {careerLevel}
            </span>
          )}
          {deadlineDate && (
            <span className="rounded-full bg-amber-50 dark:bg-amber-900/30 px-2.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              마감 {deadlineDate}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{companyName}</h1>
            <p className="mt-1.5 text-base text-slate-500 dark:text-slate-400 font-medium">{jobName}</p>
          </div>
          {applyUrl && (
            <a href={applyUrl} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-blue-300 transition-colors">
              지원 페이지 <HiExternalLink />
            </a>
          )}
        </div>

        {techs.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <span key={t} className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-300">{t}</span>
            ))}
          </div>
        )}
      </section>

      {/* ══ 종합 점수 비교 ══ */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* 1차 */}
        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">1차 · 이력서 매칭</div>
          {overallScore1 != null ? (
            <>
              <div className={`text-6xl font-black ${scoreColor(overallScore1)}`}>
                {Number(overallScore1).toFixed(1)}<span className="text-3xl">%</span>
              </div>
              <p className="mt-1 text-[12px] text-slate-400 dark:text-slate-500">서류 기반 직무 매칭 분석</p>
              <ReportRadarChart metrics={resumeAnalysis?.metrics} />
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-slate-400 dark:text-slate-500">
              <div className="text-center">
                <p className="text-[20px] font-black text-slate-300">분석 전</p>
                <p className="mt-2 text-[13px]">이력서를 제출하면 분석 결과가 표시됩니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* 2차 */}
        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">2차 · 면접 적합도</span>
            {delta && (
              <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                Number(delta) >= 0
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-900/30 text-red-500"
              }`}>
                {Number(delta) >= 0 ? <HiChevronUp /> : <HiChevronDown />}
                {Math.abs(delta)}%
              </span>
            )}
          </div>
          {finalAnalysis ? (
            <>
              <div className={`text-6xl font-black ${scoreColor(overallScore2)}`}>
                {Number(overallScore2).toFixed(1)}<span className="text-3xl">%</span>
              </div>
              <p className="mt-1 text-[12px] text-slate-400 dark:text-slate-500">면접 기반 직무 적합 분석</p>
              <ReportRadarChart metrics={finalAnalysis.metrics} />
            </>
          ) : (
            <EmptyFinalCard navigate={navigate} jobPostingId={jobPostingId} />
          )}
        </div>
      </section>

      {/* ══ 역량 상세 ══ */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-black text-slate-900 dark:text-white">1차 역량 상세</h2>
          {sortMetrics(resumeAnalysis?.metrics).map(([k, v]) => (
            <MetricCard key={k} metricKey={k} data={v} />
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-black text-slate-900 dark:text-white">2차 역량 상세</h2>
          {finalAnalysis
            ? sortMetrics(finalAnalysis.metrics).map(([k, v]) => (
                <MetricCard key={k} metricKey={k} data={v} />
              ))
            : <EmptyFinalCard navigate={navigate} jobPostingId={jobPostingId} />
          }
        </div>
      </section>

      {/* ══ 취약점 ══ */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-black text-slate-900 dark:text-white">1차 보완 필요 항목</h2>
          {resumeActionPlan?.weaknesses?.length > 0
            ? resumeActionPlan.weaknesses
                .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
                .map((item) => <WeaknessCard key={item.title} item={item} />)
            : overallScore1 != null
              ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">AI 상세 분석을 진행 중입니다…</p>
                </div>
              )
              : <p className="text-sm text-slate-400 dark:text-slate-500">이력서를 제출하면 분석 결과가 표시됩니다.</p>
          }
        </div>

        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-black text-slate-900 dark:text-white">2차 보완 필요 항목</h2>
          {finalAnalysis
            ? finalActionPlan?.weaknesses
                ?.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
                .map((item) => <WeaknessCard key={item.title} item={item} />)
            : <EmptyFinalCard navigate={navigate} jobPostingId={jobPostingId} />
          }
        </div>
      </section>

      {/* ══ 액션 플랜 ══ */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-black text-slate-900 dark:text-white">1차 추천 액션 플랜</h2>
          {resumeActionPlan?.recommendations?.length > 0
            ? resumeActionPlan.recommendations
                .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
                .map((item) => <RecommendCard key={item.title} item={item} />)
            : overallScore1 != null
              ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">AI 상세 분석을 진행 중입니다…</p>
                </div>
              )
              : <p className="text-sm text-slate-400 dark:text-slate-500">이력서를 제출하면 분석 결과가 표시됩니다.</p>
          }
        </div>

        <div className="rounded-[28px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-black text-slate-900 dark:text-white">2차 추천 액션 플랜</h2>
          {finalAnalysis
            ? finalActionPlan?.recommendations
                ?.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
                .map((item) => <RecommendCard key={item.title} item={item} />)
            : <EmptyFinalCard navigate={navigate} jobPostingId={jobPostingId} />
          }
        </div>
      </section>

      {/* ══ 하단 버튼 ══ */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/interview/setup?company=${encodeURIComponent(companyName ?? "")}&job=${encodeURIComponent(jobName ?? "")}`)}
          className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 font-black text-white transition-colors text-[15px]"
        >
          면접 보러 가기
        </button>
        <button
          onClick={handleInterviewReport}
          className="flex-1 rounded-2xl border-2 border-blue-600 py-4 font-black text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-[15px]"
        >
          면접 결과 상세 보기
        </button>
      </div>

    </div>
  );
}
