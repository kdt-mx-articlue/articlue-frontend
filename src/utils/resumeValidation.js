export function validateResume(
  resume
) {
  const errors = [];

  /* =========================
     GitHub
  ========================= */

  if (
    !resume.github.connected
  ) {
    errors.push(
      "GitHub 연동"
    );
  }

  /* =========================
     Resume Info
  ========================= */

  if (
    !resume.resumeInfo
      .resumeTitle?.trim()
  ) {
    errors.push(
      "이력서 제목"
    );
  }

  if (
    !resume.resumeInfo
      .desiredJob?.trim()
  ) {
    errors.push(
      "희망 직무"
    );
  }

  if (
    !resume.resumeInfo
      .introduction?.trim()
  ) {
    errors.push(
      "한줄 소개"
    );
  }

  if (
    resume.desiredLocations
      .length === 0
  ) {
    errors.push(
      "희망 근무지역"
    );
  }

  /* =========================
     Tech Stack
  ========================= */

  if (
    resume.techStack.techs
      .length === 0
  ) {
    errors.push(
      "기술 스택"
    );
  }

  /* =========================
     Education
  ========================= */

  const education =
    resume.education;

  if (
    !education.educationType
  ) {
    errors.push(
      "최종 학력"
    );
  }

  else if (
    education.educationType ===
    "highschool"
  ) {
    if (
      !education.highschool
        .isGed &&
      !education.highschool
        .schoolName?.trim()
    ) {
      errors.push(
        "고등학교명"
      );
    }
  }

  else if (
    education.educationType ===
    "university"
  ) {
    const university =
      education.universities?.[0];

    if (
      !university?.schoolName?.trim()
    ) {
      errors.push(
        "대학교명"
      );
    }

    if (
      !university?.major?.trim()
    ) {
      errors.push(
        "대학교 전공"
      );
    }
  }

  else if (
    education.educationType ===
    "graduate"
  ) {
    const university =
      education.universities?.[0];

    const graduate =
      education.graduates?.[0];

    if (
      !university?.schoolName?.trim()
    ) {
      errors.push(
        "대학교명"
      );
    }

    if (
      !university?.major?.trim()
    ) {
      errors.push(
        "대학교 전공"
      );
    }

    if (
      !graduate?.schoolName?.trim()
    ) {
      errors.push(
        "대학원명"
      );
    }

    if (
      !graduate?.major?.trim()
    ) {
      errors.push(
        "대학원 전공"
      );
    }
  }

  /* =========================
     Experience
  ========================= */

  const hasExperience =
    resume.experiences.some(
      (
        experience
      ) =>
        experience
          .experienceName?.trim() &&
        experience.context?.trim()
    );

  if (
    !hasExperience
  ) {
    errors.push(
      "활동 경험"
    );
  }

  /* =========================
    Cover Letter
    ========================= */

    const requiredQuestions =
        resume.coverLetter.items.slice(
            0,
            3
        );

        requiredQuestions.forEach(
        (item, index) => {
            const length =
            item.content
                ?.trim()
                .length || 0;

            if (length < 500) {
            errors.push(
                `자기소개서 ${
                index + 1
                }번 문항 (500자 이상)`
            );
            }
        }
        );

  return {
    valid:
      errors.length === 0,

    errors,
  };
}