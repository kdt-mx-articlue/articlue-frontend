import Papa from "papaparse";

let cachedData = null;

/**
 * public/job_postings.csv를 fetch → papaparse로 JSON 변환
 * 두 번째 호출부터는 캐시 반환
 */
export async function loadJobPostings() {
  if (cachedData) return cachedData;

  return new Promise((resolve, reject) => {
    Papa.parse("/job_postings.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        cachedData = results.data;
        resolve(cachedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * 회사명 또는 직무명으로 검색
 * @param {string} query
 * @param {Object[]} data - loadJobPostings() 결과
 * @returns {Object[]}
 */
export function searchJobPostings(query, data) {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return data.filter(
    (item) =>
      item.company_name?.toLowerCase().includes(lower) ||
      item.job_title?.toLowerCase().includes(lower)
  );
}
