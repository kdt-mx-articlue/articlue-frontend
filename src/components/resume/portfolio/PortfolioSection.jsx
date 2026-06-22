import { useRef } from "react";

import { useResumeStore } from "../../../store/resumeStore";

export default function PortfolioSection() {
  const portfolios =
    useResumeStore(
      (state) =>
        state.resume.portfolios
    );

  const addPortfolio =
    useResumeStore(
      (state) =>
        state.addPortfolio
    );

  const updatePortfolio =
    useResumeStore(
      (state) =>
        state.updatePortfolio
    );

  const removePortfolio =
    useResumeStore(
      (state) =>
        state.removePortfolio
    );

  const fileInputRef =
    useRef(null);

  const handleFiles = (
    files
  ) => {
    Array.from(files).forEach(
      (file, index) => {
        addPortfolio({
          portfolioId: null,

          portfolioTitle:
            file.name.replace(
              /\.[^/.]+$/,
              ""
            ),

          portfolioUrl: "",

          originalFileName:
            file.name,

          fileSize:
            file.size,

          representativeYn:
            portfolios.length ===
              0 && index === 0
              ? "Y"
              : "N",

          file,
        });
      }
    );
  };

  const handleFileChange = (
    e
  ) => {
    const files =
      e.target.files;

    if (!files) {
      return;
    }

    handleFiles(files);
  };

  const handleDrop = (
    e
  ) => {
    e.preventDefault();

    handleFiles(
      e.dataTransfer.files
    );
  };

  const handleDragOver = (
    e
  ) => {
    e.preventDefault();
  };

  const formatSize = (
    size
  ) => {
    return `${(
      size /
      1024 /
      1024
    ).toFixed(2)} MB`;
  };

  const setRepresentative =
    (index) => {
      portfolios.forEach(
        (_, i) => {
          updatePortfolio(
            i,
            {
              representativeYn:
                i === index
                  ? "Y"
                  : "N",
            }
          );
        }
      );
    };

  return (
    <section
      className="section"
      id="section-portfolio"
    >
      <div className="section-head">
        <div>
          <h2>
            9. 포트폴리오
          </h2>

          <p>
            PDF
            형태의 포트폴리오를
            등록해주세요.
          </p>
        </div>
      </div>

      <div
        className="drop-zone"
        onDrop={
          handleDrop
        }
        onDragOver={
          handleDragOver
        }
        onClick={() =>
          fileInputRef.current?.click()
        }
      >
        <strong>
          파일 업로드
        </strong>

        <p>
          클릭하거나
          파일을 드래그하여
          업로드하세요.
        </p>

        <p>
          PDF
        </p>

        <input
          ref={
            fileInputRef
          }
          type="file"
          multiple
          hidden
          accept=".pdf"
          onChange={
            handleFileChange
          }
        />
      </div>

      {portfolios.length >
        0 && (
        <div
          className="file-state"
        >
          <div
            className="file-list-head"
          >
            <strong>
              업로드된
              포트폴리오
            </strong>

            <span>
              {
                portfolios.length
              }
              개
            </span>
          </div>

          {portfolios.map(
            (
              portfolio,
              index
            ) => (
              <div
                key={index}
                className="file-item"
              >
                <div className="file-item-name">
                  <strong>
                    {
                      portfolio.portfolioTitle
                    }
                  </strong>

                  <div>
                    {
                      portfolio.originalFileName
                    }
                  </div>

                  <div
                    className="field-helper"
                  >
                    {formatSize(
                      portfolio.fileSize
                    )}
                  </div>

                  {portfolio.representativeYn ===
                    "Y" && (
                    <div
                      style={{
                        marginTop:
                          "8px",

                        color:
                          "#16a34a",

                        fontWeight:
                          "700",
                      }}
                    >
                      대표
                      포트폴리오
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",
                  }}
                >
                  {portfolio.representativeYn !==
                    "Y" && (
                    <button
                      type="button"
                      className="btn-soft"
                      onClick={() =>
                        setRepresentative(
                          index
                        )
                      }
                    >
                      대표 설정
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() =>
                      removePortfolio(
                        index
                      )
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}