import axiosInstance from "../api/axios";

/* ─── 매핑 테이블 ─── */

const INTERVIEWER_STYLE_MAP = {
  "친절형": "CALM",
  "실무형": "PRACTICAL",
  "압박형": "SHARP",
};

const CHAT_MODE_MAP = {
  "CHATBOT": "TEXT",
  "TTS": "VOICE",
};

/* ─── resumeId 헬퍼 ─── */

function getResumeId() {
  try {
    const raw = localStorage.getItem("articlue-resume-store");
    const parsed = JSON.parse(raw || "{}");
    return parsed?.state?.resume?.resumeId ?? null;
  } catch {
    return null;
  }
}

/** localStorage에 resumeId 없으면 profile API로 조회 후 저장 */
async function resolveResumeId(directId) {
  const id = directId ?? getResumeId();
  if (id) return id;
  try {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) return null;
    const res = await axiosInstance.get("/member/profile", { params: { memberId } });
    const fetched = res.data?.data?.resume?.resumeId ?? null;
    if (fetched) {
      try {
        const raw = localStorage.getItem("articlue-resume-store");
        const parsed = JSON.parse(raw || '{"state":{},"version":0}');
        if (!parsed.state.resume) parsed.state.resume = {};
        parsed.state.resume.resumeId = fetched;
        localStorage.setItem("articlue-resume-store", JSON.stringify(parsed));
      } catch {}
    }
    return fetched;
  } catch {
    return null;
  }
}

/* ─── 면접 시작 ─── */
// POST /api/interviews/sessions

export async function startInterview(setup) {
  const {
    job_posting_id,
    company_name,
    job_name,
    interviewer_type,
    interviewer_style,
    question_count,
    interview_mode,
    chat_mode,
    resume_id,
  } = setup;

  const payload = {
    resumeId:              await resolveResumeId(resume_id),
    jobPostingId:          job_posting_id ?? null,
    targetCompany:         company_name,
    jobPostingTitle:       job_name,
    interviewType:         "GENERAL",
    interviewerStyle:      interviewer_style ?? INTERVIEWER_STYLE_MAP[interviewer_type] ?? "CALM",
    questionSetCount:      Number(question_count),
    maxFollowUpPerQuestion: 3,
    chatMode:              chat_mode ?? CHAT_MODE_MAP[interview_mode] ?? "TEXT",
  };

  const res = await axiosInstance.post("/interviews/sessions", payload);
  return res.data;
}

/* ─── TEXT 답변 제출 ─── */
// POST /api/interviews/sessions/:sessionId/questions/:qaId/answer
// Content-Type: application/json

export async function submitTextAnswer(sessionId, qaId, answerContent) {
  const res = await axiosInstance.post(
    `/interviews/sessions/${sessionId}/questions/${qaId}/answer`,
    { answerContent }
  );
  return res.data;
}

/* ─── VOICE 답변 제출 ─── */
// POST /api/interviews/sessions/:sessionId/questions/:qaId/answer
// Content-Type: multipart/form-data

export async function submitVoiceAnswer(sessionId, qaId, audioBlob) {
  const formData = new FormData();
  formData.append("audioFile", audioBlob, "answer.webm");

  const res = await axiosInstance.post(
    `/interviews/sessions/${sessionId}/questions/${qaId}/answer`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

/* ─── 면접 종료 ─── */
// POST /api/interviews/sessions/:sessionId/finish

export async function finishInterview(sessionId) {
  const res = await axiosInstance.post(
    `/interviews/sessions/${sessionId}/finish`
  );
  return res.data;
}

/* ─── 모의 면접 이용 한도 ─── */
// GET /api/interviews/quota → { isDemo, limit, used, remaining, voiceAllowed }
// 실제 제한은 면접 시작 API 가 검사하고, 화면은 표시·안내에만 사용
export async function getInterviewQuota() {
  const memberId = localStorage.getItem("memberId");
  if (!memberId) return null;
  try {
    const res = await axiosInstance.get("/interviews/quota", { params: { memberId } });
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

/* 면접 시작 실패 사유 — 서버가 보낸 문구(한도 초과, 체험 계정 음성 불가 등) 우선 */
export function getStartErrorMessage(err, fallback) {
  return err?.response?.data?.message || fallback;
}

export async function getSessions() {
  const memberId = localStorage.getItem("memberId");
  if (!memberId) return [];
  const res = await axiosInstance.get("/interviews/sessions", {
    params: { memberId },
  });
  return res.data?.data ?? [];
}
