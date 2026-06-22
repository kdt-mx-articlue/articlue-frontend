import { useEffect, useState } from "react";

import PageHero from "../../components/common/PageHero";

import RecommendationCard from "../../components/dashboard/RecommendationCard";

import FavoriteSearchSection from "../../components/dashboard/FavoriteSearchSection";

import { loadDashboard } from "../../services/dashboardService";

export default function MatchingPage() {
  const [loading, setLoading] =
    useState(true);

  const [companies, setCompanies] =
    useState([]);

  async function fetchData() {
    try {
      const response =
        await loadDashboard();

      const favoriteIds =
        JSON.parse(
          localStorage.getItem(
            "favoriteCompanies"
          ) || "[]"
        );

      setCompanies(
        (response.companies || []).map(
          (company) => ({
            ...company,

            is_favorite:
              favoriteIds.includes(
                company.job_posting_id
              ),
          })
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleToggleFavorite(
    jobPostingId
  ) {
    setCompanies((prev) => {
      const updated =
        prev.map((company) =>
          company.job_posting_id ===
          jobPostingId
            ? {
                ...company,

                is_favorite:
                  !company.is_favorite,
              }
            : company
        );

      const favoriteIds =
        updated
          .filter(
            (company) =>
              company.is_favorite
          )
          .map(
            (company) =>
              company.job_posting_id
          );

      localStorage.setItem(
        "favoriteCompanies",
        JSON.stringify(
          favoriteIds
        )
      );

      return updated;
    });
  }

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const sortedCompanies =
    [...companies]
      .sort((a, b) => {
        if (
          b.overall_score !==
          a.overall_score
        ) {
          return (
            b.overall_score -
            a.overall_score
          );
        }

        if (
          b.metrics.tech_stack_fit
            .score !==
          a.metrics.tech_stack_fit
            .score
        ) {
          return (
            b.metrics
              .tech_stack_fit.score -
            a.metrics
              .tech_stack_fit.score
          );
        }

        if (
          b.metrics.business_fit
            .score !==
          a.metrics.business_fit
            .score
        ) {
          return (
            b.metrics.business_fit
              .score -
            a.metrics.business_fit
              .score
          );
        }

        if (
          b.metrics.requirement_fit
            .score !==
          a.metrics.requirement_fit
            .score
        ) {
          return (
            b.metrics
              .requirement_fit.score -
            a.metrics
              .requirement_fit.score
          );
        }

        if (
          b.metrics
            .action_result_fit
            .score !==
          a.metrics
            .action_result_fit
            .score
        ) {
          return (
            b.metrics
              .action_result_fit
              .score -
            a.metrics
              .action_result_fit
              .score
          );
        }

        return (
          b.metrics.culture_fit
            .score -
          a.metrics.culture_fit
            .score
        );
      });

  const topCompanies =
    sortedCompanies.slice(0, 3);

  const favoriteCompanies =
    companies.filter(
      (company) =>
        company.is_favorite
    );

  const bestScore =
    topCompanies[0]
      ?.overall_score ?? 0;

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-10
      "
    >
      <PageHero
        badge="기업 탐색"
        subBadge="AI 기반 기업 추천"
        title="이력서 기반 AI 분석으로 나에게 가장 적합한 기업과 직무를 찾아보세요"
        description="기업 공고와 이력서를 비교해 가장 높은 적합도를 가진 기업을 추천합니다."
        statTitle="최고 매칭률"
        statValue={`${bestScore.toFixed(
          2
        )}%`}
        statDescription="1차 직무 매칭 결과 기준"
        progressValue={bestScore}
      />

      {/* 추천 기업 TOP3 */}

      <section>

        <h2
          className="
            mb-6
            text-[24px]
            font-black
          "
        >
          추천 기업 TOP3
        </h2>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {topCompanies.map(
            (company) => (
              <RecommendationCard
                key={
                  company.job_posting_id
                }
                company={company}
                onToggleFavorite={
                  handleToggleFavorite
                }
              />
            )
          )}
        </div>

      </section>

      {/* 기업 검색 */}

      <FavoriteSearchSection />

      {/* 관심 기업 */}

      <section>

        <h2
          className="
            mb-6
            text-[24px]
            font-black
          "
        >
          관심 기업
        </h2>

        {favoriteCompanies.length >
        0 ? (
          <div
            className="
              flex
              gap-6
              overflow-x-auto
              pb-2
            "
          >
            {favoriteCompanies.map(
              (company) => (
                <div
                  key={
                    company.job_posting_id
                  }
                  className="
                    min-w-[340px]
                  "
                >
                  <RecommendationCard
                    company={company}
                    onToggleFavorite={
                      handleToggleFavorite
                    }
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className="
              rounded-[28px]
              border
              border-dashed
              border-slate-300
              bg-white
              p-12
              text-center
              text-slate-500
            "
          >
            관심 기업이 없습니다.
          </div>
        )}

      </section>

    </div>
  );
}