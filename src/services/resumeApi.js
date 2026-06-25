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

/**
 * 백엔드 getResumeDetail 응답 → Zustand store resume 포맷으로 변환
 */
function mapApiResumeToStore(api) {
  const edus = api.educations ?? [];
  const hasGrad = edus.some((e) => e.schoolType === "대학원");
  const hasUniv = edus.some((e) => e.schoolType === "대학교" || e.schoolType === "전문대학");
  const educationType = hasGrad ? "graduate" : hasUniv ? "university" : edus.length ? "highschool" : "";

  const hs = edus.find((e) => e.schoolType === "고등학교") ?? null;
  const univs = edus.filter((e) => e.schoolType === "대학교" || e.schoolType === "전문대학");
  const grads = edus.filter((e) => e.schoolType === "대학원");
  const firstCL = api.coverLetters?.[0] ?? { coverLetterId: null, items: [] };

  return {
    resumeId: api.resumeId,
    resumeInfo: {
      resumeTitle:     api.resumeTitle     ?? "",
      desiredJob:      api.desiredJob      ?? "",
      introduction:    api.introduction    ?? "",
      resumeStatus:    api.resumeStatus    ?? "DRAFT",
      representativeYn: api.representativeYn ?? "N",
    },
    desiredLocations: (api.desiredLocations ?? []).map((d) =>
      typeof d === "string" ? d : d.locationName ?? ""
    ),
    github: {
      connected: (api.githubRepositories?.length ?? 0) > 0,
      githubAccountId: null,
      githubUserId: null,
      login: "",
      htmlUrl: "",
      repositories: api.githubRepositories ?? [],
    },
    techStack: {
      languages: [],
      techs: api.techStacks ?? [],
    },
    education: {
      educationType,
      highschool: {
        educationId:      hs?.educationId ?? null,
        isGed:            hs?.schoolName === "검정고시",
        schoolType:       "고등학교",
        schoolName:       hs?.schoolName === "검정고시" ? "" : (hs?.schoolName ?? ""),
        track:            "",
        major:            hs?.major ?? "",
        graduationStatus: hs?.graduationStatus ?? "졸업",
        gpa:              hs?.gpa ?? "",
        startYm:          hs?.startYm ?? "",
        endYm:            hs?.endYm ?? "",
      },
      universities: univs.length > 0 ? univs.map((u) => ({
        educationId:      u.educationId,
        schoolType:       u.schoolType ?? "대학교",
        schoolName:       u.schoolName ?? "",
        major:            u.major ?? "",
        graduationStatus: u.graduationStatus ?? "재학",
        gpa:              u.gpa ?? "",
        gpaScale:         "4.5",
        startYm:          u.startYm ?? "",
        endYm:            u.endYm ?? "",
      })) : [{ educationId: null, schoolType: "대학교", schoolName: "", major: "", graduationStatus: "재학", gpa: "", gpaScale: "4.5", startYm: "", endYm: "" }],
      graduates: grads.length > 0 ? grads.map((g) => ({
        educationId:      g.educationId,
        schoolType:       g.schoolType ?? "대학원",
        degree:           "석사",
        schoolName:       g.schoolName ?? "",
        major:            g.major ?? "",
        graduationStatus: g.graduationStatus ?? "재학",
        gpa:              g.gpa ?? "",
        gpaScale:         "4.5",
        startYm:          g.startYm ?? "",
        endYm:            g.endYm ?? "",
      })) : [{ educationId: null, schoolType: "대학원", degree: "석사", schoolName: "", major: "", graduationStatus: "재학", gpa: "", gpaScale: "4.5", startYm: "", endYm: "" }],
    },
    experiences: (api.experiences ?? []).length > 0
      ? api.experiences.map((e) => ({
          experienceId:   e.experienceId,
          experienceType: e.experienceType ?? "",
          experienceName: e.experienceName ?? "",
          context:        e.context ?? "",
          startYm:        e.startYm ?? "",
          endYm:          e.endYm ?? "",
        }))
      : [{ experienceId: null, experienceType: "", experienceName: "", context: "", startYm: "", endYm: "" }],
    coverLetter: {
      coverLetterId: firstCL.coverLetterId ?? null,
      items: (firstCL.items ?? []).map((item) => ({
        coverLetterItemId: item.coverLetterItemId,
        questionOrder:     item.questionOrder,
        subTitle:          item.subTitle ?? "",
        content:           item.content ?? "",
      })),
    },
    portfolios: (api.portfolios ?? []).map((p) => ({
      portfolioId:      p.portfolioId,
      portfolioTitle:   "",
      portfolioUrl:     p.filePath ?? p.portfolioUrl ?? "",
      originalFileName: p.originalFileName ?? "",
      fileSize:         p.fileSize ?? 0,
      representativeYn: "N",
    })),
    certificates: (api.certificates ?? []).length > 0
      ? api.certificates.map((c) => ({
          certificateId:   c.certificateId,
          certificateName: c.certificateName ?? "",
          acquiredYm:      c.acquiredYm ?? "",
          issuer:          c.issuer ?? "",
        }))
      : [{ certificateId: null, certificateName: "", acquiredYm: "", issuer: "" }],
    careers: (api.careers ?? []).length > 0
      ? api.careers.map((c) => ({
          careerId:        c.careerId,
          companyName:     c.companyName ?? "",
          department:      c.department ?? "",
          position:        c.position ?? "",
          startYm:         c.startYm ?? "",
          endYm:           c.endYm ?? "",
          mainAchievement: c.mainAchievement ?? "",
        }))
      : [{ careerId: null, companyName: "", department: "", position: "", startYm: "", endYm: "", mainAchievement: "" }],
  };
}

/**
 * GET /api/resumes/:resumeId → Zustand store 포맷으로 변환
 */
export async function loadResume(resumeId) {
  const response = await api.get(`/resumes/${resumeId}`);
  const apiData = response.data?.data;
  if (!apiData) throw new Error("이력서 데이터 없음");
  return mapApiResumeToStore(apiData);
}
