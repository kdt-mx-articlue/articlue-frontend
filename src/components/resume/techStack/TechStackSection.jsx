import { useResumeStore } from "../../../store/resumeStore";

import { techStackData } from "../../../data/techStackData";

export default function TechStackSection() {
  const techStack =
    useResumeStore(
      (state) =>
        state.resume.techStack
    );

  const updateTechStack =
    useResumeStore(
      (state) =>
        state.updateTechStack
    );

  const addTech =
    useResumeStore(
      (state) => state.addTech
    );

  const removeTech =
    useResumeStore(
      (state) => state.removeTech
    );

  const languages =
    techStack.languages || [];

  const techs =
    techStack.techs || [];

  const toggleLanguage = (
    languageName
  ) => {
    const exists =
      languages.includes(
        languageName
      );

    if (exists) {
      updateTechStack({
        languages:
          languages.filter(
            (item) =>
              item !==
              languageName
          ),
      });

      return;
    }

    updateTechStack({
      languages: [
        ...languages,
        languageName,
      ],
    });
  };

  const isSelected =
    (techCategoryCode) => {
      return techs.some(
        (item) =>
          item.techCategoryCode ===
          techCategoryCode
      );
    };

  const toggleTech = (
    tech
  ) => {
    if (
      isSelected(
        tech.techCategoryCode
      )
    ) {
      removeTech(
        tech.techCategoryCode
      );

      return;
    }

    addTech(tech);
  };

  return (
    <section
      className="section"
      id="section-tech-stack"
    >
      <div className="section-head">
        <div>
          <h2>
            3. 기술 스택
          </h2>

          <p>
            사용 가능한 프로그래밍
            언어와 기술 스택을
            선택해주세요.
          </p>
        </div>
      </div>

      {/* 선택 기술 */}

      <div
        className="selected-tech-box"
        style={{
          marginBottom:
            "32px",
        }}
      >
        <h4
          className="selected-tech-title"
          style={{
            marginBottom:
              "12px",
          }}
        >
          선택한 기술
        </h4>

        <div className="chip-row">
          {techs.length ===
          0 ? (
            <span>
              선택된 기술 없음
            </span>
          ) : (
            techs.map(
              (tech) => (
                <button
                  key={
                    tech.techCategoryCode
                  }
                  type="button"
                  className="chip active"
                  onClick={() =>
                    removeTech(
                      tech.techCategoryCode
                    )
                  }
                >
                  {tech.techName}
                </button>
              )
            )
          )}
        </div>
      </div>

      {/* 언어 선택 */}

      <div
        className="tech-language-group"
        style={{
          marginBottom:
            "32px",
        }}
      >
        <div className="tech-group-title">
          프로그래밍 언어
        </div>

        <div className="chip-row">
          {techStackData.languages.map(
            (language) => (
              <button
                key={
                  language.techCategoryCode
                }
                type="button"
                className={`chip ${
                  languages.includes(
                    language.techName
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleLanguage(
                    language.techName
                  )
                }
              >
                {
                  language.techName
                }
              </button>
            )
          )}
        </div>
      </div>

      {/* 언어별 스택 */}

      {languages.map(
        (language) => {
          const stacks =
            techStackData
              .frameworks[
              language
            ] || [];

          if (
            stacks.length === 0
          ) {
            return null;
          }

          return (
            <div
              key={language}
              className="tech-language-group"
            >
              <div className="tech-group-title">
                {language}
                {" "}
                관련 기술
              </div>

              <div className="chip-row">
                {stacks.map(
                  (tech) => (
                    <button
                      key={
                        tech.techCategoryCode
                      }
                      type="button"
                      className={`chip ${
                        isSelected(
                          tech.techCategoryCode
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleTech(
                          tech
                        )
                      }
                    >
                      {
                        tech.techName
                      }
                    </button>
                  )
                )}
              </div>
            </div>
          );
        }
      )}

      {/* 공통 기술 */}

      {Object.entries(
        techStackData.common
      ).map(
        ([
          category,
          items,
        ]) => (
          <div
            key={category}
            className="tech-language-group"
          >
            <div className="tech-group-title">
              {category}
            </div>

            <div className="chip-row">
              {items.map(
                (tech) => (
                  <button
                    key={
                      tech.techCategoryCode
                    }
                    type="button"
                    className={`chip ${
                      isSelected(
                        tech.techCategoryCode
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleTech(
                        tech
                      )
                    }
                  >
                    {
                      tech.techName
                    }
                  </button>
                )
              )}
            </div>
          </div>
        )
      )}
    </section>
  );
}