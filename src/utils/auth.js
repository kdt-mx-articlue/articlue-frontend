const LOGIN_EXPIRE_DAYS = 7;
const LOGIN_EXPIRE_MS = LOGIN_EXPIRE_DAYS * 24 * 60 * 60 * 1000;

export function clearAuthStorage() {
  localStorage.removeItem("articlue_current_user");
  localStorage.removeItem("isLogin");
  localStorage.removeItem("articlue_profile_name");
  localStorage.removeItem("articlue_profile_image");
  localStorage.removeItem("articlue_login_type");
  localStorage.removeItem("articlue_login_at");
  localStorage.removeItem("memberId");
  localStorage.removeItem("naver_oauth_state");
  localStorage.removeItem("github_oauth_state");
  localStorage.removeItem("articlue-resume-store");
  localStorage.removeItem("articlue-favorites");
  localStorage.removeItem("interviewSetup");
  localStorage.removeItem("lastInterviewSessionId");

  sessionStorage.removeItem("githubUser");
  sessionStorage.removeItem("githubSessionId");
  sessionStorage.removeItem("githubDeviceCode");
}

export function isLoginExpired() {
  const loginAt = localStorage.getItem("articlue_login_at");
  if (!loginAt) return true;
  const loginTime = Number(loginAt);
  if (!Number.isFinite(loginTime)) return true;
  return Date.now() - loginTime > LOGIN_EXPIRE_MS;
}

export function isAuthenticated() {
  const isLogin = localStorage.getItem("isLogin") === "true";
  const currentUser = localStorage.getItem("articlue_current_user");
  if (!isLogin || !currentUser) return false;
  if (isLoginExpired()) {
    clearAuthStorage();
    return false;
  }
  return true;
}

export function saveAuthUser(user) {
  const name = user.name || "Articlue 사용자";
  const loginType = user.loginType || user.provider || "local";
  const memberId = user.memberId ?? user.member_id ?? user.id ?? null;

  localStorage.setItem("isLogin", "true");
  localStorage.setItem("articlue_current_user", JSON.stringify(user));
  localStorage.setItem("articlue_profile_name", name);
  localStorage.setItem("articlue_login_type", loginType);
  localStorage.setItem("articlue_login_at", String(Date.now()));

  if (memberId !== null && memberId !== undefined) {
    localStorage.setItem("memberId", String(memberId));
  }
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("articlue_current_user") || "null");
  } catch {
    return null;
  }
}

// memberId가 필요한 곳에서 이 함수 사용
export function getMemberId() {
  const user = getCurrentUser();
  const memberId = user?.memberId ?? user?.member_id ?? user?.id ?? null;
  if (memberId !== null && memberId !== undefined) return memberId;
  const stored = localStorage.getItem("memberId");
  return stored ? Number(stored) : null;
}

export function getLoginType() {
  return localStorage.getItem("articlue_login_type") || "";
}