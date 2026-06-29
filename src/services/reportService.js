import api from "../api/axios.js";

/**
 * localStorage에서 resumeId 읽기 (네트워크 오류 fallback 전용)
 * Zustand persist 포맷: { state: { resume: { resumeId: X } } }
 */
function getResumeId() {
  try {
    const raw = localStorage.getItem("articlue-resume-store");
    return JSON.parse(raw || "{}")?.state?.resume?.resumeId ?? null;
  } catch {
    return null;
  }
}

/**
 * 항상 profile API로 현재 로그인된 회원의 최신 resumeId를 조회한다.
 * localStorage fast path 사용 안 함:
 *   - Zustand persist가 로그아웃 후에도 메모리에 old resumeId를 유지해 재write하는 버그
 *   - reportService 구버전이 state.resumeId(잘못된 경로)에 값을 써서 state.resume.resumeId(올바른 경로)와 불일치하는 버그
 * 두 이유로 localStorage를 신뢰할 수 없음.
 */
export async function resolveResumeId() {
  const memberId = localStorage.getItem("memberId");
  if (!memberId) return null;

  try {
    const res = await api.get("/member/profile", { params: { memberId } });
    const fetched = res.data?.data?.resume?.resumeId ?? null;
    return fetched;
  } catch {
    // 네트워크 오류 시에만 localStorage 값으로 fallback
    return getResumeId();
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

/**
 * 특정 공고에 대한 GPT 상세 분석 온디맨드 요청
 * action plan이 없는 공고에 대해 ReportPage에서 호출된다.
 */
export async function requestDetailAnalysis(jobPostingId) {
  const resumeId = await resolveResumeId();
  if (!resumeId) throw new Error("resumeId를 확인할 수 없습니다.");

  const res = await api.post(
    `/resumes/${resumeId}/analyze-detail`,
    {},
    { params: { jobPostingId }, timeout: 0 }
  );
  return res.data;
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
