import api from "./axios.js";

function getMemberId() {
  try {
    return localStorage.getItem("memberId");
  } catch {
    return null;
  }
}

/**
 * GET /api/member/profile?memberId=X
 */
export async function getProfile() {
  const memberId = getMemberId();
  if (!memberId) throw new Error("memberId 없음");
  const res = await api.get("/member/profile", { params: { memberId } });
  return res.data?.data ?? null;
}

/**
 * PUT /api/member/profile?memberId=X
 */
export async function updateProfile(data) {
  const memberId = getMemberId();
  if (!memberId) throw new Error("memberId 없음");
  const res = await api.put("/member/profile", data, { params: { memberId } });
  return res.data;
}
