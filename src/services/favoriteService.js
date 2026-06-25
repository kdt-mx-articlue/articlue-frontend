/**
 * 찜한 기업 — localStorage 기반
 *
 * key: "articlue-favorites"
 * value: { [jobPostingId]: company_object }
 *
 * company_object는 CompanyCard에서 쓰는 camelCase 필드 기준으로 저장.
 */

const KEY = "articlue-favorites";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function save(map) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

/** 모든 찜 기업 배열 반환 */
export function getFavorites() {
  return Object.values(load());
}

/** 특정 jobPostingId가 찜 상태인지 */
export function isFavorite(jobPostingId) {
  if (!jobPostingId) return false;
  return String(jobPostingId) in load();
}

/** 찜 토글 — 이미 찜이면 해제, 아니면 추가 */
export function toggleFavorite(company) {
  const id = company?.jobPostingId ?? company?.job_posting_id;
  if (!id) return;
  const map = load();
  if (String(id) in map) {
    delete map[String(id)];
  } else {
    map[String(id)] = company;
  }
  save(map);
}

/** 명시적 추가 */
export function addFavorite(company) {
  const id = company?.jobPostingId ?? company?.job_posting_id;
  if (!id) return;
  const map = load();
  map[String(id)] = company;
  save(map);
}

/** 명시적 제거 */
export function removeFavorite(jobPostingId) {
  if (!jobPostingId) return;
  const map = load();
  delete map[String(jobPostingId)];
  save(map);
}
