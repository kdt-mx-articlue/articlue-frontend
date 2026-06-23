import api from "../api/axios.js";
import { getMemberId } from "../utils/auth.js";

/**
 * Zustand store의 resume 구조를 백엔드 API payload로 변환
 */
function buildEducations(education) {
  const educations = [];
  const { educationType, highschool, universities, graduates } = education;

  if (!educationType) return educations;

  // 고등학교는 항상 포함 (검정고시 또는 학교명 있는 경우)
  if (highschool.isGed || highschool.schoolName) {
    educations.push({
      schoolType: "고등학교",
      schoolName: highschool.isGed ? "검정고시" : highschool.schoolName,
      major: highschool.major || null,
      graduationStatus: highschool.graduationStatus || "졸업",
      gpa: highschool.gpa || null,
      startYm: highschool.startYm || null,
      endYm: highschool.endYm || null,
    });
  }

  if (educationType === "university" || educationType === "graduate") {
    universities
      .filter((u) => u.schoolName)
      .forEach((u) => {
        educations.push({
          schoolType: u.schoolType || "대학교",
          schoolName: u.schoolName,
          major: u.major || null,
          graduationStatus: u.graduationStatus || null,
          gpa: u.gpa || null,
          startYm: u.startYm || null,
          endYm: u.endYm || null,
        });
      });
  }

  if (educationType === "graduate") {
    graduates
      .filter((g) => g.schoolName)
      .forEach((g) => {
        educations.push({
          schoolType: g.schoolType || "대학원",
          schoolName: g.schoolName,
          major: g.major || null,
          graduationStatus: g.graduationStatus || null,
          gpa: g.gpa || null,
          startYm: g.startYm || null,
          endYm: g.endYm || null,
        });
      });
  }

  return educations;
}

/**
 * store resume → API payload 변환
 */
export function buildResumePayload(resume) {
  return {
    memberId: getMemberId(),

    // 기본 정보
    resumeTitle: resume.resumeInfo.resumeTitle,
    desiredJob: resume.resumeInfo.desiredJob,
    introduction: resume.resumeInfo.introduction,

    // 희망 지역: ["서울", "경기"] → [{ locationName: "서울" }, ...]
    desiredLocations: resume.desiredLocations.map((loc) =>
      typeof loc === "string" ? { locationName: loc } : loc
    ),

    // 학력: 중첩 구조 → flat 배열
    educations: buildEducations(resume.education),

    // 경험
    experiences: resume.experiences,

    // 경력 (선택) - 실제 입력된 항목만
    careers: resume.careers.filter((c) => c.companyName?.trim()),

    // 자격증 (선택) - 실제 입력된 항목만
    certificates: resume.certificates.filter((c) => c.certificateName?.trim()),

    // 자소서: { coverLetterId, items } → [{ items }]
    coverLetters: [resume.coverLetter],

    // 포트폴리오 (선택) - 실제 입력된 항목만
    portfolioFiles: resume.portfolios.filter(
      (p) => p.portfolioUrl?.trim() || p.originalFileName?.trim()
    ),

    // 기술스택
    techStacks: resume.techStack.techs,

    // GitHub
    github: {
      repositoryScope: "RECENT",
    },
  };
}

/**
 * POST /api/resumes
 */
export async function submitResume(resume) {
  const payload = buildResumePayload(resume);
  const response = await api.post("/resumes", payload);
  return response.data;
}
