import api from "../api/axios.js";

function getLastSessionId() {
  try {
    const raw = localStorage.getItem("lastInterviewSessionId");
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/interviews/sessions/:sessionId/history
 * InterviewHistoryPage용 — Q&A 채팅 기록
 */
export async function getInterviewReport(jobPostingId) {
  const sessionId = getLastSessionId();
  if (!sessionId) return null;

  try {
    const res = await api.get(`/interviews/sessions/${sessionId}/history`);
    return res.data?.data ?? null;
  } catch (e) {
    console.error("[interviewReportService] 면접 이력 로드 실패:", e);
    return null;
  }
}

/**
 * InterviewResultPage용
 * — /history (세션 정보) + /report (점수·피드백) 를 합쳐 UI 구조로 변환
 */
export async function getInterviewScoreReport(jobPostingId) {
  const sessionId = getLastSessionId();
  if (!sessionId) return null;

  try {
    const [historyRes, reportRes] = await Promise.all([
      api.get(`/interviews/sessions/${sessionId}/history`),
      api.get(`/interviews/sessions/${sessionId}/report`),
    ]);

    const session = historyRes.data?.data ?? null;
    const reportItems = reportRes.data?.data ?? [];

    if (!session && reportItems.length === 0) return null;

    /* ── 점수: 첫 번째 항목 기준 (모든 항목 동일 세션) ── */
    const first = reportItems[0] ?? {};
    const scores = {
      overall_score:            Number(first.totalScore             ?? 0),
      logic_score:              Number(first.logicScore             ?? 0),
      tech_understanding_score: Number(first.techUnderstandingScore ?? 0),
      business_link_score:      Number(first.businessLinkScore      ?? 0),
      evidence_score:           Number(first.evidenceScore          ?? 0),
      job_fit_score:            Number(first.jobFitScore            ?? 0),
    };

    /* ── 피드백 항목 → 카테고리별 분류 ── */
    const FEEDBACK_TYPE_MAP = {
      STRENGTH:        { category: "STRENGTH",  label: "강점" },
      WEAKNESS:        { category: "WEAKNESS",  label: "보완" },
      WEAKNESS_POINT:  { category: "WEAKNESS",  label: "보완" },
      OVERALL:         { category: "OVERALL",   label: "종합" },
      LOGIC:           { category: "LOGIC",     label: "논리력" },
      TECH:            { category: "TECH",      label: "기술이해" },
      BUSINESS:        { category: "BUSINESS",  label: "비즈니스" },
      EVIDENCE:        { category: "EVIDENCE",  label: "경험근거" },
      JOB_FIT:         { category: "JOB_FIT",   label: "직무적합" },
    };

    const strengths    = [];
    const weaknesses   = [];
    let overallFeedback = "";
    const feedback     = [];

    reportItems.forEach((item) => {
      const type = (item.feedbackType ?? "").toUpperCase();
      const mapped = FEEDBACK_TYPE_MAP[type] ?? { category: type, label: type };
      const text = item.feedbackContent ?? "";

      if (type === "STRENGTH") {
        strengths.push({ title: "강점", description: text });
      } else if (type === "WEAKNESS" || type === "WEAKNESS_POINT") {
        weaknesses.push({ title: "보완 필요", description: text });
      } else if (type === "OVERALL") {
        overallFeedback = text;
      } else {
        feedback.push({
          category: mapped.category,
          title:    mapped.label,
          score:    Number(first.totalScore ?? 0),
          feedback: text,
        });
      }
    });

    /* ── 세션 요약 정보 ── */
    const durationSec = session?.startTime && session?.endTime
      ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / 1000)
      : null;

    const totalQ = session?.totalQuestionCount ?? 0;
    const totalA = session?.totalAnswerCount   ?? 0;

    const interview_summary = {
      interview_mode:    session?.interviewType   ?? "-",
      interview_date:    session?.startTime       ?? null,
      difficulty:        session?.interviewLevel  ?? "-",
      interviewer_type:  "AI 면접관",
      question_count:    totalQ,
      chat_log_count:    totalA,
      duration_seconds:  durationSec,
      completion_rate:   totalQ > 0 ? Math.round((totalA / totalQ) * 100) : 0,
    };

    return {
      session_id:       sessionId,
      company_name:     session?.companyName ?? "-",
      job_name:         session?.jobName     ?? "-",
      interview_summary,
      scores,
      strengths,
      weaknesses,
      overall_feedback: overallFeedback,
      feedback,
    };

  } catch (e) {
    console.error("[interviewReportService] 면접 점수 리포트 로드 실패:", e);
    return null;
  }
}
