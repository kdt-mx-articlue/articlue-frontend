import api from "../api/axios.js";
import { resolveResumeId } from "./reportService.js";

function getMemberId() {
  return localStorage.getItem("memberId");
}

/**
 * 공고 텍스트에서 자소서 문항 추출
 * 추출 실패 시 기본 5문항 반환
 */
export async function extractCoverLetterQuestions({ jobDescription }) {
  const res = await api.post("/cover-letters/extract-questions", {
    jobDescription,
  });
  return res.data?.data ?? { questions: [], source: "default" };
}

/**
 * 자소서 생성 요청
 * questions: 사용자가 확인/수정한 문항 배열 (없으면 서버에서 자동 결정)
 */
export async function generateCoverLetter({
  jobPostingId,
  companyName,
  jobTitle,
  jobDescription = "",
  questions = null,
}) {
  const memberId = getMemberId();
  const resumeId = await resolveResumeId();

  if (!resumeId) throw new Error("이력서가 없습니다. 먼저 이력서를 등록해주세요.");

  const res = await api.post("/cover-letters/generate", {
    memberId,
    resumeId,
    jobPostingId,
    companyName,
    jobTitle,
    jobDescription,
    questions,
  });
  return res.data?.data;
}

/**
 * 자소서 목록 조회
 */
export async function getCoverLetters() {
  const memberId = getMemberId();
  if (!memberId) return [];
  const res = await api.get("/cover-letters", { params: { memberId } });
  return res.data?.data ?? [];
}

/**
 * 자소서 상세 조회
 */
export async function getCoverLetterDetail(coverLetterId) {
  const res = await api.get(`/cover-letters/${coverLetterId}`);
  return res.data?.data ?? null;
}

/**
 * 자소서 수정
 */
export async function updateCoverLetter(coverLetterId, items) {
  const res = await api.put(`/cover-letters/${coverLetterId}`, { items });
  return res.data;
}
