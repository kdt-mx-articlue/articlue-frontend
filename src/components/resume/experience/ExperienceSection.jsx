import {
  useResumeStore,
} from "../../../store/resumeStore";

const EXPERIENCE_TYPES = [
  "교육",
  "프로젝트",
  "공모전",
  "대외활동",
  "동아리",
  "봉사활동",
  "인턴십",
  "연구",
  "기타",
];

export default function ExperienceSection() {
  const experiences =
    useResumeStore(
      (state) =>
        state.resume.experiences
    );

  const addExperience =
    useResumeStore(
      (state) =>
        state.addExperience
    );

  const updateExperience =
    useResumeStore(
      (state) =>
        state.updateExperience
    );

  const removeExperience =
    useResumeStore(
      (state) =>
        state.removeExperience
    );

  return (
    <section
      className="section"
      id="section-experience"
    >
      <div className="section-head">
        <div>
          <h2>
            5. 활동 / 경험
          </h2>

          <p>
            교육, 프로젝트,
            공모전, 대외활동 등
            직무와 관련된 경험을
            입력해주세요.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={
            addExperience
          }
        >
          + 경험 추가
        </button>
      </div>

      {experiences.map(
        (
          experience,
          index
        ) => (
          <div
            key={index}
            className="repeat-card"
          >
            <div className="repeat-head">
              <strong>
                경험 {index + 1}
              </strong>

              {experiences.length >
                1 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() =>
                    removeExperience(
                      index
                    )
                  }
                >
                  삭제
                </button>
              )}
            </div>

            <div className="grid-2">
              <div className="field">
                <label>
                  활동 구분
                </label>

                <select
                  value={
                    experience.experienceType
                  }
                  onChange={(
                    e
                  ) =>
                    updateExperience(
                      index,
                      {
                        experienceType:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                >
                  <option value="">
                    선택
                  </option>

                  {EXPERIENCE_TYPES.map(
                    (
                      type
                    ) => (
                      <option
                        key={
                          type
                        }
                        value={
                          type
                        }
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="field">
                <label>
                  활동명
                </label>

                <input
                  type="text"
                  value={
                    experience.experienceName
                  }
                  placeholder="예: 동아 MX School"
                  onChange={(
                    e
                  ) =>
                    updateExperience(
                      index,
                      {
                        experienceName:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>
                활동 내용
              </label>

              <textarea
                rows={5}
                value={
                  experience.context
                }
                placeholder="수행한 역할, 프로젝트 내용, 성과 등을 작성해주세요."
                onChange={(
                  e
                ) =>
                  updateExperience(
                    index,
                    {
                      context:
                        e.target
                          .value,
                    }
                  )
                }
              />
            </div>

            <div className="grid-2">
              <div className="field">
                <label>
                  시작일
                </label>

                <input
                  type="month"
                  value={
                    experience.startYm
                  }
                  onChange={(
                    e
                  ) =>
                    updateExperience(
                      index,
                      {
                        startYm:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  종료일
                </label>

                <input
                  type="month"
                  value={
                    experience.endYm
                  }
                  onChange={(
                    e
                  ) =>
                    updateExperience(
                      index,
                      {
                        endYm:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                />
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
}