import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import PageHero from "../../components/common/PageHero";

export default function CoverLetterPage() {
  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    coverLetters,
    setCoverLetters,
  ] = useState([]);

  useEffect(() => {
    loadCoverLetters();
  }, []);

  const loadCoverLetters =
    async () => {
      try {
        /*
        const response =
          await getCoverLetters();

        setCoverLetters(
          response.data
        );
        */

        setCoverLetters([]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

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
        badge="자소서 관리"
        title="생성된 자기소개서를 관리하세요"
        description="기업별 자기소개서 생성 이력을 확인하고 다시 열람할 수 있습니다."
        statTitle="생성 개수"
        statValue={`${coverLetters.length}건`}
        statDescription="누적 생성 자기소개서"
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
        <h2
          className="
            text-2xl
            font-black
            mb-6
          "
        >
          생성 기록
        </h2>

        {loading && (
          <div>
            불러오는 중...
          </div>
        )}

        {!loading &&
          coverLetters.length ===
            0 && (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-slate-300
                p-10
                text-center
                text-slate-500
              "
            >
              생성된 자기소개서가
              없습니다.
            </div>
          )}

        {!loading &&
          coverLetters.map(
            (item) => (
              <div
                key={
                  item.coverLetterId
                }
                className="
                  flex
                  items-center
                  justify-between
                  py-6
                  border-b
                  border-slate-200
                "
              >
                <div>
                  <div
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    {
                      item.companyName
                    }{" "}
                    {
                      item.jobTitle
                    }
                  </div>

                  <div
                    className="
                      mt-2
                      text-slate-500
                    "
                  >
                    {
                      item.createdAt
                    }
                  </div>
                </div>

                <button
                  type="button"
                  className="
                    px-5
                    py-2
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-semibold
                  "
                  onClick={() =>
                    navigate(
                      `/cover-letters/${item.coverLetterId}`
                    )
                  }
                >
                  보기
                </button>
              </div>
            )
          )}
      </section>
    </div>
  );
}