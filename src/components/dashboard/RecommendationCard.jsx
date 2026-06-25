import CompanyCard from "./CompanyCard";

export default function RecommendationCard({ company, onFavoriteChange, onGenerateCoverLetter }) {
  return <CompanyCard company={company} onFavoriteChange={onFavoriteChange} onGenerateCoverLetter={onGenerateCoverLetter} />;
}

/*
import {
  HiBookmark,
  HiOutlineBookmark,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

export default function RecommendationCard({
  company,
  onToggleFavorite,
}) {
  const navigate =
    useNavigate();

  const score =
    company?.overall_score ?? 0;

  return (
    <article
      className="
        relative
        flex
        aspect-[6/4.2]
        flex-col
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <button
        type="button"
        onClick={() =>
          onToggleFavorite?.(
            company.job_posting_id
          )
        }
        className="
          absolute
          right-5
          top-5
          text-[22px]
          text-slate-400
          transition
          hover:text-blue-600
        "
      >
        {company.is_favorite ? (
          <HiBookmark />
        ) : (
          <HiOutlineBookmark />
        )}
      </button>

      <h3
        className="
          text-[24px]
          font-black
          text-slate-900
        "
      >
        {company.company_name}
      </h3>

      <p
        className="
          mt-2
          text-sm
          text-slate-500
        "
      >
        {company.job_name}
      </p>

      <div className="mt-auto">

        <div
          className="
            mb-2
            text-base
            font-bold
            text-slate-500
          "
        >
          1차 직무 매칭률
        </div>

        <div
          className="
            text-[44px]
            font-black
            text-blue-600
          "
        >
          {score.toFixed(2)}%
        </div>

        <div
          className="
            mt-4
            h-2
            rounded-full
            bg-slate-100
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-blue-600
            "
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <div className="mt-6 space-y-3">

          <button
            onClick={() =>
              navigate(
                `/report/${company.job_posting_id}`
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-blue-600
              py-3
              text-sm
              font-black
              text-blue-600
            "
          >
            분석 리포트 보기
          </button>

          <button
            onClick={() =>
              navigate(
                `/interview/${company.job_posting_id}`
              )
            }
            className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              text-sm
              font-black
              text-white
            "
          >
            모의 면접 보러가기
          </button>

          <button
            onClick={() =>
              navigate(
                `/cover-letter/edit/${coverLetterId}`
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              py-3
              text-sm
              font-black
            "
          >
            자소서 생성
          </button>

        </div>

      </div>
    </article>
  );
}
*/