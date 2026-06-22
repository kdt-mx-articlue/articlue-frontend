import {
  useResumeStore,
} from "../../../store/resumeStore";

import HighschoolCard from "./HighschoolCard";
import UniversityCard from "./UniversityCard";
import GraduateCard from "./GraduateCard";

export default function EducationSection() {
  const {
    resume,

    updateEducationType,
    updateHighschool,

    addUniversity,
    updateUniversity,
    removeUniversity,

    addGraduate,
    updateGraduate,
    removeGraduate,
  } = useResumeStore();

  const education =
    resume.education;

  const {
    educationType,
    highschool,
    universities,
    graduates,
  } = education;

  return (
    <section
      className="section"
      id="section-education"
    >
      <div className="section-head">
        <div>
          <h2>
            4. 학력 사항
          </h2>

          <p>
            최종 학력을 선택하고
            학력 정보를 입력해주세요.
          </p>
        </div>
      </div>

      <div className="field">
        <label>
          최종 학력
        </label>

        <select
          value={educationType}
          onChange={(e) =>
            updateEducationType(
              e.target.value
            )
          }
        >
          <option value="">
            선택해주세요
          </option>

          <option value="highschool">
            고등학교
          </option>

          <option value="university">
            대학교
          </option>

          <option value="graduate">
            대학원
          </option>
        </select>
      </div>

      {educationType && (
        <HighschoolCard
          highschool={
            highschool
          }
          onChange={
            updateHighschool
          }
        />
      )}

      {(educationType ===
        "university" ||
        educationType ===
          "graduate") && (
        <div className="education-card">
          <div className="card-title">
            대학교 정보
          </div>

          {universities.map(
            (
              university,
              index
            ) => (
              <UniversityCard
                key={index}
                index={index}
                university={
                  university
                }
                canDelete={
                  universities.length >
                  1
                }
                onDelete={() =>
                  removeUniversity(
                    index
                  )
                }
                onChange={(
                  updated
                ) =>
                  updateUniversity(
                    index,
                    updated
                  )
                }
              />
            )
          )}

          <button
            type="button"
            className="btn-primary"
            style={{
              marginTop:
                "20px",
            }}
            onClick={
              addUniversity
            }
          >
            + 대학교 추가
          </button>
        </div>
      )}

      {educationType ===
        "graduate" && (
        <div className="education-card">
          <div className="card-title">
            대학원 정보
          </div>

          {graduates.map(
            (
              graduate,
              index
            ) => (
              <GraduateCard
                key={index}
                index={index}
                graduate={
                  graduate
                }
                canDelete={
                  graduates.length >
                  1
                }
                onDelete={() =>
                  removeGraduate(
                    index
                  )
                }
                onChange={(
                  updated
                ) =>
                  updateGraduate(
                    index,
                    updated
                  )
                }
              />
            )
          )}

          <button
            type="button"
            className="btn-primary"
            style={{
              marginTop:
                "20px",
            }}
            onClick={
              addGraduate
            }
          >
            + 대학원 추가
          </button>
        </div>
      )}
    </section>
  );
}