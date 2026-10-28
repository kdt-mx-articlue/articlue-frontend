import Papa from "papaparse";
import api from "../api/axios.js";

// CSV 파싱 결과 캐시 (최초 1회만 로드)
let cachedData = null;

async function loadCSV() {
  if (cachedData) return cachedData;

  return new Promise((resolve, reject) => {
    Papa.parse("/job_postings.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // job_posting_id 컬럼이 CSV에 없으면 경고 출력
        // → AI의 job_service.py가 JOB_CSV_PATH를 프론트엔드 public으로 지정해 CSV를 재생성해야 함
        const hasIdColumn = results.meta.fields?.includes("job_posting_id");
        if (!hasIdColumn) {
          console.warn(
            "[jobPostingService] CSV에 job_posting_id 컬럼이 없습니다. " +
            "AI 서비스의 job_service.py를 실행해 CSV를 재생성하세요. " +
            "현재는 행 순서(idx+1)를 ID로 대체합니다."
          );
        }

        cachedData = results.data.map((row, idx) => {
          const explicitId = Number(row.job_posting_id);
          return {
            // CSV에 job_posting_id 컬럼이 있으면 사용, 없으면 행 순서(1-based) 폴백
            jobPostingId:     explicitId > 0 ? explicitId : idx + 1,
            companyName:      row.company_name      ?? "",
            jobName:          row.job_title         ?? "",
            careerLevel:      row.career_level      ?? "",
            deadline:         row.deadline          ?? "",
            applyUrl:         row.apply_url         ?? "",
            techStacks:       row.tech_stacks       ?? "",
            requirements:     row.requirements      ?? "",
            responsibilities: row.responsibilities  ?? "",
          };
        });
        resolve(cachedData);
      },
      error: reject,
    });
  });
}

// 주간 수집으로 추가된 공고는 CSV 에 없으므로 백엔드 API 로 조회 (결과 캐시)
const apiDetailCache = new Map();

function fromApiItem(item) {
  return {
    jobPostingId:     Number(item.jobPostingId),
    companyName:      item.companyName ?? "",
    jobName:          item.postingTitle || item.jobName || "",
    careerLevel:      item.careerCondition ?? "",
    deadline:         item.deadlineDate ? String(item.deadlineDate).slice(0, 10) : "",
    applyUrl:         item.originalUrl ?? "",
    techStacks:       "",
    requirements:     item.qualification ?? "",
    responsibilities: item.mainTask ?? "",
  };
}

async function searchFromApi(keyword, size) {
  try {
    const res = await api.get("/job-postings", { params: { keyword, size } });
    return (res.data?.data?.items ?? []).map(fromApiItem);
  } catch {
    return [];
  }
}

/**
 * 키워드로 채용공고 검색 (기업명 / 직무명 / 기술스택)
 * - CSV(초기 공고, 기술스택 검색 가능) + 백엔드 API(수집 공고 포함) 결과 병합
 */
export async function searchJobPostings(keyword = "", size = 50) {
  if (!keyword.trim()) return [];

  const q = keyword.trim().toLowerCase();
  const [data, apiItems] = await Promise.all([loadCSV(), searchFromApi(keyword.trim(), size)]);

  const csvItems = data.filter(
    (item) =>
      item.companyName.toLowerCase().includes(q) ||
      item.jobName.toLowerCase().includes(q) ||
      item.techStacks.toLowerCase().includes(q)
  );

  const seen = new Set(csvItems.map((item) => item.jobPostingId));
  const merged = [...csvItems, ...apiItems.filter((item) => !seen.has(item.jobPostingId))];

  return merged.slice(0, size);
}

/**
 * ID로 채용공고 상세 조회 (CSV 우선, 없으면 백엔드 API)
 */
export async function getJobPostingDetail(jobPostingId) {
  const id = Number(jobPostingId);
  const data = await loadCSV();
  const fromCsv = data.find((item) => item.jobPostingId === id);

  if (fromCsv) return fromCsv;
  if (apiDetailCache.has(id)) return apiDetailCache.get(id);

  try {
    const res = await api.get(`/job-postings/${id}`);
    const detail = res.data?.data ? fromApiItem(res.data.data) : null;
    apiDetailCache.set(id, detail);
    return detail;
  } catch {
    return null;
  }
}
