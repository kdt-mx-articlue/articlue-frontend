import api from "../api/axios.js";

export async function signup(payload) {
  const response = await api.post("/auth/signup", payload);
  return response.data;
}

export async function login(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function getMe() {
  const response = await api.get("/members/me");
  return response.data;
}

export async function githubAuthLogin(payload = {}) {
  const response = await api.post("/github/auth/login", payload);
  return response.data;
}

export async function githubAuthToken(payload = {}) {
  const response = await api.post("/github/auth/token", payload);
  return response.data;
}

export async function getGithubMe() {
  const response = await api.get("/github/info");
  return response.data;
}

// 카카오 로그인 - code를 백엔드로 전달
export async function kakaoLoginApi(code) {
  const response = await api.post("/auth/kakao", { code });
  return response.data;
}

// 네이버 로그인 - code, state를 백엔드로 전달
export async function naverCallbackApi(code, state) {
  const response = await api.get("/auth/naver/callback", { params: { code, state } });
  return response.data;
}