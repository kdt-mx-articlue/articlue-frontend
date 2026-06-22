import {
  useResumeStore,
} from "../../../store/resumeStore";

export default function CareerSection() {
  const careers =
    useResumeStore(
      (state) =>
        state.resume.careers
    );

  const addCareer =
    useResumeStore(
      (state) =>
        state.addCareer
    );

  const updateCareer =
    useResumeStore(
      (state) =>
        state.updateCareer
    );

  const removeCareer =
    useResumeStore(
      (state) =>
        state.removeCareer
    );

  return (
    <section
      className="section"
      id="section-career"
    >
      <div className="section-head">
        <div>
          <h2>
            6. 경력 사항
          </h2>

          <p>
            인턴, 계약직,
            정규직 등 실제
            경력을 입력해주세요.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={addCareer}
        >
          + 경력 추가
        </button>
      </div>

      {careers.map(
        (
          career,
          index
        ) => (
          <div
            key={index}
            className="repeat-card"
          >
            <div className="repeat-head">
              <strong>
                경력 {index + 1}
              </strong>

              {careers.length >
                1 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() =>
                    removeCareer(
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
                  회사명
                </label>

                <input
                  type="text"
                  value={
                    career.companyName
                  }
                  placeholder="회사명 입력"
                  onChange={(
                    e
                  ) =>
                    updateCareer(
                      index,
                      {
                        companyName:
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
                  부서
                </label>

                <input
                  type="text"
                  value={
                    career.department
                  }
                  placeholder="개발팀"
                  onChange={(
                    e
                  ) =>
                    updateCareer(
                      index,
                      {
                        department:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>
                  직무
                </label>

                <input
                  type="text"
                  value={
                    career.position
                  }
                  placeholder="백엔드 인턴"
                  onChange={(
                    e
                  ) =>
                    updateCareer(
                      index,
                      {
                        position:
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
                  시작일
                </label>

                <input
                  type="month"
                  value={
                    career.startYm
                  }
                  onChange={(
                    e
                  ) =>
                    updateCareer(
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
            </div>

            <div className="field">
              <label>
                종료일
              </label>

              <input
                type="month"
                value={
                  career.endYm
                }
                onChange={(
                  e
                ) =>
                  updateCareer(
                    index,
                    {
                      endYm:
                        e.target
                          .value,
                    }
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                주요 성과
              </label>

              <textarea
                rows={6}
                value={
                  career.mainAchievement
                }
                placeholder="담당 업무, 성과, 사용 기술 등을 작성해주세요."
                onChange={(
                  e
                ) =>
                  updateCareer(
                    index,
                    {
                      mainAchievement:
                        e.target
                          .value,
                    }
                  )
                }
              />
            </div>
          </div>
        )
      )}
    </section>
  );
}