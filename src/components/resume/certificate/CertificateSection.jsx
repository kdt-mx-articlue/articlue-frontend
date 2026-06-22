import {
  useResumeStore,
} from "../../../store/resumeStore";

export default function CertificateSection() {
  const certificates =
    useResumeStore(
      (state) =>
        state.resume.certificates
    );

  const addCertificate =
    useResumeStore(
      (state) =>
        state.addCertificate
    );

  const updateCertificate =
    useResumeStore(
      (state) =>
        state.updateCertificate
    );

  const removeCertificate =
    useResumeStore(
      (state) =>
        state.removeCertificate
    );

  return (
    <section
      className="section"
      id="section-certificate"
    >
      <div className="section-head">
        <div>
          <h2>
            7. 자격증
          </h2>

          <p>
            보유한 자격증 정보를
            입력해주세요.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={
            addCertificate
          }
        >
          + 자격증 추가
        </button>
      </div>

      {certificates.map(
        (
          certificate,
          index
        ) => (
          <div
            key={index}
            className="repeat-card"
          >
            <div className="repeat-head">
              <strong>
                자격증 {index + 1}
              </strong>

              {certificates.length >
                1 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() =>
                    removeCertificate(
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
                  자격증명
                </label>

                <input
                  type="text"
                  value={
                    certificate.certificateName
                  }
                  placeholder="정보처리기사"
                  onChange={(
                    e
                  ) =>
                    updateCertificate(
                      index,
                      {
                        certificateName:
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
                  발급기관
                </label>

                <input
                  type="text"
                  value={
                    certificate.issuer
                  }
                  placeholder="한국산업인력공단"
                  onChange={(
                    e
                  ) =>
                    updateCertificate(
                      index,
                      {
                        issuer:
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
                취득일
              </label>

              <input
                type="month"
                value={
                  certificate.acquiredYm
                }
                onChange={(
                  e
                ) =>
                  updateCertificate(
                    index,
                    {
                      acquiredYm:
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