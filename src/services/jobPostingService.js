import Papa from "papaparse";

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

/**
 * 키워드로 채용공고 검색 (기업명 / 직무명 / 기술스택)
 */
export async function searchJobPostings(keyword = "", size = 50) {
  const data = await loadCSV();
  if (!keyword.trim()) return [];

  const q = keyword.trim().toLowerCase();
  return data
    .filter(
      (item) =>
        item.companyName.toLowerCase().includes(q) ||
        item.jobName.toLowerCase().includes(q) ||
        item.techStacks.toLowerCase().includes(q)
    )
    .slice(0, size);
}

/**
 * ID로 채용공고 상세 조회
 */
export async function getJobPostingDetail(jobPostingId) {
  const data = await loadCSV();
  return data.find((item) => item.jobPostingId === Number(jobPostingId)) ?? null;
}
