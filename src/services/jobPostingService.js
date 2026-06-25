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
        cachedData = results.data.map((row, idx) => ({
          jobPostingId:  idx + 1,
          companyName:   row.company_name   ?? "",
          jobName:       row.job_title      ?? "",
          careerLevel:   row.career_level   ?? "",
          deadline:      row.deadline       ?? "",
          applyUrl:      row.apply_url      ?? "",
          techStacks:    row.tech_stacks    ?? "",
          requirements:  row.requirements   ?? "",
          responsibilities: row.responsibilities ?? "",
        }));
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
