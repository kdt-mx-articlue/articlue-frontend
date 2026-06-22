import { useResumeStore } from "../../../store/resumeStore";

const REGION_OPTIONS = [
  "서울",
  "경기",
  "광주",
  "전북",
  "전남",
];

const JOB_OPTIONS = [
  "백엔드 개발자",
  "프론트엔드 개발자",
  "풀스택 개발자",
  "모바일 개발자",
  "AI 엔지니어",
  "데이터 엔지니어",
  "데이터 분석가",
  "DevOps 엔지니어",
  "클라우드 엔지니어",
  "QA 엔지니어",
  "보안 엔지니어",
];

export default function ResumeInfoSection() {
  const resume =
    useResumeStore(
      (state) => state.resume
    );

  const updateResumeInfo =
    useResumeStore(
      (state) =>
        state.updateResumeInfo
    );

  const updateDesiredLocations =
    useResumeStore(
      (state) =>
        state.updateDesiredLocations
    );

  const toggleLocation = (
    location
  ) => {
    const current =
      resume.desiredLocations;

    const exists =
      current.includes(location);

    if (exists) {
      updateDesiredLocations(
        current.filter(
          (item) =>
            item !== location
        )
      );

      return;
    }

    if (current.length >= 3) {
      alert(
        "희망 지역은 최대 3개까지 선택 가능합니다."
      );

      return;
    }

    updateDesiredLocations([
      ...current,
      location,
    ]);
  };

  return (
    <section
      className="section"
      id="section-resume-info"
    >
      <div className="section-head">
        <div>
          <h2>
            2. 프로필 정보
          </h2>

          <p>
            기업 추천 및 직무 매칭에
            활용되는 핵심 정보를
            입력해주세요.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>
            이력서 제목
          </label>

          <input
            type="text"
            maxLength={200}
            placeholder="예: 백엔드 개발자 지원 이력서"
            value={
              resume.resumeInfo.resumeTitle
            }
            onChange={(e) =>
              updateResumeInfo({
                resumeTitle:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="field">
          <label>
            희망 직무
          </label>

          <select
            value={
              resume.resumeInfo.desiredJob
            }
            onChange={(e) =>
              updateResumeInfo({
                desiredJob:
                  e.target.value,
              })
            }
          >
            <option value="">
              직무 선택
            </option>

            {JOB_OPTIONS.map(
              (job) => (
                <option
                  key={job}
                  value={job}
                >
                  {job}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="field">
        <label>
          한줄 소개
        </label>

        <textarea
          maxLength={500}
          rows={4}
          placeholder="예: Node.js와 Oracle 기반 백엔드 개발을 지향합니다."
          value={
            resume.resumeInfo.introduction
          }
          onChange={(e) =>
            updateResumeInfo({
              introduction:
                e.target.value,
            })
          }
        />

        <div className="field-helper">
          {
            resume.resumeInfo.introduction
              ?.length
          }
          /500
        </div>
      </div>

      <div className="field">
        <label>
          희망 근무지역
          (최대 3개)
        </label>

        <div className="chip-row">
          {REGION_OPTIONS.map(
            (region) => (
              <button
                key={region}
                type="button"
                className={`chip ${
                  resume.desiredLocations.includes(
                    region
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleLocation(
                    region
                  )
                }
              >
                {region}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}