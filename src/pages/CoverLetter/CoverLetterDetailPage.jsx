import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageHero from "../../components/common/PageHero";

export default function CoverLetterDetailPage() {
  const { coverLetterId } =
    useParams();

  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    coverLetter,
    setCoverLetter,
  ] = useState(null);

  useEffect(() => {
    loadCoverLetter();
  }, [coverLetterId]);

  const loadCoverLetter =
    async () => {
      try {
        /*
        const response =
          await getCoverLetterDetail(
            coverLetterId
          );

        setCoverLetter(
          response.data
        );
        */

        setCoverLetter(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleCopy =
    async () => {
      if (
        !coverLetter?.items
      ) {
        return;
      }

      const text =
        coverLetter.items
          .map(
            (item) =>
              `${item.question}\n\n${item.answer}`
          )
          .join("\n\n\n");

      await navigator.clipboard.writeText(
        text
      );

      alert(
        "복사되었습니다."
      );
    };

  const handlePdfDownload =
    () => {
      /*
      GET
      /api/cover-letters/{id}/pdf
      */
    };

  const handleEdit =
    () => {
      navigate(
        `/cover-letter/edit/${coverLetterId}`
      );
    };

  if (loading) {
    return (
      <div
        className="
          mx-auto
          max-w-[1120px]
          py-10
        "
      >
        로딩중...
      </div>
    );
  }

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-10
        py-6
      "
    >
      <PageHero
        badge="자소서 상세"
        title={
          coverLetter
            ? `${coverLetter.companyName} ${coverLetter.jobTitle}`
            : "자기소개서"
        }
        description="생성된 자기소개서를 확인하고 관리할 수 있습니다."
        statTitle="문항 수"
        statValue={
          coverLetter?.items
            ?.length || 0
        }
        statDescription="생성된 문항"
      />

      <section
        className="
          rounded-[32px]
          border
          border-slate-200
          bg-white
          p-8
        "
      >
        {!coverLetter && (
          <div
            className="
              text-center
              text-slate-500
            "
          >
            자기소개서가
            존재하지 않습니다.
          </div>
        )}

        {coverLetter && (
          <>
            <div
              className="
                flex
                justify-end
                gap-3
                mb-8
              "
            >
              <button
                type="button"
                onClick={
                  handleCopy
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  border
                "
              >
                복사하기
              </button>

              <button
                type="button"
                onClick={
                  handlePdfDownload
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  border
                "
              >
                PDF 저장
              </button>

              <button
                type="button"
                onClick={
                  handleEdit
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                "
              >
                수정하기
              </button>
            </div>

            {coverLetter.items.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.coverLetterItemId
                  }
                  className="
                    mb-10
                    pb-10
                    border-b
                    border-slate-200
                  "
                >
                  <div
                    className="
                      text-xl
                      font-black
                      mb-5
                    "
                  >
                    Q
                    {index + 1}
                  </div>

                  <div
                    className="
                      font-bold
                      text-slate-800
                      mb-4
                    "
                  >
                    {
                      item.question
                    }
                  </div>

                  <div
                    className="
                      whitespace-pre-wrap
                      leading-8
                      text-slate-700
                    "
                  >
                    {
                      item.answer
                    }
                  </div>
                </div>
              )
            )}
          </>
        )}
      </section>
    </div>
  );
}