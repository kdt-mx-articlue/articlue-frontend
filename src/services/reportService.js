import api from "../api/axios.js";

/**
 * localStorage에서 resumeId 읽기
 */
function getResumeId() {
  try {
    const raw = localStorage.getItem("articlue-resume-store");
    return JSON.parse(raw || "{}")?.state?.resumeId ?? null;
  } catch {
    return null;
  }
}

/**
 * resumeId 없으면 profile API로 fallback 조회 후 localStorage에 저장
 */
export async function resolveResumeId() {
  const id = getResumeId();
  if (id) return id;
  try {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) return null;
    const res = await api.get("/member/profile", { params: { memberId } });
    const fetched = res.data?.data?.resume?.resumeId ?? null;
    if (fetched) {
      try {
        const raw = localStorage.getItem("articlue-resume-store");
        const parsed = JSON.parse(raw || '{"state":{},"version":0}');
        parsed.state.resumeId = fetched;
        localStorage.setItem("articlue-resume-store", JSON.stringify(parsed));
      } catch {}
    }
    return fetched;
  } catch {
    return null;
  }
}

/**
 * GET /api/resumes/:resumeId/recommendations?stage=RESUME|FINAL
 */
async function fetchRecommendations(resumeId, stage) {
  if (!resumeId) return [];
  try {
    const res = await api.get(`/resumes/${resumeId}/recommendations`, {
      params: { stage },
    });
    const raw = res.data?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    console.error(`[reportService] recommendations(${stage}) 실패:`, e);
    return [];
  }
}

async function fetchActionPlan(resumeId, jobPostingId) {
  if (!resumeId || !jobPostingId) return null;
  try {
    const res = await api.get(`/resumes/${resumeId}/action-plan`, {
      params: { jobPostingId },
    });
    return res.data?.data ?? null;
  } catch (e) {
    console.error(`[reportService] action-plan 조회 실패:`, e);
    return null;
  }
}

export async function getReportData(jobPostingId) {
  const resumeId = await resolveResumeId();
  const jpId = Number(jobPostingId);

  const [resumeList, finalList, actionData] = await Promise.all([
    fetchRecommendations(resumeId, "RESUME"),
    fetchRecommendations(resumeId, "FINAL"),
    fetchActionPlan(resumeId, jpId),
  ]);

  const resumeAnalysis = resumeList.find((r) => r.jobPostingId === jpId) ?? null;
  const finalAnalysis  = finalList.find((r) => r.jobPostingId === jpId)  ?? null;

  // weaknesses는 1차/2차 공통, recommendations는 stage별 분리
  const buildActionPlan = (recommendations) =>
    actionData
      ? { weaknesses: actionData.weaknesses ?? [], recommendations }
      : null;

  return {
    resumeAnalysis,
    finalAnalysis,
    resumeActionPlan: buildActionPlan(actionData?.resumeRecommendations ?? []),
    finalActionPlan:  buildActionPlan(actionData?.finalRecommendations  ?? []),
  };
}
