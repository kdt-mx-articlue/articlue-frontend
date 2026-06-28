import api from "../api/axios.js";
import { useResumeStore } from "../store/resumeStore.js";
import { getJobPostingDetail } from "./jobPostingService.js";

function getMemberId() {
  try {
    return localStorage.getItem("memberId");
  } catch {
    return null;
  }
}

function getResumeId() {
  try {
    const raw = localStorage.getItem("articlue-resume-store");
    // Zustand persist 포맷: { state: { resume: { resumeId: X } } }
    return JSON.parse(raw || "{}")?.state?.resume?.resumeId ?? null;
  } catch {
    return null;
  }
}

/**
 * 프론트 다른 곳에서 resumeId를 직접 읽어야 할 때 사용
 */
export function getStoredResumeId() {
  return getResumeId();
}

function sortCompanies(companies) {
  const m = (c, k) => c.metrics?.[k]?.score ?? 0;
  return [...companies].sort((a, b) => {
    if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
    if (m(b, "tech_stack_fit")    !== m(a, "tech_stack_fit"))    return m(b, "tech_stack_fit")    - m(a, "tech_stack_fit");
    if (m(b, "business_fit")      !== m(a, "business_fit"))      return m(b, "business_fit")      - m(a, "business_fit");
    if (m(b, "requirement_fit")   !== m(a, "requirement_fit"))   return m(b, "requirement_fit")   - m(a, "requirement_fit");
    if (m(b, "action_result_fit") !== m(a, "action_result_fit")) return m(b, "action_result_fit") - m(a, "action_result_fit");
    return m(b, "culture_fit") - m(a, "culture_fit");
  });
}

/**
 * 항상 profile API로 현재 로그인된 회원의 최신 resumeId를 조회한다.
 * localStorage fast path는 사용하지 않는다:
 *   Zustand persist가 로그아웃 후에도 메모리에 old resumeId를 유지하다가
 *   다음 state 변경 시 localStorage에 다시 write하므로, fast path를
 *   사용하면 다른 계정에서도 동일한 stale resumeId를 보게 되는 버그가 있음.
 */
async function resolveResumeId() {
  const memberId = getMemberId();
  if (!memberId) return null;

  try {
    const profileRes = await api.get("/member/profile", { params: { memberId } });
    const id = profileRes.data?.data?.resume?.resumeId ?? null;
    if (id) {
      useResumeStore.getState().setResumeId(id);
    }
    return id;
  } catch {
    // 네트워크 오류 시에만 localStorage 값으로 fallback
    return getResumeId();
  }
}

export async function loadDashboard() {
  const resumeId = await resolveResumeId();
  let companies = [];

  if (resumeId) {
    try {
      const res = await api.get(`/resumes/${resumeId}/recommendations`, {
        params: { stage: "RESUME" },
      });
      const raw = res.data?.data;
      const arr = Array.isArray(raw) ? raw : (raw?.recommendations ?? []);

      // DB에는 jobPostingId + 점수만 저장됨.
      // CSV에서 회사명/직무명/기술스택 등을 병합해서 카드에 표시한다.
      const enriched = await Promise.all(
        arr.map(async (rec) => {
          try {
            const job = await getJobPostingDetail(rec.jobPostingId);
            return {
              ...rec,
              companyName:      job?.companyName      ?? "",
              jobName:          job?.jobName          ?? "",
              careerLevel:      job?.careerLevel      ?? "",
              deadline:         job?.deadline         ?? "",
              applyUrl:         job?.applyUrl         ?? "",
              tech_stacks:      job?.techStacks       ?? "",  // CompanyCard가 tech_stacks로 읽음
              requirements:     job?.requirements     ?? "",
              responsibilities: job?.responsibilities ?? "",
            };
          } catch {
            return rec; // CSV 조회 실패 시 점수 데이터만이라도 반환
          }
        })
      );

      companies = sortCompanies(enriched);
    } catch (e) {
      console.error("[dashboardService] 추천 기업 로드 실패:", e);
    }
  }

  // 추천 기업 overallScore 평균 → job_readiness
  const jobReadiness = companies.length
    ? +(companies.reduce((sum, c) => sum + (c.overallScore ?? c.overall_score ?? 0), 0) / companies.length).toFixed(1)
    : null;

  return {
    profile: {
      job_readiness: jobReadiness,
    },
    companies,
    topCompanies: companies.slice(0, 3),
    issues: [],
  };
}

/**
 * 관심 기업 클릭 시 resumeId + jobPostingId 기준으로 DB에서 매칭률 단건 조회
 * - 분석 이력이 없으면 null 반환 (에러 아님)
 */
/**
 * MatchingPage 전용 - 추천 기업 목록 로드 + CSV 병합
 * loadDashboard()의 기업 조회 부분을 분리한 경량 버전.
 * resumeId를 함께 반환하여 이후 favorites 매칭률 조회에 재사용.
 * @returns {{ companies: Array, resumeId: number|null }}
 */
export async function loadRecommendations() {
  const resumeId = await resolveResumeId();
  if (!resumeId) return { companies: [], resumeId: null };

  try {
    const res = await api.get(`/resumes/${resumeId}/recommendations`, {
      params: { stage: "RESUME" },
    });
    const raw = res.data?.data;
    const arr = Array.isArray(raw) ? raw : (raw?.recommendations ?? []);

    const enriched = await Promise.all(
      arr.map(async (rec) => {
        try {
          const job = await getJobPostingDetail(rec.jobPostingId);
          return {
            ...rec,
            companyName:      job?.companyName      ?? "",
            jobName:          job?.jobName          ?? "",
            careerLevel:      job?.careerLevel      ?? "",
            deadline:         job?.deadline         ?? "",
            applyUrl:         job?.applyUrl         ?? "",
            tech_stacks:      job?.techStacks       ?? "",
            requirements:     job?.requirements     ?? "",
            responsibilities: job?.responsibilities ?? "",
          };
        } catch {
          return rec;
        }
      })
    );

    return { companies: sortCompanies(enriched), resumeId };
  } catch (e) {
    console.error("[dashboardService] 추천 기업 로드 실패:", e);
    return { companies: [], resumeId };
  }
}

export async function getJobMatchRate(resumeId, jobPostingId, stage = "RESUME") {
  try {
    const res = await api.get(`/resumes/${resumeId}/job-match`, {
      params: { jobPostingId, stage },
    });
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}
