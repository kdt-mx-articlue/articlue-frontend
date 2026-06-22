export function getResumeSectionStatus(
  resume
) {
  return {
    github:
      resume.github.connected
        ? "complete"
        : "empty",

    resumeInfo: (() => {
      const count = [
        resume.resumeInfo
          .resumeTitle,

        resume.resumeInfo
          .desiredJob,

        resume.resumeInfo
          .introduction?.trim(),

        resume.desiredLocations
          .length > 0,
      ].filter(Boolean).length;

      if (count === 0) {
        return "empty";
      }

      if (count < 4) {
        return "progress";
      }

      return "complete";
    })(),

    tech: (() => {
      const techCount =
        resume.techStack.techs
          ?.length || 0;

      if (techCount === 0) {
        return "empty";
      }

      return "complete";
    })(),

    education: (() => {
      const {
        educationType,
        highschool,
        universities,
        graduates,
      } = resume.education;

      if (!educationType) {
        return "empty";
      }

      const highschoolComplete =
        highschool.isGed ||
        !!highschool.schoolName;

      const universityComplete =
        universities.some(
          (item) =>
            item.schoolName &&
            item.major
        );

      const graduateComplete =
        graduates.some(
          (item) =>
            item.schoolName &&
            item.major
        );

      if (
        educationType ===
        "highschool"
      ) {
        return highschoolComplete
          ? "complete"
          : "progress";
      }

      if (
        educationType ===
        "university"
      ) {
        return highschoolComplete &&
          universityComplete
          ? "complete"
          : "progress";
      }

      if (
        educationType ===
        "graduate"
      ) {
        return highschoolComplete &&
          universityComplete &&
          graduateComplete
          ? "complete"
          : "progress";
      }

      return "empty";
    })(),

    experience:
      resume.experiences.some(
        (item) =>
          item.experienceName &&
          item.context
      )
        ? "complete"
        : "empty",

    coverLetter:
      resume.coverLetter.items.some(
        (item) =>
          item.content?.trim()
            .length >= 100
      )
        ? "complete"
        : "empty",

    portfolio:
      resume.portfolios.length > 0
        ? "complete"
        : "empty",

    certificate:
      resume.certificates.some(
        (item) =>
          item.certificateName &&
          item.acquiredYm
      )
        ? "complete"
        : "empty",

    career:
      resume.careers.some(
        (item) =>
          item.companyName &&
          item.position &&
          item.mainAchievement
      )
        ? "complete"
        : "empty",
  };
}

export function getResumeProgress(
  sectionStatus
) {
  const values =
    Object.values(
      sectionStatus
    );

  const score =
    values.reduce(
      (
        total,
        status
      ) => {
        if (
          status === "complete"
        ) {
          return total + 1;
        }

        if (
          status === "progress"
        ) {
          return total + 0.5;
        }

        return total;
      },
      0
    );

  return Math.round(
    (score /
      values.length) *
      100
  );
}