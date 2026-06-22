import SchoolSearch from "../../common/SchoolSearch";

const STATUS_OPTIONS = [
  {
    value: "재학",
    label: "재학",
  },
  {
    value: "졸업",
    label: "졸업",
  },
  {
    value: "휴학",
    label: "휴학",
  },
  {
    value: "수료",
    label: "수료",
  },
  {
    value: "자퇴",
    label: "자퇴",
  },
  {
    value: "제적",
    label: "제적",
  },
];

export default function HighschoolCard({
  highschool,
  onChange,
}) {
  const updateField = (
    field,
    value
  ) => {
    onChange({
      ...highschool,
      [field]: value,
    });
  };

  const getDateLabel = () => {
    switch (
      highschool.graduationStatus
    ) {
      case "졸업":
        return "졸업일";

      case "휴학":
        return "휴학일";

      case "수료":
        return "수료일";

      case "자퇴":
        return "자퇴일";

      case "제적":
        return "제적일";

      default:
        return "졸업 예정일";
    }
  };

  return (
    <div className="education-card">
      <div className="card-title">
        고등학교 정보
      </div>

      <div className="checkbox-row">
        <input
          id="gedCheck"
          type="checkbox"
          checked={
            highschool.isGed
          }
          onChange={(e) =>
            updateField(
              "isGed",
              e.target.checked
            )
          }
        />

        <label htmlFor="gedCheck">
          검정고시
        </label>
      </div>

      {!highschool.isGed && (
        <>
          <div className="grid-2">
            <div className="field">
              <label>
                고등학교명
              </label>

              <SchoolSearch
                value={
                  highschool.schoolName
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "schoolName",
                    value
                  )
                }
                placeholder="학교명 검색"
              />
            </div>

            <div className="field">
              <label>
                계열
              </label>

              <select
                value={
                  highschool.track
                }
                onChange={(e) =>
                  updateField(
                    "track",
                    e.target.value
                  )
                }
              >
                <option value="">
                  선택
                </option>

                <option value="문과">
                  문과
                </option>

                <option value="이과">
                  이과
                </option>

                <option value="통합">
                  통합
                </option>

                <option value="예체능">
                  예체능
                </option>

                <option value="특성화">
                  특성화
                </option>

                <option value="기타">
                  기타
                </option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>
                입학일
              </label>

              <input
                type="month"
                value={
                  highschool.startYm
                }
                onChange={(e) =>
                  updateField(
                    "startYm",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                학적 상태
              </label>

              <select
                value={
                  highschool.graduationStatus
                }
                onChange={(e) =>
                  updateField(
                    "graduationStatus",
                    e.target.value
                  )
                }
              >
                {STATUS_OPTIONS.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="field">
            <label>
              {getDateLabel()}
            </label>

            <input
              type="month"
              value={
                highschool.endYm
              }
              onChange={(e) =>
                updateField(
                  "endYm",
                  e.target.value
                )
              }
            />
          </div>
        </>
      )}

      {highschool.isGed && (
        <div className="ged-notice">
          검정고시 선택 시 고등학교 정보 입력은
          생략됩니다.
        </div>
      )}
    </div>
  );
}