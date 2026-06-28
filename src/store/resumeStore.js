import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =========================
   Factory Functions
========================= */

const createUniversity = () => ({
  educationId: null,

  schoolType: "대학교",

  schoolName: "",

  major: "",

  graduationStatus: "재학",

  gpa: "",

  gpaScale: "4.5",

  startYm: "",

  endYm: "",
});

const createGraduate = () => ({
  educationId: null,

  schoolType: "대학원",

  degree: "석사",

  schoolName: "",

  major: "",

  graduationStatus: "재학",

  gpa: "",

  gpaScale: "4.5",

  startYm: "",

  endYm: "",
});

const createExperience = () => ({
  experienceId: null,

  experienceType: "",

  experienceName: "",

  context: "",

  startYm: "",

  endYm: "",
});

const createCoverLetterItem = (
  questionOrder = 1
) => ({
  coverLetterItemId: null,

  questionOrder,

  subTitle: "",

  content: "",
});

const createCertificate = () => ({
  certificateId: null,

  certificateName: "",

  acquiredYm: "",

  issuer: "",
});

const createCareer = () => ({
  careerId: null,

  companyName: "",

  department: "",

  position: "",

  startYm: "",

  endYm: "",

  mainAchievement: "",
});

const createPortfolio = () => ({
  portfolioId: null,

  portfolioTitle: "",

  portfolioUrl: "",

  originalFileName: "",

  fileSize: 0,

  representativeYn: "N",
});

/* =========================
   Initial State
========================= */

const initialResumeState = {
  resumeId: null,

  resumeInfo: {
    resumeTitle: "",

    desiredJob: "",

    introduction: "",

    resumeStatus: "DRAFT",

    representativeYn: "N",
  },

  desiredLocations: [],

  github: {
    connected: false,

    githubAccountId: null,

    githubUserId: null,

    login: "",

    htmlUrl: "",

    repositories: [],
  },

  techStack: {
    languages: [],

    techs: [],
  },

  education: {
    educationType: "",

    highschool: {
        educationId: null,

        isGed: false,

        schoolType: "고등학교",

        schoolName: "",

        track: "",

        major: "",

        graduationStatus: "졸업",

        gpa: "",

        startYm: "",

        endYm: "",
        },

    universities: [createUniversity()],

    graduates: [createGraduate()],
  },

  experiences: [createExperience()],

  coverLetter: {
    coverLetterId: null,

    items: [
      {
        questionOrder: 1,
        subTitle: "지원 동기",
        content: "",
      },
      {
        questionOrder: 2,
        subTitle: "프로젝트 경험",
        content: "",
      },
      {
        questionOrder: 3,
        subTitle: "입사 후 성장 목표",
        content: "",
      },
    ],
  },

  portfolios: [],

  certificates: [createCertificate()],

  careers: [createCareer()],
};

/* =========================
   Store
========================= */

