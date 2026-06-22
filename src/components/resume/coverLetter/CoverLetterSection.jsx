import {
  useResumeStore,
} from "../../../store/resumeStore";

export default function CoverLetterSection() {
  const coverLetter =
    useResumeStore(
      (state) =>
        state.resume.coverLetter
    );

  const updateCoverLetterItem =
    useResumeStore(
      (state) =>
        state.updateCoverLetterItem
    );

  const addCoverLetterItem =
    useResumeStore(
      (state) =>
        state.addCoverLetterItem
    );

  const removeCoverLetterItem =
    useResumeStore(
      (state) =>
        state.removeCoverLetterItem
    );

  const getTotalLength = () => {
    return coverLetter.items.reduce(
      (total, item) =>
        total +
        (item.content?.length || 0),
      0
    );
  };

  return (
    <section
      className="section"
      id="section-cover-letter"
    >
      <div className="section-head">
        <div>
          <h2>
            8. 자기소개서
          </h2>

          <p>
            지원 동기, 프로젝트 경험,
            성장 목표 등을 자유롭게
            작성해주세요.
          </p>
        </div>

        <div className="field-helper">
          총 글자 수 : {getTotalLength()}자
        </div>
      </div>

      {coverLetter.items.map(
        (item, index) => (
          <div
            key={index}
            className="repeat-card"
          >
            <div className="repeat-head">
              <strong>
                문항 {index + 1}
              </strong>

              {coverLetter.items
                .length > 3 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() =>
                    removeCoverLetterItem(
                      index
                    )
                  }
                >
                  삭제
                </button>
              )}
            </div>

            <div className="field">
              <label>
                소제목
              </label>

              <input
                type="text"
                maxLength={200}
                value={
                  item.subTitle
                }
                placeholder="예: 지원 동기"
                onChange={(e) =>
                  updateCoverLetterItem(
                    index,
                    {
                      subTitle:
                        e.target.value,
                    }
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                내용
              </label>

              <textarea
                rows={10}
                value={
                  item.content
                }
                placeholder="내용을 입력해주세요."
                onChange={(e) =>
                  updateCoverLetterItem(
                    index,
                    {
                      content:
                        e.target.value,
                    }
                  )
                }
              />

              <div className="field-helper">
                {
                  item.content
                    ?.length || 0
                }
                자
              </div>
            </div>
          </div>
        )
      )}

      <button
        type="button"
        className="btn-primary"
        onClick={
          addCoverLetterItem
        }
      >
        + 문항 추가
      </button>
    </section>
  );
}