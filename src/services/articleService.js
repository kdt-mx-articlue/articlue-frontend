import api from "../api/axios.js";

/**
 * GET /api/articles/today
 * 금주의 IT 기사 목록 반환
 * @returns {Promise<Array>} articles 배열
 */
export async function getWeeklyInsights() {
  const res = await api.get("/articles/today");
  // res.data = { success, data: { crawlDate, status, totalCount, articles } }
  return res.data?.data?.articles ?? [];
}