export const useResumeStore = create(
  persist(
    (set) => ({
      resume: initialResumeState,

      /* =========================
         Common
      ========================= */

      setResume: (resume) =>
        set({
          resume,
        }),

      resetResume: () =>
        set({
          resume: structuredClone(
            initialResumeState
          ),
        }),

      setResumeId: (resumeId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            resumeId,
          },
        })),

      /* =========================
         Resume Info
      ========================= */

      updateResumeInfo: (payload) =>
        set((state) => ({
          resume: {
            ...state.resume,

            resumeInfo: {
              ...state.resume.resumeInfo,

              ...payload,
            },
          },
        })),

      updateDesiredLocations: (
        desiredLocations
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,
            desiredLocations,
            },
        })),

      /* =========================
         Github
      ========================= */

      updateGithub: (payload) =>
        set((state) => ({
          resume: {
            ...state.resume,

            github: {
              ...state.resume.github,

              ...payload,
            },
          },
        })),

      setGithubRepositories: (
        repositories
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,

            github: {
                ...state.resume.github,

                repositories,
            },
            },
        })),

      /* =========================
         Tech Stack
      ========================= */

      updateTechStack: (payload) =>
        set((state) => ({
          resume: {
            ...state.resume,

            techStack: {
              ...state.resume.techStack,

              ...payload,
            },
          },
        })),

      addTech: (tech) =>
        set((state) => ({
            resume: {
            ...state.resume,

            techStack: {
                ...state.resume.techStack,

                techs: [
                ...state.resume.techStack.techs,
                tech,
                ],
            },
            },
        })),

        removeTech: (
        techCode
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,

            techStack: {
                ...state.resume.techStack,

                techs:
                state.resume.techStack.techs.filter(
                    (item) =>
                    item.techCategoryCode !==
                    techCode
                ),
            },
            },
        })),

      /* =========================
         Education
      ========================= */

      updateEducationType: (
        educationType
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              educationType,
            },
          },
        })),

      updateHighschool: (
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              highschool: {
                ...state.resume.education
                  .highschool,

                ...payload,
              },
            },
          },
        })),

      addUniversity: () =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              universities: [
                ...state.resume.education
                  .universities,

                createUniversity(),
              ],
            },
          },
        })),

      updateUniversity: (
        index,
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              universities:
                state.resume.education.universities.map(
                  (
                    university,
                    i
                  ) =>
                    i === index
                      ? {
                          ...university,
                          ...payload,
                        }
                      : university
                ),
            },
          },
        })),

      removeUniversity: (
        index
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              universities:
                state.resume.education.universities.filter(
                  (_, i) =>
                    i !== index
                ),
            },
          },
        })),

      addGraduate: () =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              graduates: [
                ...state.resume.education
                  .graduates,

                createGraduate(),
              ],
            },
          },
        })),

      updateGraduate: (
        index,
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              graduates:
                state.resume.education.graduates.map(
                  (
                    graduate,
                    i
                  ) =>
                    i === index
                      ? {
                          ...graduate,
                          ...payload,
                        }
                      : graduate
                ),
            },
          },
        })),

      removeGraduate: (
        index
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            education: {
              ...state.resume.education,

              graduates:
                state.resume.education.graduates.filter(
                  (_, i) =>
                    i !== index
                ),
            },
          },
        })),

      /* =========================
         Experience
      ========================= */

      addExperience: () =>
        set((state) => ({
          resume: {
            ...state.resume,

            experiences: [
              ...state.resume.experiences,

              createExperience(),
            ],
          },
        })),

      updateExperience: (
        index,
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            experiences:
              state.resume.experiences.map(
                (
                  experience,
                  i
                ) =>
                  i === index
                    ? {
                        ...experience,
                        ...payload,
                      }
                    : experience
              ),
          },
        })),

      removeExperience: (
        index
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            experiences:
              state.resume.experiences.filter(
                (_, i) =>
                  i !== index
              ),
          },
        })),

      /* =========================
         Cover Letter
      ========================= */

      updateCoverLetterItem: (
        index,
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            coverLetter: {
              ...state.resume.coverLetter,

              items:
                state.resume.coverLetter.items.map(
                  (
                    item,
                    i
                  ) =>
                    i === index
                      ? {
                          ...item,
                          ...payload,
                        }
                      : item
                ),
            },
          },
        })),

      addCoverLetterItem: () =>
        set((state) => ({
            resume: {
            ...state.resume,

            coverLetter: {
                ...state.resume.coverLetter,

                items: [
                ...state.resume.coverLetter.items,

                createCoverLetterItem(
                    state.resume.coverLetter
                    .items.length + 1
                ),
                ],
            },
            },
        })),

        removeCoverLetterItem: (
        index
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,

            coverLetter: {
                ...state.resume.coverLetter,

                items:
                state.resume.coverLetter.items
                    .filter(
                    (_, i) =>
                        i !== index
                    )
                    .map(
                    (
                        item,
                        idx
                    ) => ({
                        ...item,

                        questionOrder:
                        idx + 1,
                    })
                    ),
            },
            },
        })),

      /* =========================
        Portfolio
        ========================= */

        addPortfolio: (
        portfolio
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,

            portfolios: [
                ...state.resume.portfolios,
                portfolio,
            ],
            },
        })),

        updatePortfolio: (
        index,
        payload
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,

            portfolios:
                state.resume.portfolios.map(
                (
                    portfolio,
                    i
                ) =>
                    i === index
                    ? {
                        ...portfolio,
                        ...payload,
                        }
                    : portfolio
                ),
            },
        })),

        removePortfolio: (
        index
        ) =>
        set((state) => ({
            resume: {
            ...state.resume,

            portfolios:
                state.resume.portfolios.filter(
                (_, i) =>
                    i !== index
                ),
            },
        })),

      /* =========================
         Certificate
      ========================= */

      addCertificate: () =>
        set((state) => ({
          resume: {
            ...state.resume,

            certificates: [
              ...state.resume
                .certificates,

              createCertificate(),
            ],
          },
        })),

      updateCertificate: (
        index,
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            certificates:
              state.resume.certificates.map(
                (
                  certificate,
                  i
                ) =>
                  i === index
                    ? {
                        ...certificate,
                        ...payload,
                      }
                    : certificate
              ),
          },
        })),

      removeCertificate: (
        index
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            certificates:
              state.resume.certificates.filter(
                (_, i) =>
                  i !== index
              ),
          },
        })),

      /* =========================
         Career
      ========================= */

      addCareer: () =>
        set((state) => ({
            resume: {
            ...state.resume,

            careers: [
                ...state.resume.careers,

                createCareer(),
            ],
            },
        })),

      updateCareer: (
        index,
        payload
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            careers:
              state.resume.careers.map(
                (
                  career,
                  i
                ) =>
                  i === index
                    ? {
                        ...career,
                        ...payload,
                      }
                    : career
              ),
          },
        })),

      removeCareer: (
        index
      ) =>
        set((state) => ({
          resume: {
            ...state.resume,

            careers:
              state.resume.careers.filter(
                (_, i) =>
                  i !== index
              ),
          },
        })),
    }),
    {
      name: "articlue-resume-store",
      // 구버전 버그: interviewService.js가 state.resumeId(잘못된 경로)에 값을 썼던 데이터 정리
      migrate: (persistedState) => {
        if (persistedState && "resumeId" in persistedState) {
          delete persistedState.resumeId;
        }
        return persistedState;
      },
      version: 1,
    }
  )
);