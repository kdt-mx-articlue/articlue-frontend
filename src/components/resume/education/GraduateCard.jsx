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

const GPA_OPTIONS = [
  "4.5",
  "4.3",
  "4.0",
];

export default function GraduateCard({
  graduate,
  index,
  onChange,
  onDelete,
  canDelete,
}) {
  const updateField = (
    field,
    value
  ) => {
    onChange({
      ...graduate,
      [field]: value,
    });
  };

  const getDateLabel = () => {
    switch (
      graduate.graduationStatus
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
    <div className="repeat-card">
      <div className="repeat-head">
        <strong>
          대학원 {index + 1}
        </strong>

        {canDelete && (
          <button
            type="button"
            className="btn-danger"
            onClick={onDelete}
          >
            삭제
          </button>
        )}
      </div>

      <div className="grid-2">
        <div className="field">
          <label>
            대학원명
          </label>

          <SchoolSearch
            value={
              graduate.schoolName
            }
            onChange={(
              value
            ) =>
              updateField(
                "schoolName",
                value
              )
            }
            placeholder="대학원 검색"
          />
        </div>

        <div className="field">
          <label>
            학위 과정
          </label>

          <select
            value={
              graduate.degree
            }
            onChange={(e) =>
              updateField(
                "degree",
                e.target.value
              )
            }
          >
            <option value="석사">
              석사
            </option>

            <option value="박사">
              박사
            </option>

            <option value="석박통합">
              석박통합
            </option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>
            전공
          </label>

          <input
            type="text"
            value={
              graduate.major
            }
            placeholder="전공 입력"
            onChange={(e) =>
              updateField(
                "major",
                e.target.value
              )
            }
          />
        </div>

        <div className="field">
          <label>
            입학일
          </label>

          <input
            type="month"
            value={
              graduate.startYm
            }
            onChange={(e) =>
              updateField(
                "startYm",
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>
            학점
          </label>

          <input
            type="number"
            step="0.01"
            value={
              graduate.gpa
            }
            placeholder="4.12"
            onChange={(e) =>
              updateField(
                "gpa",
                e.target.value
              )
            }
          />
        </div>

        <div className="field">
          <label>
            만점 기준
          </label>

          <select
            value={
              graduate.gpaScale
            }
            onChange={(e) =>
              updateField(
                "gpaScale",
                e.target.value
              )
            }
          >
            {GPA_OPTIONS.map(
              (
                scale
              ) => (
                <option
                  key={scale}
                  value={scale}
                >
                  {scale}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>
            학적 상태
          </label>

          <select
            value={
              graduate.graduationStatus
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

        <div className="field">
          <label>
            {getDateLabel()}
          </label>

          <input
            type="month"
            value={
              graduate.endYm
            }
            onChange={(e) =>
              updateField(
                "endYm",
                e.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
}